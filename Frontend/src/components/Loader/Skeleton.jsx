import { motion } from 'framer-motion';

/**
 * Skeleton placeholder for loading cards/lists.
 */
const Skeleton = ({ className = '' }) => (
  <div
    className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80 ${className}`}
  />
);

export const BookCardSkeleton = () => (
  <div className="glass-card p-4">
    <Skeleton className="mb-4 h-40 w-full" />
    <Skeleton className="mb-2 h-5 w-3/4" />
    <Skeleton className="mb-2 h-4 w-1/2" />
    <Skeleton className="h-9 w-full" />
  </div>
);

export const TableRowSkeleton = ({ cols = 4 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export default Skeleton;
