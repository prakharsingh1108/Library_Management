/**
 * Extract a readable error message from API / unknown errors.
 */
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (typeof error === 'string') return error;
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

/**
 * Persist authenticated user in localStorage for Redux hydration.
 */
export const persistUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

/**
 * Read persisted user from localStorage.
 */
export const getPersistedUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

/**
 * Format a date string or timestamp for display.
 */
export const formatDate = (value, options = {}) => {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
};

/**
 * Calculate days remaining until due date (negative = overdue).
 */
export const getDaysUntilDue = (dueDate) => {
  const due = new Date(dueDate);
  const now = new Date();
  const diffMs = due.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Slice an array for client-side pagination.
 */
export const paginate = (items, page, perPage) => {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
};

/**
 * Filter books by search query and genre.
 */
export const filterBooks = (books, { search = '', genre = '' }) => {
  const query = search.trim().toLowerCase();
  return books.filter((book) => {
    const matchesSearch =
      !query ||
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.genre?.toLowerCase().includes(query);
    const matchesGenre = !genre || book.genre === genre;
    return matchesSearch && matchesGenre;
  });
};
