import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const id = useId();

    return (
      <div className="w-full">
        <div className="relative flex items-center">

          <input
            id={id}
            ref={ref}
            className={`peer block w-full py-4 px-4 text-[15px] text-gray-900 bg-transparent border rounded-md focus:outline-none focus:ring-0 transition-colors duration-200
              ${error 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-[#4e5bf2]'
              } 
              ${className}
            `}
            {...props}
          />
          
          <label
            htmlFor={id}
            className={`absolute duration-200 transform origin-[0] bg-white px-1.5 select-none pointer-events-none
              left-3 text-xs font-sans transition-colors
              top-0 -translate-y-1/2
              ${error ? 'text-red-500 font-semibold' : 'text-gray-400 peer-focus:text-[#4e5bf2]'}
            `}
          >
            {label}
          </label>
        </div>

        {error && (
          <p className="mt-1 text-xs text-red-500 font-medium pl-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
