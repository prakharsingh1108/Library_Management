import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Book } from "../models/bookModel.js";
import { Borrow } from "../models/borrowModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

// ================= RECORD BORROW BOOK =================
export const recordBorrowBook = catchAsyncError(async (req, res, next) => {
    const { bookId } = req.body;
    const userId = req.user._id;

    if (!bookId) {
        return next(new ErrorHandler("Please provide a Book ID.", 400));
    }

    const book = await Book.findById(bookId);
    if (!book) {
        return next(new ErrorHandler("Book not found.", 404));
    }

    if (book.availableCopies <= 0) {
        return next(new ErrorHandler("This book is currently out of stock/unavailable.", 400));
    }

    // Check if user already borrowed this book and hasn't returned it
    const existingBorrow = await Borrow.findOne({
        userId,
        bookId,
        returned: false,
    });

    if (existingBorrow) {
        return next(new ErrorHandler("You have already borrowed this book and have not returned it yet.", 400));
    }

    // Define standard borrow period: 14 days
    const borrowDate = Date.now();
    const dueDate = new Date(borrowDate + 14 * 24 * 60 * 60 * 1000);

    const borrow = await Borrow.create({
        userId,
        bookId,
        borrowDate,
        dueDate,
    });

    // Update book copies
    book.availableCopies -= 1;
    await book.save();

    // Update user borrowed list
    const user = await User.findById(userId);
    user.borrowedBooks.push({
        bookId: borrow._id, // References the 'Borrow' record
        returned: false,
        bookTitle: book.title,
        borrowDate,
        dueDate,
    });
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
        success: true,
        message: "Book borrowed successfully.",
        borrow,
    });
});

// ================= RETURN BORROW BOOK =================
export const returnBorrowBook = catchAsyncError(async (req, res, next) => {
    const { id } = req.params; // Borrow record ID
    const userId = req.user._id;

    const borrow = await Borrow.findById(id);
    if (!borrow) {
        return next(new ErrorHandler("Borrow record not found.", 404));
    }

    // Ensure only the user who borrowed the book (or an Admin) can return it
    if (borrow.userId.toString() !== userId.toString() && req.user.role !== "Admin") {
        return next(new ErrorHandler("You are not authorized to return this book.", 403));
    }

    if (borrow.returned) {
        return next(new ErrorHandler("This book has already been returned.", 400));
    }

    const returnDate = new Date();
    const fine = calculateFine(borrow.dueDate, returnDate);

    // Update borrow entry
    borrow.returned = true;
    borrow.returnDate = returnDate;
    borrow.fine = fine;
    await borrow.save();

    // Increment book available copies
    const book = await Book.findById(borrow.bookId);
    if (book) {
        book.availableCopies += 1;
        await book.save();
    }

    // Update user's borrowedBooks list
    const user = await User.findById(borrow.userId);
    if (user) {
        const borrowedBookEntry = user.borrowedBooks.find(
            (entry) => entry.bookId.toString() === borrow._id.toString()
        );
        if (borrowedBookEntry) {
            borrowedBookEntry.returned = true;
        }
        await user.save({ validateBeforeSave: false });
    }

    res.status(200).json({
        success: true,
        message: "Book returned successfully.",
        borrowDate: borrow.borrowDate,
        dueDate: borrow.dueDate,
        returnDate,
        fine,
    });
});

// ================= GET USER BORROWED BOOKS =================
export const borrowedBooks = catchAsyncError(async (req, res, next) => {
    const userId = req.user._id;

    const borrows = await Borrow.find({ userId })
        .populate("bookId", "title author genre")
        .sort({ borrowDate: -1 });

    res.status(200).json({
        success: true,
        count: borrows.length,
        borrows,
    });
});

// ================= GET ALL BORROWED BOOKS (Admin Only) =================
export const getBorrowedByAdmin = catchAsyncError(async (req, res, next) => {
    const borrows = await Borrow.find({})
        .populate("userId", "name email")
        .populate("bookId", "title author")
        .sort({ borrowDate: -1 });

    res.status(200).json({
        success: true,
        count: borrows.length,
        borrows,
    });
});
