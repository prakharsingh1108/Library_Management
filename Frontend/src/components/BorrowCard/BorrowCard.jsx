import { FiCalendar, FiClock, FiDollarSign } from 'react-icons/fi';
import { formatDate, getDaysUntilDue } from '../../utils/helpers';

/**
 * Card displaying a borrowed book record with due date and fine info.
 */
const BorrowCard = ({ borrow, onReturn, returning = false }) => {
  const book = borrow.bookId;
  const daysLeft = getDaysUntilDue(borrow.dueDate);
  const isOverdue = !borrow.returned && daysLeft < 0;
  const isDueSoon = !borrow.returned && daysLeft >= 0 && daysLeft <= 3;

  return (
    <div className="glass-card p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {book?.title || borrow.bookTitle || 'Unknown Book'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {book?.author || '—'}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            borrow.returned
              ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              : isOverdue
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                : isDueSoon
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
          }`}
        >
          {borrow.returned ? 'Returned' : isOverdue ? 'Overdue' : 'Active'}
        </span>
      </div>

      <div className="mb-4 grid gap-2 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2">
        <p className="flex items-center gap-2">
          <FiCalendar />
          Borrowed: {formatDate(borrow.borrowDate)}
        </p>
        <p className="flex items-center gap-2">
          <FiClock />
          Due: {formatDate(borrow.dueDate)}
        </p>
        {borrow.returned && borrow.returnDate && (
          <p className="flex items-center gap-2">
            <FiCalendar />
            Returned: {formatDate(borrow.returnDate)}
          </p>
        )}
        {(borrow.returned || borrow.fine > 0) && (
          <p className="flex items-center gap-2">
            <FiDollarSign />
            Fine: ${borrow.fine || 0}
          </p>
        )}
      </div>

      {!borrow.returned && onReturn && (
        <button
          type="button"
          onClick={() => onReturn(borrow._id)}
          disabled={returning}
          className="btn-primary w-full sm:w-auto"
        >
          {returning ? 'Returning...' : 'Return Book'}
        </button>
      )}
    </div>
  );
};

export default BorrowCard;
