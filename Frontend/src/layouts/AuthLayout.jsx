import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';

/**
 * Centered layout for authentication pages.
 */
const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-bold text-slate-800 dark:text-white">
          <FiBookOpen className="text-3xl text-indigo-600" />
          <span className="text-xl">{APP_NAME}</span>
        </Link>
        <div className="glass-card p-6 sm:p-8">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
