import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loader from '../Loader';

/**
 * Redirects authenticated users away from guest-only pages (login, register, etc.).
 */
const GuestRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, initializing } = useAuth();

  if (initializing) {
    return <Loader message="Checking session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/'} replace />;
  }

  return children;
};

export default GuestRoute;
