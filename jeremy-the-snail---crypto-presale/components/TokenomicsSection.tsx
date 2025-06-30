import React, { useEffect, useRef, useState } from 'react';
import { PresaleIcon } from './icons/PresaleIcon';
import { LiquidityIcon } from './icons/LiquidityIcon';
import { MarketingIcon } from './icons/MarketingIcon';

interface TokenomicItemProps {
  percentage: string;
  title: string;
  description: string;
  color: string;
  shadowColor: string;
  icon: React.ReactNode;
}

const TokenomicItem: React.FC<TokenomicItemProps> = ({ percentage, title, description, color, shadowColor, icon }) => (
  <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-t-4 text-center" style={{ borderColor: color, boxShadow: `0 0 15px ${shadowColor}` }}>
    <div className="flex justify-center mb-4 text-white" style={{color}}>
      {icon}
    </div>
    <div className="text-4xl font-black mb-2" style={{ color }}>{percentage}</div>
    <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
    <p className="text-[#A9A9D5]">{description}</p>
  </div>
);

const TokenomicsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section 
      id="tokenomics" 
      ref={sectionRef}
      className={`py-20 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-black text-white mb-12">Snail-onomics</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <TokenomicItem 
            percentage="40%" 
            title="Presale"
            description="Fueling our initial journey and community building."
            color="#FF00E5"
            shadowColor="rgba(255, 0, 229, 0.3)"
            icon={<PresaleIcon className="w-12 h-12" />}
          />
          <TokenomicItem 
            percentage="30%" 
            title="Liquidity Pool"
            description="Ensuring a stable and healthy trading environment on DEXs."
            color="#00F2FF"
            shadowColor="rgba(0, 242, 255, 0.3)"
            icon={<LiquidityIcon className="w-12 h-12" />}
          />
          <TokenomicItem 
            percentage="30%" 
            title="Marketing & Team"
            description="Spreading the word of Jeremy and funding future development."
            color="#7B2BFC"
            shadowColor="rgba(123, 43, 252, 0.3)"
            icon={<MarketingIcon className="w-12 h-12" />}
          />
        </div>
      </div>
    </section>
  );
};

export default TokenomicsSection;