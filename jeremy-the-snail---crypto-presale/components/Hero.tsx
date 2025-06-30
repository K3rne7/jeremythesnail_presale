import React from 'react';
import PresaleCard from './PresaleCard';
import { SnailIcon } from './icons/SnailIcon';
import { MushroomIcon } from './icons/MushroomIcon';
import { EyeballIcon } from './icons/EyeballIcon';

const Hero: React.FC = () => {
  return (
    <section id="presale" className="pt-40 pb-20 px-6 min-h-[90vh] flex items-center">
      <div className="container mx-auto flex flex-col-reverse md:grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left relative">
          <div className="relative inline-block mb-4 animate-float-light">
            <SnailIcon className="w-48 h-48 text-[#FF00E5]" />
          </div>
           {/* Floating Crazy Stuff */}
          <MushroomIcon className="w-16 h-16 absolute -top-8 -right-8 text-red-500 transform rotate-12" style={{ animation: 'float-crazy 8s ease-in-out infinite' }} />
          <EyeballIcon className="w-12 h-12 absolute bottom-0 -left-8 text-cyan-300" style={{ animation: 'float-crazy 10s ease-in-out infinite reverse' }}/>
          <MushroomIcon className="w-10 h-10 absolute top-1/2 -left-16 text-green-400 transform -rotate-12" style={{ animation: 'float-crazy 7s ease-in-out infinite' }} />


          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight bg-gradient-to-r from-[#FF00E5] via-[#7B2BFC] to-[#00F2FF] bg-[200%_auto] animate-pan">
            They told him to hurry up.<br />
            He took another hit.<br />
            Welcome to the $JEREMY trip.
          </h1>
          <p className="text-xl text-[#A9A9D5] max-w-lg mx-auto md:mx-0">
            Forget rockets. We're building a psychedelic snail trail to financial nirvana. This is max comfy. This is the vibe. Are you in?
          </p>
        </div>
        <div className="w-full max-w-md mx-auto">
          <PresaleCard />
        </div>
      </div>
    </section>
  );
};

// Add this to your CSS or a style tag if not using a CSS file with Tailwind directives
const style = document.createElement('style');
style.innerHTML = `
  @keyframes pan {
    from {
      background-position: 0% center;
    }
    to {
      background-position: 200% center;
    }
  }
  .animate-pan {
    animation: pan 5s linear infinite;
  }
`;
document.head.appendChild(style);


export default Hero;