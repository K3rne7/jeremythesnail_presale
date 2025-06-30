import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import TokenomicsSection from './components/TokenomicsSection';
import RoadmapSection from './components/RoadmapSection';
import Footer from './components/Footer';
import { SparkleIcon } from './components/icons/SparkleIcon';
import WhitepaperPage from './components/WhitepaperPage';
import FeatureSection from './components/FeatureSection';
import { LiquidityIcon } from './components/icons/LiquidityIcon';
import { MarketingIcon } from './components/icons/MarketingIcon';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [page, setPage] = useState('home');

  return (
    <div className="bg-[#0F052B] text-[#F0F0F0] min-h-screen overflow-x-hidden relative">
      {/* Animated background orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
          <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full -top-20 -left-20 animate-float-orb-1 opacity-70"></div>
          <div className="absolute w-72 h-72 bg-purple-500/20 rounded-full bottom-[-10rem] right-[-5rem] animate-float-orb-2 opacity-70"></div>
          <div className="absolute w-48 h-48 bg-cyan-400/20 rounded-full bottom-[20rem] left-[10rem] animate-float-orb-2 opacity-70"></div>
          <div className="absolute w-80 h-80 bg-indigo-500/20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-orb-1 opacity-50"></div>
          {/* Extra sparkles */}
          <SparkleIcon className="absolute top-1/4 left-1/4 w-8 h-8 text-pink-400 opacity-60 animate-float-light" style={{ animationDelay: '1s' }} />
          <SparkleIcon className="absolute bottom-1/3 right-1/4 w-12 h-12 text-cyan-400 opacity-60 animate-float-light" style={{ animationDelay: '0s' }}/>
          <SparkleIcon className="absolute top-1/2 right-1/2 w-6 h-6 text-purple-400 opacity-60 animate-float-light" style={{ animationDelay: '2s' }}/>
      </div>
      
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} setPage={setPage} />
      
      {page === 'home' ? (
        <div className={`relative z-10 transition-all duration-500 ease-in-out ${isMenuOpen ? 'transform scale-[0.9] blur-sm' : 'transform scale-100 blur-0'}`}>
          <main>
            <Hero />
            <AboutSection />
            <FeatureSection 
                title="Max Comfy, Max Secure"
                description="Our liquidity is locked in a time-traveling vault guarded by a three-headed space badger. Your funds are so safe, they're practically napping. We believe in transparency, so our team wallets are public. Go ahead, stalk us. We're into it."
                icon={<LiquidityIcon className="w-24 h-24 text-[#00F2FF] glitch-target" />}
                imagePosition="left"
            />
            <TokenomicsSection />
            <FeatureSection 
                title="Community is King"
                description="Jeremy isn't a dictator; he's a vibe curator. Holders of $JEREMY will get to vote on key decisions, like what color the next batch of magic mushrooms should be, and where to donate to save real snails. This is your trip, too."
                icon={<MarketingIcon className="w-24 h-24 text-[#FF00E5] glitch-target" />}
                imagePosition="right"
            />
            <RoadmapSection />
          </main>
          <Footer />
        </div>
      ) : (
         <WhitepaperPage onBack={() => setPage('home')} />
      )}
    </div>
  );
};

export default App;
