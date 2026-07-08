import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { setupRecaptcha, sendOTP, verifyOTP } from '../../firebase/auth';
import { useToast } from '../../components/Toast';
import type { RecaptchaVerifier } from 'firebase/auth';

const API_URL = import.meta.env.VITE_API_URL || "https://machine-test-sphx.onrender.com";

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

export const OTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || 'XXXXXX';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const { showToast } = useToast();

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Countdown timer for Resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Focus the first input on load
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // take the last char
    setOtp(newOtp);
    setError('');

    // Move focus forward if not empty
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move focus backward
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs[index - 1].current?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
      setError('');
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp(newOtp);
    setError('');
    inputRefs[5].current?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. Verify code with Firebase
      const credential = await verifyOTP(otpString);
      const firebaseUser = credential.user;

      const uid = firebaseUser.uid;
      const verifiedPhone = firebaseUser.phoneNumber || `+91${phoneNumber}`;
      const cleanedPhone = verifiedPhone.replace('+91', '');

      const flow = location.state?.flow || 'login';
      const registrationData = location.state?.registrationData;

      if (flow === 'register' && registrationData) {
        // Sign-up flow: Register in backend
        const response = await registerRequest(
          uid,
          cleanedPhone,
          registrationData.firstName,
          registrationData.lastName,
          registrationData.email
        );

        if (response.success && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('phoneNumber', cleanedPhone);
          showToast('Registration successful! Welcome!', 'success');
          navigate('/home');
        } else {
          setError(response.message || 'Registration failed on backend.');
          showToast(response.message || 'Registration failed on backend.', 'error');
        }
      } else {
        // Login flow: Always redirect to Register page after verification
        setIsLoading(false);
        showToast('Phone number verified successfully! Please complete registration.', 'success');
        navigate('/register', { state: { phoneNumber: cleanedPhone, uid: uid } });
      }
    } catch (err: any) {
      console.error("OTP Verification error:", err);
      setError(err.message || 'Invalid verification code. Please try again.');
      showToast(err.message || 'Invalid verification code. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      setIsLoading(true);
      setError('');
      try {
        let verifier = recaptchaVerifier;
        if (!verifier) {
          verifier = setupRecaptcha('recaptcha-container');
          setRecaptchaVerifier(verifier);
        }
        const formattedPhone = `+91${phoneNumber}`;
        await sendOTP(formattedPhone, verifier);

        showToast('Verification code resent successfully!', 'success');
        setTimer(30);
        setOtp(['', '', '', '', '', '']);
        inputRefs[0].current?.focus();
      } catch (err: any) {
        console.error("Resend OTP error:", err);
        setError(err.message || 'Failed to resend OTP. Please try again.');
        showToast(err.message || 'Failed to resend OTP. Please try again.', 'error');

        const container = document.getElementById('recaptcha-container');
        if (container) {
          container.innerHTML = '';
        }
        setRecaptchaVerifier(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthLayout>
      <div className="w-full animate-fadeIn">
        {isLoading && <Loader message="Verifying security code..." />}

        {/* Header */}
        <h1 className="text-[32px] font-bold text-gray-900 tracking-tight leading-none mb-2 font-sans">
          OTP Verification
        </h1>
        <p className="text-[15px] text-gray-400 mb-8 font-normal font-sans">
          Enter the 6-digit code sent to{' '}
          <span className="font-semibold text-gray-700">+91 {phoneNumber}</span>{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-[#4e5bf2] hover:underline font-semibold ml-1 text-xs"
          >
            Edit
          </button>
        </p>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-4 py-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-14 h-14 text-center text-2xl font-bold text-gray-900 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-[#4e5bf2] focus:border-[#4e5bf2] transition-all duration-200 select-all
                  ${error ? 'border-red-500 ring-red-100 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#4e5bf2]'}
                `}
              />
            ))}
          </div>

          {error && (
            <p className="text-xs text-red-500 font-medium pl-1">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-sans">
              Didn't receive code?
            </span>
            {timer > 0 ? (
              <span className="text-gray-500 font-medium font-sans">
                Resend in <span className="text-[#4e5bf2] font-semibold">{timer}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-[#4e5bf2] hover:text-[#3d4ae0] hover:underline font-semibold transition-colors duration-200 font-sans"
              >
                Resend OTP
              </button>
            )}
          </div>

          <Button type="submit">
            Verify OTP
          </Button>

          <div id="recaptcha-container" className="flex justify-center mt-4"></div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default OTP;
