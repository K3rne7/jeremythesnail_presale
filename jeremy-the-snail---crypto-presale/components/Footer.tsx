import React from 'react';
import { XIcon } from './icons/XIcon';
import { TelegramIcon } from './icons/TelegramIcon';
import { SnailIcon } from './icons/SnailIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/50 py-12">
      <div className="container mx-auto px-6 text-center text-[#A9A9D5]">
        <div className="flex justify-center items-center gap-3 mb-4">
          <SnailIcon className="h-10 w-10 text-[#FF00E5]" />
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">Jeremy the Snail</span>
        </div>
        <p className="max-w-lg mx-auto mb-6">
          Join our degenerate community and follow the snail trail. The slowest, comfiest, most psychedelic meme coin on any blockchain.
        </p>
        <div className="flex justify-center gap-6 mb-8">
          <a href="#" aria-label="X" className="text-gray-400 hover:text-[#00F2FF] transition-colors">
            <XIcon className="w-8 h-8" />
          </a>
          <a href="#" aria-label="Telegram" className="text-gray-400 hover:text-[#00F2FF] transition-colors">
            <TelegramIcon className="w-8 h-8" />
          </a>
        </div>
        <p className="text-sm">
          © {new Date().getFullYear()} Jeremy the Snail. All Rights Reserved. Probably.
        </p>
        <p className="text-xs text-gray-500 mt-4 max-w-2xl mx-auto">
          Disclaimer: Crypto is the wild west, and we're the weirdest saloon in town. $JEREMY is a meme coin with no intrinsic value, created for lols, vibes, and questionable financial decisions. Its value could rocket to Uranus or dive to the bottom of the primordial ooze. Don't invest your rent money unless you enjoy sleeping in a cardboard box. This is not financial advice, it's a social experiment with a snail.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
