import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required."],
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, "Book ID is required."],
    },
    borrowDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required: [true, "Due date is required."],
    },
    returnDate: {
        type: Date,
    },
    returned: {
        type: Boolean,
        default: false,
    },
    fine: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

export const Borrow = mongoose.model('Borrow', borrowSchema);
