import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiLock, FiMail } from 'react-icons/fi';
import { login, clearAuthError } from '../../redux/authSlice';
import { emailRules, passwordRules } from '../../utils/validators';
import Loader from '../../components/Loader';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, isAuthenticated, user } = useSelector((state) => state.auth);
  const from =
    location.state?.from?.pathname ||
    (user?.role === 'Admin' ? '/admin/dashboard' : '/');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(login(data)).unwrap();
      toast.success(result.message || 'Login successful');
      const redirectTo =
        result.user?.role === 'Admin' ? '/admin/dashboard' : from;
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error);
    }
  };

  if (loading && isAuthenticated) return <Loader message="Redirecting..." />;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-800 dark:text-white">Welcome back</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Sign in to access your library account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="label-text">Email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="input-field pl-10"
              placeholder="you@example.com"
              {...register('email', emailRules)}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="label-text">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="input-field pl-10"
              placeholder="••••••••"
              {...register('password', passwordRules)}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
