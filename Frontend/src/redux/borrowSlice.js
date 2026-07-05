import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as borrowApi from '../services/borrowApi';

export const borrowBook = createAsyncThunk(
  'borrow/borrowBook',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await borrowApi.borrowBook(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to borrow book');
    }
  }
);

export const returnBorrowedBook = createAsyncThunk(
  'borrow/returnBorrowedBook',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await borrowApi.returnBook(id);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to return book');
    }
  }
);

export const fetchMyBorrows = createAsyncThunk(
  'borrow/fetchMyBorrows',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await borrowApi.getMyBorrowedBooks();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch borrowed books');
    }
  }
);

export const fetchAllBorrowsAdmin = createAsyncThunk(
  'borrow/fetchAllBorrowsAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await borrowApi.getAllBorrowsAdmin();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch borrow records');
    }
  }
);

const borrowSlice = createSlice({
  name: 'borrow',
  initialState: {
    borrows: [],
    count: 0,
    loading: false,
    error: null,
    message: null,
    lastReturn: null,
  },
  reducers: {
    clearBorrowError: (state) => {
      state.error = null;
    },
    clearBorrowMessage: (state) => {
      state.message = null;
    },
    clearLastReturn: (state) => {
      state.lastReturn = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(borrowBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(borrowBook.fulfilled, (state, action) => {
        state.loading = false;
        state.borrows.unshift(action.payload.borrow);
        state.count += 1;
        state.message = action.payload.message;
      })
      .addCase(borrowBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(returnBorrowedBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(returnBorrowedBook.fulfilled, (state, action) => {
        state.loading = false;
        state.borrows = state.borrows.map((b) =>
          b._id === action.payload.id ? { ...b, returned: true, fine: action.payload.fine } : b
        );
        state.lastReturn = action.payload;
        state.message = action.payload.message;
      })
      .addCase(returnBorrowedBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyBorrows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBorrows.fulfilled, (state, action) => {
        state.loading = false;
        state.borrows = action.payload.borrows;
        state.count = action.payload.count;
      })
      .addCase(fetchMyBorrows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllBorrowsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBorrowsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.borrows = action.payload.borrows;
        state.count = action.payload.count;
      })
      .addCase(fetchAllBorrowsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBorrowError, clearBorrowMessage, clearLastReturn } = borrowSlice.actions;
export default borrowSlice.reducer;
