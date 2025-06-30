import React, { useEffect, useRef, useState } from 'react';
import { SnailIcon } from './icons/SnailIcon';

interface RoadmapItemProps {
  phase: string;
  title: string;
  items: string[];
  isCompleted?: boolean;
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({ phase, title, items, isCompleted }) => (
  <div className="relative pl-8">
    {/* The trail */}
    <div className={`absolute left-0 top-0 h-full w-1 rounded-full ${isCompleted ? 'bg-[#00F2FF] trail-glow' : 'bg-gray-700'}`} style={{transition: 'all 0.5s ease'}}></div>
    {/* The checkpoint */}
    <div className={`absolute -left-3.5 top-3 w-8 h-8 rounded-full ${isCompleted ? 'bg-[#00F2FF]' : 'bg-gray-700'} border-4 border-[#0F052B] flex items-center justify-center transition-all duration-500`}>
      {isCompleted && <SnailIcon className="w-5 h-5 text-black" />}
    </div>
    <div className="mb-8">
      <span className={`text-sm font-bold ${isCompleted ? 'text-[#00F2FF]' : 'text-gray-400'}`}>{phase}</span>
      <h4 className="text-2xl font-bold text-white mb-3">{title}</h4>
      <ul className="space-y-1">
        {items.map((item, index) => 
          <li key={index} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-[#00F2FF]' : 'bg-gray-600'}`}></span>
            <span className="text-[#A9A9D5]">{item}</span>
          </li>
        )}
      </ul>
    </div>
  </div>
);

const RoadmapSection: React.FC = () => {
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
      id="roadmap" 
      ref={sectionRef}
      className={`py-20 bg-black/30 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-black text-white text-center mb-12">The Trip (Roadmap)</h2>
        <div className="max-w-2xl mx-auto">
          <RoadmapItem 
            phase="Phase 1"
            title="Rolling the Joint"
            items={["Stealing the lighter", "Website go BRRR", "Summoning the Degens", "Presale Madness"]}
            isCompleted={true}
          />
          <RoadmapItem 
            phase="Phase 2"
            title="First Puff"
            items={["Listing on SnekSwap", "CoinGecko & CMC think we're cool", "10,000 Degens join the trip", "First Meme Contest"]}
          />
          <RoadmapItem 
            phase="Phase 3"
            title="Feeling the Vibe"
            items={["Bribing CEXs with slime", "NFTs that stare back at you", "Giving money to save actual snails (srsly)", "Partnerships with aliens"]}
          />
          <RoadmapItem 
            phase="Phase 4"
            title="Full-Blown Hallucination"
            items={["Listings on Mars", "Jeremy for President Merch", "Achieve true Snailvana", "???"]}
          />
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;