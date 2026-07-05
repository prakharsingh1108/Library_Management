import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-md p-8 text-center"
      >
        <p className="text-7xl font-extrabold text-indigo-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">Page not found</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          <FiHome /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
