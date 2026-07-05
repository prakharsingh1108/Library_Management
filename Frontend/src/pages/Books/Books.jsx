import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiFilter, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import BookCard from '../../components/BookCard';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { BookCardSkeleton } from '../../components/Loader/Skeleton';
import { fetchBooks, removeBook, clearBookMessage } from '../../redux/bookSlice';
import { BOOKS_PER_PAGE, GENRES } from '../../utils/constants';
import { filterBooks, paginate } from '../../utils/helpers';

/**
 * Public catalog and admin book management (shared route component).
 */
const Books = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAdminView = location.pathname.startsWith('/admin');

  const { books, loading, message } = useSelector((state) => state.books);

  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearBookMessage());
    }
  }, [message, dispatch]);

  const filtered = useMemo(
    () => filterBooks(books, { search, genre }),
    [books, search, genre]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / BOOKS_PER_PAGE));
  const paginatedBooks = paginate(filtered, page, BOOKS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [search, genre]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await dispatch(removeBook(deleteId)).unwrap();
      toast.success('Book deleted successfully');
      setDeleteId(null);
    } catch (error) {
      toast.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={isAdminView ? '' : 'page-container py-10'}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {isAdminView ? 'Manage Books' : 'Browse Books'}
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {filtered.length} book{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {isAdminView && (
          <Link to="/admin/books/add" className="btn-primary">
            <FiPlus /> Add New Book
          </Link>
        )}
      </div>

      {/* Search & Filter */}
      <div className="glass-card mb-8 flex flex-col gap-4 p-4 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or genre..."
            className="input-field pl-10"
          />
        </div>
        <div className="relative sm:w-48">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="input-field appearance-none pl-10"
          >
            <option value="">All Genres</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: BOOKS_PER_PAGE }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))
          : paginatedBooks.length > 0
            ? paginatedBooks.map((book) => (
                <motion.div key={book._id} className="relative">
                  <BookCard book={book} />
                  {isAdminView && (
                    <button
                      type="button"
                      onClick={() => setDeleteId(book._id)}
                      className="absolute right-3 top-3 rounded-lg bg-rose-600 p-2 text-white shadow-lg transition hover:bg-rose-500"
                      aria-label="Delete book"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </motion.div>
              ))
            : (
              <p className="col-span-full py-12 text-center text-slate-500">
                No books match your search. Try different filters.
              </p>
            )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Book"
        size="sm"
      >
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          Are you sure you want to delete this book? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button type="button" onClick={() => setDeleteId(null)} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Books;
