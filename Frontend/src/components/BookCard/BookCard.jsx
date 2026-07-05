import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiUser } from 'react-icons/fi';

/**
 * Book card for catalog / featured sections.
 */
const BookCard = ({ book }) => {
  const available = book.availableCopies > 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card group flex h-full flex-col overflow-hidden"
    >
      <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-indigo-500/10 to-violet-500/10">
        <FiBook className="text-5xl text-indigo-400/60 transition group-hover:scale-110 group-hover:text-indigo-500" />
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            available
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
          }`}
        >
          {available ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-2 text-base font-semibold text-slate-800 dark:text-slate-100">
          {book.title}
        </h3>
        <p className="mb-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <FiUser size={14} />
          {book.author}
        </p>
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-indigo-500">
          {book.genre}
        </p>
        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
          {book.availableCopies} of {book.totalCopies} copies available
        </p>
        <Link to={`/books/${book._id}`} className="btn-primary mt-auto w-full text-center">
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default BookCard;
