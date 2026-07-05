import api from './api';

// ─── Borrow API ───────────────────────────────────────────────────────────────

export const borrowBook = (data) => api.post('/api/v1/borrow/borrow', data);

export const returnBook = (id) => api.put(`/api/v1/borrow/return/${id}`);

export const getMyBorrowedBooks = () => api.get('/api/v1/borrow/my');

export const getAllBorrowsAdmin = () => api.get('/api/v1/borrow/all');
