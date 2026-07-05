import { Link } from 'react-router-dom';
import { FiBookOpen, FiGithub, FiMail, FiTwitter } from 'react-icons/fi';
import { APP_NAME } from '../../utils/constants';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/20 bg-white/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/50">
      <div className="page-container grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="mb-3 flex items-center gap-2 font-bold text-slate-800 dark:text-white">
            <FiBookOpen className="text-2xl text-indigo-600" />
            {APP_NAME}
          </Link>
          <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            A modern library management platform to discover, borrow, and manage books seamlessly.
            Built for readers and librarians alike.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><Link to="/" className="hover:text-indigo-600">Home</Link></li>
            <li><Link to="/books" className="hover:text-indigo-600">Browse Books</Link></li>
            <li><Link to="/login" className="hover:text-indigo-600">Login</Link></li>
            <li><Link to="/register" className="hover:text-indigo-600">Register</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Connect
          </h4>
          <div className="flex gap-3 text-slate-600 dark:text-slate-400">
            <a href="#" className="rounded-lg p-2 transition hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/30">
              <FiTwitter size={18} />
            </a>
            <a href="#" className="rounded-lg p-2 transition hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/30">
              <FiGithub size={18} />
            </a>
            <a href="#" className="rounded-lg p-2 transition hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/30">
              <FiMail size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200/50 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
        © {year} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
