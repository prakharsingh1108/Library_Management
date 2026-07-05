import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiLock } from 'react-icons/fi';
import { resetUserPassword, clearAuthError } from '../../redux/authSlice';
import { passwordRules, confirmPasswordRules } from '../../utils/validators';

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link');
      navigate('/forgot-password');
    }
    return () => dispatch(clearAuthError());
  }, [dispatch, token, navigate]);

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(
        resetUserPassword({ token, password: data.password, confirmPassword: data.confirmPassword })
      ).unwrap();
      toast.success(result.message || 'Password reset successfully');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-800 dark:text-white">Reset password</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Choose a new password for your account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="password" className="label-text">New Password</label>
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
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Back to login
        </Link>
      </p>
    </div>
  );
};

export default ResetPassword;
