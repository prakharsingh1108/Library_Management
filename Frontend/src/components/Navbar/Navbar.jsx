import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBookOpen,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiLayout,
} from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme.jsx';
import { APP_NAME } from '../../utils/constants';
import toast from 'react-hot-toast';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/books', label: 'Books' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Logout failed');
    }
  };

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    }`;

  return (
    <header className="glass-nav sticky top-0 z-40">
      <nav className="page-container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
          <FiBookOpen className="text-2xl text-indigo-600" />
          <span>{APP_NAME}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <>
              <NavLink to="/my-books" className={linkClass}>
                My Books
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                Profile
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin/dashboard" className={linkClass}>
                  Admin
                </NavLink>
              )}
            </>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-slate-600 dark:text-slate-400 lg:inline">
                Hi, {user?.name?.split(' ')[0]}
              </span>
              <button type="button" onClick={handleLogout} className="btn-secondary !py-2">
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary !py-2">
                Login
              </Link>
              <Link to="/register" className="btn-primary !py-2">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="rounded-lg p-2 text-slate-700 md:hidden dark:text-slate-200"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200/50 md:hidden dark:border-slate-800"
          >
            <div className="page-container flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={linkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              {isAuthenticated && (
                <>
                  <NavLink to="/my-books" className={linkClass} onClick={() => setMobileOpen(false)}>
                    My Books
                  </NavLink>
                  <NavLink to="/profile" className={linkClass} onClick={() => setMobileOpen(false)}>
                    <FiUser className="inline mr-1" /> Profile
                  </NavLink>
                  {isAdmin && (
                    <NavLink
                      to="/admin/dashboard"
                      className={linkClass}
                      onClick={() => setMobileOpen(false)}
                    >
                      <FiLayout className="inline mr-1" /> Admin
                    </NavLink>
                  )}
                  <button type="button" onClick={handleLogout} className="btn-secondary mt-2">
                    Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <div className="mt-2 flex flex-col gap-2">
                  <Link to="/login" className="btn-secondary" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary" onClick={() => setMobileOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
              <button type="button" onClick={toggleTheme} className="btn-secondary mt-2">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
