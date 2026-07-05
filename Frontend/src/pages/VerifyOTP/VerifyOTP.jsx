import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiKey, FiMail } from 'react-icons/fi';
import { verifyOtp, clearAuthError } from '../../redux/authSlice';
import { emailRules, otpRules } from '../../utils/validators';

const VerifyOTP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const emailFromState = location.state?.email || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { email: emailFromState, otp: '' },
  });

  useEffect(() => {
    if (emailFromState) setValue('email', emailFromState);
  }, [emailFromState, setValue]);

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!emailFromState) {
      toast.error('Please register first to receive an OTP');
    }
    return () => dispatch(clearAuthError());
  }, [dispatch, emailFromState]);

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(
        verifyOtp({ email: data.email, otp: Number(data.otp) })
      ).unwrap();
      toast.success(result.message || 'Account verified successfully');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-800 dark:text-white">Verify your email</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Enter the 5-digit code sent to your email address
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="label-text">Email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              readOnly={!!emailFromState}
              className="input-field pl-10"
              {...register('email', emailRules)}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="otp" className="label-text">Verification Code</label>
          <div className="relative">
            <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={5}
              className="input-field pl-10 tracking-widest"
              placeholder="12345"
              {...register('otp', otpRules)}
            />
          </div>
          {errors.otp && <p className="mt-1 text-xs text-rose-500">{errors.otp.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Verifying...' : 'Verify Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Wrong email?{' '}
        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Register again
        </Link>
      </p>
    </div>
  );
};

export default VerifyOTP;
