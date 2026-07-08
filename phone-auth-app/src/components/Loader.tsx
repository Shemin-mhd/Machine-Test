import React from 'react';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'Verifying...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md transition-all duration-300 animate-fadeIn">
      <div className="relative flex items-center justify-center">
      
        <div className="absolute w-16 h-16 rounded-full border-4 border-[#4e5bf2]/20"></div>
        {/* Spin ring */}
        <div className="w-16 h-16 rounded-full border-4 border-t-[#4e5bf2] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      {message && (
        <p className="mt-4 text-[15px] font-medium text-gray-700 tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
