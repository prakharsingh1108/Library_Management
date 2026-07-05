import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

/**
 * Admin dashboard layout with collapsible sidebar.
 */
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col lg:ml-0">
          <div className="border-b border-slate-200/50 px-4 py-3 lg:hidden dark:border-slate-800">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="btn-secondary !py-2"
            >
              <FiMenu size={18} />
              Admin Menu
            </button>
          </div>
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 p-4 sm:p-6 lg:p-8"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
