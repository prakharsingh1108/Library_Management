import api from '../services/api';
import { store } from '../redux/store';
import { clearAuth } from '../redux/authSlice';
import toast from 'react-hot-toast';

/**
 * Attach global Axios interceptors for auth error handling.
 * Called once at app startup.
 */
export const setupInterceptors = () => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.message || '';

      // Auto logout on expired / invalid session
      if (
        status === 401 &&
        (message.toLowerCase().includes('authenticated') ||
          message.toLowerCase().includes('token'))
      ) {
        const { auth } = store.getState();
        if (auth.isAuthenticated) {
          store.dispatch(clearAuth());
          toast.error('Session expired. Please login again.');
        }
      }

      return Promise.reject(error);
    }
  );
};
