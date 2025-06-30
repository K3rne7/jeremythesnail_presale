import React, { useEffect } from 'react';
import { SnailIcon } from './icons/SnailIcon';
import { TelegramIcon } from './icons/TelegramIcon';
import { XIcon } from './icons/XIcon';

interface HeaderProps {
    isMenuOpen: boolean;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setPage: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen, setPage }) => {

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    if (id === 'whitepaper') {
      setPage('whitepaper');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    
    // If on another page, switch to home first, then scroll
    setPage('home');
    setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50); // Small delay to allow React to render the home page
  };
  
  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    }
    return () => {
        if(body) {
            body.style.overflow = 'auto';
        }
    }
  }, [isMenuOpen]);

  const navLinks = (
    <>
      <button onClick={() => scrollToSection('about')} className="hover:text-[#00F2FF] transition-colors duration-300">About</button>
      <button onClick={() => scrollToSection('tokenomics')} className="hover:text-[#00F2FF] transition-colors duration-300">Snail-onomics</button>
      <button onClick={() => scrollToSection('roadmap')} className="hover:text-[#00F2FF] transition-colors duration-300">The Trip</button>
      <button onClick={() => scrollToSection('whitepaper')} className="hover:text-[#00F2FF] transition-colors duration-300">Whitepaper</button>
    </>
  );

  return (
    <>
      <header className="py-4 px-6 md:px-12 fixed top-0 w-full z-50 bg-[#0F052B]/90 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('presale')}>
            <SnailIcon className="h-12 w-12 text-[#FF00E5]" />
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">Jeremy</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 font-bold text-lg">
            {navLinks}
          </nav>

          <button
            onClick={() => scrollToSection('presale')}
            className="hidden md:block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold py-2 px-6 rounded-full hover:shadow-lg hover:shadow-purple-500/40 transition-all transform hover:scale-105"
          >
            Get Trippy
          </button>

          {/* Mobile Menu Button - Rebuilt for perfection */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-8 h-8 relative focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="block w-7 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span
                aria-hidden="true"
                className={`block absolute h-0.5 w-7 bg-white transition-transform duration-300 ease-in-out ${
                  isMenuOpen ? 'rotate-45' : '-translate-y-2'
                }`}
              ></span>
              <span
                aria-hidden="true"
                className={`block absolute h-0.5 w-7 bg-white transition-opacity duration-300 ease-in-out ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                aria-hidden="true"
                className={`block absolute h-0.5 w-7 bg-white transition-transform duration-300 ease-in-out ${
                  isMenuOpen ? '-rotate-45' : 'translate-y-2'
                }`}
              ></span>
            </div>
          </button>
        </div>
      </header>
      
      {/* Mobile Menu Panel */}
      <div className={`fixed inset-0 bg-[#0F052B]/90 backdrop-blur-xl z-40 transition-opacity duration-300 ease-in-out md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center justify-center h-full gap-8 text-3xl font-black">
              {navLinks}
              <button
                  onClick={() => scrollToSection('presale')}
                  className="mt-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold py-4 px-10 rounded-full hover:shadow-lg hover:shadow-purple-500/40 transition-all transform hover:scale-105"
                >
                  Get Trippy
                </button>
                <div className="flex gap-6 mt-8">
                  <a href="#" aria-label="X" className="text-gray-400 hover:text-[#00F2FF] transition-colors">
                    <XIcon className="w-8 h-8" />
                  </a>
                  <a href="#" aria-label="Telegram" className="text-gray-400 hover:text-[#00F2FF] transition-colors">
                    <TelegramIcon className="w-8 h-8" />
                  </a>
                </div>
          </div>
      </div>
    </>
  );
};

export default Header;