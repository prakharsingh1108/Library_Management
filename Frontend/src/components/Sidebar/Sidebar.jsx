import { NavLink } from 'react-router-dom';
import {
  FiBook,
  FiBookOpen,
  FiGrid,
  FiPlusCircle,
  FiUsers,
  FiUserPlus,
  FiX,
} from 'react-icons/fi';
import { APP_NAME } from '../../utils/constants';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/admin/books/add', label: 'Add Book', icon: FiPlusCircle },
  { to: '/admin/books', label: 'Manage Books', icon: FiBook },
  { to: '/admin/borrows', label: 'Borrow Records', icon: FiBookOpen },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/register-admin', label: 'Register Admin', icon: FiUserPlus },
];

/**
 * Admin sidebar navigation for dashboard layout.
 */
const Sidebar = ({ isOpen, onClose }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
    }`;

  const content = (
    <>
      <div className="mb-8 flex items-center justify-between px-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Admin Panel</p>
          <p className="font-bold text-slate-800 dark:text-white">{APP_NAME}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-500 lg:hidden dark:text-slate-400"
          aria-label="Close sidebar"
        >
          <FiX size={20} />
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        {adminLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`glass-card fixed inset-y-0 left-0 z-50 w-72 transform p-5 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>
    </>
  );
};

export default Sidebar;
