import React from 'react';

export const MushroomIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
        strokeLinecap="round" 
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M20 12c0-2.5-1.5-4.5-4-5.5V6c0-2.2-1.8-4-4-4S8 3.8 8 6v.5C5.5 7.5 4 9.5 4 12h16z" fill="currentColor" fillOpacity="0.4" />
        <path d="M4 12v1c0 2.8 2.2 5 5 5h6c2.8 0 5-2.2 5-5v-1H4z" fill="currentColor" />
        <path d="M10 18v3" />
        <path d="M14 18v3" />
        {/* Spots */}
        <circle cx="8" cy="9" r="1" fill="white" stroke="none" />
        <circle cx="12" cy="8" r="1" fill="white" stroke="none" />
        <circle cx="16" cy="9" r="1" fill="white" stroke="none" />
    </svg>
);