import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as authApi from '../services/authApi';
import { getPersistedUser, persistUser } from '../utils/helpers';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const register = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.registerUser(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.verifyOTP(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.loginUser(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authApi.logoutUser();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authApi.getMe();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Session expired');
    }
  }
);

export const sendForgotPassword = createAsyncThunk(
  'auth/sendForgotPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.forgotPassword(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  'auth/resetUserPassword',
  async ({ token, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await authApi.resetPassword(token, payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.updatePassword(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password update failed');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const persistedUser = getPersistedUser();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: persistedUser,
    isAuthenticated: !!persistedUser,
    loading: false,
    initializing: true,
    error: null,
    message: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthMessage: (state) => {
      state.message = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.message = null;
      persistUser(null);
    },
  },
  extraReducers: (builder) => {
    const setPending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const setRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    // Register
    builder
      .addCase(register.pending, setPending)
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(register.rejected, setRejected);

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, setPending)
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.message = action.payload.message;
        persistUser(action.payload.user);
      })
      .addCase(verifyOtp.rejected, setRejected);

    // Login
    builder
      .addCase(login.pending, setPending)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.message = action.payload.message;
        persistUser(action.payload.user);
      })
      .addCase(login.rejected, setRejected);

    // Logout
    builder
      .addCase(logout.pending, setPending)
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        persistUser(null);
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        persistUser(null);
      });

    // Fetch current user (session restore)
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.initializing = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.initializing = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        persistUser(action.payload.user);
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.initializing = false;
        state.user = null;
        state.isAuthenticated = false;
        persistUser(null);
      });

    // Forgot password
    builder
      .addCase(sendForgotPassword.pending, setPending)
      .addCase(sendForgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(sendForgotPassword.rejected, setRejected);

    // Reset password
    builder
      .addCase(resetUserPassword.pending, setPending)
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.message = action.payload.message;
        persistUser(action.payload.user);
      })
      .addCase(resetUserPassword.rejected, setRejected);

    // Update password
    builder
      .addCase(changePassword.pending, setPending)
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
        persistUser(action.payload.user);
      })
      .addCase(changePassword.rejected, setRejected);
  },
});

export const { clearAuthError, clearAuthMessage, clearAuth } = authSlice.actions;
export default authSlice.reducer;
