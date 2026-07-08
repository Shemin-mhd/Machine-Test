import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import registerIllustration from '../../assets/images/register_illustration.png';
import { setupRecaptcha, sendOTP } from '../../firebase/auth';

const API_URL = import.meta.env.VITE_API_URL || "https://machine-test-sphx.onrender.com/api/auth";

interface RegisterResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    uid: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  message?: string;
}

const registerRequest = async (
  uid: string,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  email: string
): Promise<RegisterResponse> => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid, phoneNumber, firstName, lastName, email }),
  });
  return response.json();
};

interface RegisterFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  agreeToTerms: boolean;
}

import { useToast } from '../../components/Toast';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null);
  const { showToast } = useToast();

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn, navigate]);

  const prefilledPhone = location.state?.phoneNumber || '';

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
    defaultValues: {
      phoneNumber: prefilledPhone,
    }
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsLoading(true);
    setErrorMsg('');

    const verifiedUid = location.state?.uid;

    if (verifiedUid) {
      // Direct registration call to backend since OTP is already verified!
      try {
        const response = await registerRequest(
          verifiedUid,
          data.phoneNumber,
          data.firstName,
          data.lastName,
          data.email
        );

        if (response.success && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('phoneNumber', data.phoneNumber);
          showToast('Registration successful! Welcome!', 'success');
          navigate('/home');
        } else {
          setErrorMsg(response.message || 'Registration failed on backend.');
          showToast(response.message || 'Registration failed on backend.', 'error');
        }
      } catch (err: any) {
        console.error("Backend register error:", err);
        setErrorMsg(err.message || 'Server connection error.');
        showToast(err.message || 'Server connection error.', 'error');
      } finally {
        setIsLoading(false);
      }
      return;
    }

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
      // Pass registration data to OTP page so we can register the user after verification
      navigate('/otp', {
        state: {
          phoneNumber: data.phoneNumber,
          flow: 'register',
          registrationData: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          }
        }
      });
    } catch (err: any) {
      setIsLoading(false);
      console.error("Firebase sendOTP error during sign up:", err);
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
    <AuthLayout illustration={registerIllustration} reverse={true} maxWidth="max-w-[440px]" hideLogo={true}>
      <div className="w-full animate-fadeIn">

        <h1 className="text-[32px] font-bold text-gray-900 tracking-tight leading-none mb-2 font-sans">
          Sign up
        </h1>
        <p className="text-[14px] text-gray-400 mb-8 font-normal font-sans leading-relaxed">
          Let's get you all set up so you can access your personal account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              error={errors.firstName?.message}
              {...register('firstName', { required: 'First name is required' })}
            />
            <Input
              label="Last Name"
              type="text"
              error={errors.lastName?.message}
              {...register('lastName', { required: 'Last name is required' })}
            />
          </div>

          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Please enter a valid email address'
              }
            })}
          />

          <Input
            label="Phone Number"
            type="tel"
            disabled={!!location.state?.uid}
            maxLength={10}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            error={errors.phoneNumber?.message}
            {...register('phoneNumber', {
              required: 'Phone number is required',
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: 'Please enter a valid 10-digit mobile number'
              }
            })}
          />


          <div>
            <div className="flex items-center gap-2 select-none py-1">
              <input
                id="agreeToTerms"
                type="checkbox"
                className="h-4.5 w-4.5 rounded border-gray-300 text-[#4e5bf2] focus:ring-[#4e5bf2] accent-[#4e5bf2] cursor-pointer"
                {...register('agreeToTerms', { required: 'You must agree to the terms and privacy policy' })}
              />
              <label htmlFor="agreeToTerms" className="text-xs text-gray-500 font-sans cursor-pointer leading-none">
                I agree to all the <span className="text-[#ff5a5f] hover:underline font-semibold cursor-pointer">Terms</span> and <span className="text-[#ff5a5f] hover:underline font-semibold cursor-pointer">Privacy Policies</span>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-xs text-red-500 font-medium pl-1 mt-1">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 font-medium pl-1">
              {errorMsg}
            </p>
          )}

          <Button type="submit" isLoading={isLoading} className="mt-2">
            Create account
          </Button>

          <div id="recaptcha-container" className="flex justify-center mt-4"></div>
        </form>

        <p className="mt-6 text-center text-[14px] text-gray-500 font-sans">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#ff5a5f] hover:text-[#e04f53] hover:underline font-semibold transition-colors duration-200"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
