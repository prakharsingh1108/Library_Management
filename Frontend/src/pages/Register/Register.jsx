import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import { register as registerUser, clearAuthError } from '../../redux/authSlice';
import { emailRules, passwordRules, nameRules, confirmPasswordRules } from '../../utils/validators';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const { confirmPassword, ...payload } = data;
    void confirmPassword;
    try {
      const result = await dispatch(registerUser(payload)).unwrap();
      toast.success(result.message || 'Verification code sent to your email');
      navigate('/verify-otp', { state: { email: data.email } });
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-800 dark:text-white">Create account</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Join {import.meta.env.VITE_APP_NAME || 'Bookworm Library'} and start borrowing
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="label-text">Full Name</label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="name"
              type="text"
              autoComplete="name"
              className="input-field pl-10"
              placeholder="John Doe"
              {...register('name', nameRules)}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
        </div>

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
          {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="label-text">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className="input-field pl-10"
              placeholder="8–16 characters"
              {...register('password', passwordRules)}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label-text">Confirm Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="input-field pl-10"
              placeholder="Repeat password"
              {...register('confirmPassword', confirmPasswordRules(getValues))}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
