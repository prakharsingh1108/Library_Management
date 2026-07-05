import api from './api';

// ─── Authentication API ───────────────────────────────────────────────────────

export const registerUser = (data) => api.post('/api/v1/auth/register', data);

export const verifyOTP = (data) => api.post('/api/v1/auth/verify-otp', data);

export const loginUser = (data) => api.post('/api/v1/auth/login', data);

export const logoutUser = () => api.get('/api/v1/auth/logout');

export const getMe = () => api.get('/api/v1/auth/me');

export const forgotPassword = (data) => api.post('/api/v1/auth/password/forgot', data);

export const resetPassword = (token, data) =>
  api.put(`/api/v1/auth/password/reset/${token}`, data);

export const updatePassword = (data) => api.put('/api/v1/auth/password/update', data);
