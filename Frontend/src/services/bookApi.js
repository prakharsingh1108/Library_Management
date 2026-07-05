import api from './api';

// ─── Books API ────────────────────────────────────────────────────────────────

export const getAllBooks = () => api.get('/api/v1/books/all');

export const addBook = (data) => api.post('/api/v1/books/add', data);

export const deleteBook = (id) => api.delete(`/api/v1/books/delete/${id}`);
