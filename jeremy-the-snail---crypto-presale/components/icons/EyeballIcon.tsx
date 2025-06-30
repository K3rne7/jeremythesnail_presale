import React from 'react';

export const EyeballIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path 
            d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
        />
        <circle 
            cx="12" 
            cy="12" 
            r="4" 
            stroke="currentColor" 
            strokeWidth="1.5"
            fill="currentColor"
            fillOpacity="0.3"
        />
         <circle 
            cx="12" 
            cy="12" 
            r="1.5" 
            fill="white"
            stroke="none"
        />
    </svg>
);