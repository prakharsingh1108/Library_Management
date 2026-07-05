import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as bookApi from '../services/bookApi';

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await bookApi.getAllBooks();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch books');
    }
  }
);

export const createBook = createAsyncThunk(
  'books/createBook',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await bookApi.addBook(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add book');
    }
  }
);

export const removeBook = createAsyncThunk(
  'books/removeBook',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await bookApi.deleteBook(id);
      return { id, message: data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete book');
    }
  }
);

const bookSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    book: null,
    count: 0,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearBookError: (state) => {
      state.error = null;
    },
    clearBookMessage: (state) => {
      state.message = null;
    },
    setSelectedBook: (state, action) => {
      state.book = action.payload;
    },
    clearSelectedBook: (state) => {
      state.book = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.books;
        state.count = action.payload.count;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.unshift(action.payload.book);
        state.count += 1;
        state.message = action.payload.message;
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter((b) => b._id !== action.payload.id);
        state.count -= 1;
        state.message = action.payload.message;
      })
      .addCase(removeBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookError, clearBookMessage, setSelectedBook, clearSelectedBook } =
  bookSlice.actions;
export default bookSlice.reducer;
