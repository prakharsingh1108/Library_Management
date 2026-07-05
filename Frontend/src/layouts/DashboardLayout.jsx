import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

/**
 * User dashboard layout for profile and borrowed books.
 */
const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-container flex-1 py-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
