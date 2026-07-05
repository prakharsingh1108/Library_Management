import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

/**
 * Reusable modal dialog with glassmorphism styling.
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`glass-card relative z-10 w-full ${sizeClasses[size]} p-6`}
          >
            <div className="mb-4 flex items-center justify-between">
              {title && (
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {title}
                </h3>
              )}
              <button
                type="button"
                onClick={onClose}
                className="ml-auto rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                aria-label="Close modal"
              >
                <FiX size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
