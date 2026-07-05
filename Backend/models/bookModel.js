import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Book title is required."],
        trim: true,
    },
    author: {
        type: String,
        required: [true, "Book author is required."],
        trim: true,
    },
    genre: {
        type: String,
        required: [true, "Book genre is required."],
        trim: true,
    },
    totalCopies: {
        type: Number,
        required: [true, "Total copies is required."],
        default: 1,
    },
    availableCopies: {
        type: Number,
        required: [true, "Available copies is required."],
        default: 1,
    },
}, {
    timestamps: true,
});

export const Book = mongoose.model('Book', bookSchema);
