
import React, { useEffect, useRef } from 'react';
import { animateHeroText, createParallax } from './gsap/animations';
import { LOGO_URL_SVG, HERO_BACKGROUND_IMAGE_URL, SNAIL_GRAFFITI_IMAGE_URL } from '../constants';
import { Link as ScrollLink } from 'react-scroll';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);


  useEffect(() => {
    if (titleRef.current && subtitleRef.current && ctaRef.current) {
      animateHeroText([titleRef.current, subtitleRef.current, ctaRef.current]);
    }
    if (imageRef.current) {
        gsap.fromTo(imageRef.current, 
            { opacity: 0, y: 100, rotate: -5 }, 
            { opacity: 1, y: 0, rotate: 0, duration: 1.5, ease: 'elastic.out(1, 0.5)', delay: 0.5 }
        );
        createParallax(imageRef.current, 30); // parallax effect
    }
  }, []);

  return (
    <section 
      ref={heroRef}
      id="hero" 
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden p-4 md:p-8 bg-gradient-to-br from-neutral-900 via-primary-dark to-neutral-900 animation-gradient-bg"
      style={{ backgroundSize: '200% 200%' }}
    >
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${SNAIL_GRAFFITI_IMAGE_URL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-around w-full max-w-6xl mx-auto">
        <div className="lg:w-1/2 lg:text-left mb-10 lg:mb-0 p-4">
          <img src={LOGO_URL_SVG} alt="Jeremy Logo" className="w-48 h-auto mb-6 mx-auto lg:mx-0 filter drop-shadow-lg" />
          <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-jsnail-gold via-accent-light to-secondary-light mb-6 leading-tight animate-pulse-glow">
            Meet JEREMY <br/> The Richest Snail!
          </h1>
          <p ref={subtitleRef} className="text-lg md:text-xl text-neutral-300 mb-10 max-w-md mx-auto lg:mx-0">
            $JEREMY isn't just a token, it's a movement. Slow and steady wins the race to the moon.
            Get in on the presale before this snail speeds off!
          </p>
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <ScrollLink
              to="buy-panel"
              smooth={true}
              duration={500}
              offset={-80} // Adjust offset if you have a sticky header
              className="cursor-pointer bg-gradient-to-r from-jsnail-gold to-accent-light hover:from-accent-light hover:to-jsnail-gold text-neutral-900 font-bold py-4 px-8 rounded-lg text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-pulse-glow"
            >
              Buy $JEREMY Now!
            </ScrollLink>
            <a
              href="/Whitepaper.pdf" // Link to your whitepaper
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-secondary-DEFAULT text-secondary-DEFAULT hover:bg-secondary-DEFAULT hover:text-neutral-900 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Read Whitepaper
            </a>
          </div>
        </div>

        <div className="lg:w-1/2 flex justify-center items-center p-4">
            <img 
                ref={imageRef}
                src={HERO_BACKGROUND_IMAGE_URL} 
                alt="Jeremy the Snail mascot" 
                className="w-full max-w-md md:max-w-lg rounded-xl shadow-2xl object-contain filter drop-shadow-[0_10px_15px_rgba(0,255,163,0.3)] animate-subtle-bob"
            />
        </div>
      </div>
       <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-neutral-400 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
