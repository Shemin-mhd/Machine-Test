import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = "w-full py-4 px-4 rounded-md font-medium text-[15px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 select-none active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

  const variants = {
    primary: "bg-[#4e5bf2] text-white hover:bg-[#3d4ae0] focus:ring-[#4e5bf2] shadow-sm",
    secondary: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400"
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};

export default Button;
