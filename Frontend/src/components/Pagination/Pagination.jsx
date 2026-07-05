import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Pagination controls for list pages.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-secondary !px-3 !py-2 disabled:opacity-40"
        aria-label="Previous page"
      >
        <FiChevronLeft />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`min-w-[2.5rem] rounded-xl px-3 py-2 text-sm font-medium transition ${
            page === currentPage
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'bg-white/80 text-slate-700 hover:bg-white dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-secondary !px-3 !py-2 disabled:opacity-40"
        aria-label="Next page"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
