import api from './api';

// ─── Users API ────────────────────────────────────────────────────────────────

export const getAllUsers = () => api.get('/api/v1/users/all');

export const registerAdmin = (data) => api.post('/api/v1/users/register-admin', data);
