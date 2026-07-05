import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Book } from "../models/bookModel.js";

// ================= ADD BOOK (Admin Only) =================
export const addBook = catchAsyncError(async (req, res, next) => {
    const { title, author, genre, totalCopies } = req.body;

    if (!title || !author || !genre || !totalCopies) {
        return next(new ErrorHandler("Please fill all the book details.", 400));
    }

    const copiesCount = Number(totalCopies);
    if (isNaN(copiesCount) || copiesCount < 1) {
        return next(new ErrorHandler("Total copies must be a number greater than 0.", 400));
    }

    const book = await Book.create({
        title,
        author,
        genre,
        totalCopies: copiesCount,
        availableCopies: copiesCount,
    });

    res.status(201).json({
        success: true,
        message: "Book added successfully.",
        book,
    });
});

// ================= GET ALL BOOKS =================
export const getAllBooks = catchAsyncError(async (req, res, next) => {
    const books = await Book.find({}).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: books.length,
        books,
    });
});

// ================= DELETE BOOK (Admin Only) =================
export const deleteBook = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
        return next(new ErrorHandler("Book not found.", 404));
    }

    await book.deleteOne();

    res.status(200).json({
        success: true,
        message: "Book deleted successfully.",
    });
});
