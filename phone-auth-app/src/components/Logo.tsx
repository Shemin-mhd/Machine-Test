import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 56 }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Black circle background */}
        <circle cx="50" cy="50" r="46" fill="#000000" />
        
        {/* Group to center contents */}
        <g transform="translate(14, 35)">
          {/* TOTAL- text */}
          <text
            x="0"
            y="21"
            fill="#FFFFFF"
            fontFamily="'Outfit', 'Inter', sans-serif"
            fontWeight="700"
            fontSize="15"
            letterSpacing="-0.2"
          >
            TOTAL-
          </text>
          
          {/* Yellow badge container for X */}
          <rect x="52" y="3" width="20" height="24" rx="3" fill="#FACC15" />
          
          {/* X text inside yellow box */}
          <text
            x="62"
            y="21"
            fill="#000000"
            textAnchor="middle"
            fontFamily="'Outfit', 'Inter', sans-serif"
            fontWeight="900"
            fontSize="17"
          >
            X
          </text>
        </g>
      </svg>
    </div>
  );
};

export default Logo;
