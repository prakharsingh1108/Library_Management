import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiBook, FiClock, FiUser } from 'react-icons/fi';
import Loader from '../../components/Loader';
import { fetchBooks } from '../../redux/bookSlice';
import { borrowBook } from '../../redux/borrowSlice';
import useAuth from '../../hooks/useAuth';

/**
 * Single book detail page with borrow action.
 */
const BookDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { books, loading: booksLoading } = useSelector((state) => state.books);
  const { loading: borrowLoading } = useSelector((state) => state.borrow);

  useEffect(() => {
    if (books.length === 0) {
      dispatch(fetchBooks());
    }
  }, [dispatch, books.length]);

  const book = useMemo(() => books.find((b) => b._id === id), [books, id]);

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to borrow books');
      navigate('/login', { state: { from: { pathname: `/books/${id}` } } });
      return;
    }

    try {
      const result = await dispatch(borrowBook({ bookId: id })).unwrap();
      toast.success(result.message || 'Book borrowed successfully');
      navigate('/my-books');
    } catch (error) {
      toast.error(error);
    }
  };

  if (booksLoading && !book) {
    return <Loader message="Loading book details..." />;
  }

  if (!book) {
    return (
      <div className="page-container py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Book not found</h1>
        <Link to="/books" className="btn-primary mt-6 inline-flex">
          <FiArrowLeft /> Back to Books
        </Link>
      </div>
    );
  }

  const available = book.availableCopies > 0;

  return (
    <div className="page-container py-10">
      <Link
        to="/books"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        <FiArrowLeft /> Back to catalog
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card grid gap-8 p-6 lg:grid-cols-2 lg:p-10"
      >
        <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-12">
          <FiBook className="text-[10rem] text-indigo-400/50" />
        </div>

        <div className="flex flex-col">
          <span className="mb-2 inline-block w-fit rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {book.genre}
          </span>

          <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
            {book.title}
          </h1>

          <p className="mb-6 flex items-center gap-2 text-lg text-slate-600 dark:text-slate-400">
            <FiUser />
            {book.author}
          </p>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200/50 bg-white/50 p-4 dark:border-slate-700/50 dark:bg-slate-800/50">
              <p className="text-xs font-medium uppercase text-slate-500">Available Copies</p>
              <p className="text-2xl font-bold text-indigo-600">
                {book.availableCopies} / {book.totalCopies}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/50 bg-white/50 p-4 dark:border-slate-700/50 dark:bg-slate-800/50">
              <p className="text-xs font-medium uppercase text-slate-500">Borrow Period</p>
              <p className="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-slate-200">
                <FiClock className="text-indigo-500" />
                14 days
              </p>
            </div>
          </div>

          <p className="mb-8 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Borrow this title from our collection. Books must be returned within 14 days.
            Late returns incur a fine of $10 per day.
          </p>

          <div className="mt-auto flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleBorrow}
              disabled={!available || borrowLoading}
              className="btn-primary"
            >
              {borrowLoading
                ? 'Processing...'
                : available
                  ? 'Borrow This Book'
                  : 'Currently Unavailable'}
            </button>
            {!isAuthenticated && (
              <Link to="/login" className="btn-secondary">
                Login to Borrow
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookDetails;
