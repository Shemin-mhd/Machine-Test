import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { setupRecaptcha, sendOTP } from '../../firebase/auth';

interface LoginFormInputs {
  phoneNumber: string;
}

import { useToast } from '../../components/Toast';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null);
  const { showToast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      let verifier = recaptchaVerifier;
      if (!verifier) {
        verifier = setupRecaptcha('recaptcha-container');
        setRecaptchaVerifier(verifier);
      }

      const formattedPhone = `+91${data.phoneNumber}`;
      await sendOTP(formattedPhone, verifier);

      setIsLoading(false);
      showToast('Verification code sent successfully!', 'success');
      navigate('/otp', { state: { phoneNumber: data.phoneNumber, flow: 'login' } });
    } catch (err: any) {
      setIsLoading(false);
      console.error("Firebase sendOTP error:", err);
      setErrorMsg(err.message || 'Failed to send OTP. Please try again.');
      showToast(err.message || 'Failed to send OTP. Please try again.', 'error');

      // Reset recaptcha container so we can try again
      const container = document.getElementById('recaptcha-container');
      if (container) {
        container.innerHTML = '';
      }
      setRecaptchaVerifier(null);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full animate-fadeIn">
        {/* Header */}
        <h1 className="text-[32px] font-bold text-gray-900 tracking-tight leading-none mb-2 font-sans">
          Login
        </h1>
        <p className="text-[15px] text-gray-400 mb-8 font-normal font-sans">
          Login to access your travelwise account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Enter mobile number"
            type="tel"
            error={errors.phoneNumber?.message}
            {...register('phoneNumber', {
              required: 'Mobile number is required',
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: 'Please enter a valid 10-digit mobile number'
              }
            })}
          />

          {errorMsg && (
            <p className="text-xs text-red-500 font-medium pl-1">
              {errorMsg}
            </p>
          )}

          <Button type="submit" isLoading={isLoading}>
            Get OTP
          </Button>

          <div id="recaptcha-container" className="flex justify-center mt-4"></div>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-center text-[14px] text-gray-500 font-sans">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-[#ff5a5f] hover:text-[#e04f53] hover:underline font-semibold transition-colors duration-200"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
