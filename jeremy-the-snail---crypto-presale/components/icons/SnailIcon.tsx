import React from 'react';

// This is our new mascot, Jeremy!
// The colors are now controlled by the `currentColor` property via `className` for better theming.
export const SnailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Shell */}
    <path d="M90 57C90 75.2254 75.2254 90 57 90C38.7746 90 24 75.2254 24 57C24 38.7746 38.7746 24 57 24C75.2254 24 90 38.7746 90 57Z" stroke="currentColor" strokeWidth="6"/>
    <path d="M90 57C90 75.2254 75.2254 90 57 90C38.7746 90 24 75.2254 24 57C24 38.7746 38.7746 24 57 24C75.2254 24 90 38.7746 90 57Z" fill="currentColor" fillOpacity="0.2"/>
    <path d="M57 57C57 65.2843 50.2843 72 42 72C33.7157 72 27 65.2843 27 57C27 48.7157 33.7157 42 42 42C50.2843 42 57 48.7157 57 57Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
    <path d="M57 57C57 51.4772 52.5228 47 47 47C41.4772 47 37 51.4772 37 57" stroke="currentColor" strokeOpacity="0.4" strokeWidth="3" strokeLinejoin="round"/>
    
    {/* Body */}
    <path d="M15 85C15 75 35 72 40 62C45 52 25 45 25 35S45 20 55 20" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Underbelly */}
    <path d="M10 90H80C85 90 90 85 90 80V75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Eyes */}
    <path d="M55 20C57 15 62 10 65 12" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
    <path d="M45 25C43 20 48 15 51 17" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
    <circle cx="67" cy="11" r="4" fill="white"/>
    <circle cx="53" cy="16" r="4" fill="white"/>
    <circle cx="67.5" cy="10.5" r="1.5" fill="black"/>
    <circle cx="53.5" cy="15.5" r="1.5" fill="black"/>
  </svg>
);