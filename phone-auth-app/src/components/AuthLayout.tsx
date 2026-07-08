import React from 'react';
import Logo from './Logo';
import defaultIllustration from '../assets/images/illustration.png';

interface AuthLayoutProps {
  children: React.ReactNode;
  illustration?: string;
  reverse?: boolean;
  maxWidth?: string;
  hideLogo?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  illustration, 
  reverse = false, 
  maxWidth = 'max-w-[360px]',
  hideLogo = false
}) => {
  const activeIllustration = illustration || defaultIllustration;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-white font-sans">
      {/* Form Column */}
      <div className={`flex flex-col justify-between py-12 px-6 lg:px-16 xl:px-24 min-h-screen w-full ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className={`w-full ${maxWidth} mx-auto lg:mx-0 flex-grow flex flex-col justify-between`}>
          {/* Logo at the Top (shown only if not hidden) */}
          <div className="flex justify-start items-center min-h-[60px]">
            {!hideLogo && <Logo size={60} />}
          </div>

          {/* Center Form Content */}
          <div className="flex-grow flex flex-col justify-center py-12 w-full">
            {children}
          </div>

          {/* Footer info */}
          <div className="text-xs text-gray-400 select-none">
            © {new Date().getFullYear()} Travelwise. All rights reserved.
          </div>
        </div>
      </div>

      {/* 3D Illustration Column */}
      <div className={`hidden lg:flex items-center justify-center p-8 h-screen sticky top-0 bg-white ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="relative w-full h-full max-w-[500px] max-h-[620px] bg-[#f4f5f8] rounded-[32px] flex flex-col items-center justify-center p-12 overflow-hidden">
          <img
            src={activeIllustration}
            alt="Travelwise Security Illustration"
            className="max-w-[85%] max-h-[85%] object-contain select-none pointer-events-none transform hover:scale-[1.02] transition-transform duration-500 ease-out"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
