import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiMail } from 'react-icons/fi';
import { sendForgotPassword, clearAuthError } from '../../redux/authSlice';
import { emailRules } from '../../utils/validators';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '' } });

  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(sendForgotPassword(data)).unwrap();
      toast.success(result.message || 'Reset link sent to your email');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-800 dark:text-white">Forgot password</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Enter your email and we&apos;ll send you a reset link
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
          {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Remember your password?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
