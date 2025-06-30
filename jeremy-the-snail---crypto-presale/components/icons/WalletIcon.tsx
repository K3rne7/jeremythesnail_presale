
import React from 'react';

export const WalletIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    {...props}
  >
    <path d="M10.75 10.818v2.432c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-2.432a.75.75 0 00-.43-.68l-2.25-1.125a.75.75 0 00-.64 0l-2.25 1.125a.75.75 0 00-.43.68z" />
    <path fillRule="evenodd" d="M3 5.25A2.25 2.25 0 015.25 3h9.5A2.25 2.25 0 0117 5.25v9.5A2.25 2.25 0 0114.75 17h-9.5A2.25 2.25 0 013 14.75v-9.5zm2.25-.75a.75.75 0 00-.75.75v9.5c0 .414.336.75.75.75h9.5a.75.75 0 00.75-.75v-9.5a.75.75 0 00-.75-.75h-9.5z" clipRule="evenodd" />
  </svg>
);
