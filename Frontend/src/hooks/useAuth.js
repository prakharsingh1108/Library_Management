import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { logout as logoutAction } from '../redux/authSlice';
import { USER_ROLES } from '../utils/constants';

/**
 * Convenience hook for auth state and actions.
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, initializing, error } = useSelector(
    (state) => state.auth
  );

  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const logout = useCallback(() => {
    return dispatch(logoutAction());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    initializing,
    error,
    logout,
  };
};

export default useAuth;
