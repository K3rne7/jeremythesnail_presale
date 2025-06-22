
import React, { useEffect, useRef } from 'react';
import { animateRoadmapTimeline } from './gsap/animations';
import type { RoadmapItem } from '../types';

const roadmapData: RoadmapItem[] = [
  { quarter: 'Q3 2025', title: 'Presale Launch & Community Building', description: 'Kick off the $JEREMY presale. Grow our snail army on social media. Initial marketing push.', completed: false },
  { quarter: 'Q4 2025', title: 'PancakeSwap Listing & First CEX', description: 'Successfully list $JEREMY on PancakeSwap. Secure listing on a reputable Centralized Exchange. Launch staking program.', completed: false },
  { quarter: 'Q1 2026', title: 'NFT Collection & Snailverse Alpha', description: 'Release the exclusive J-SNAIL NFT collection. Alpha launch of the Snailverse, our meme-powered metaverse.', completed: false },
  { quarter: 'Q2 2026', title: 'Partnerships & Platform Expansion', description: 'Forge strategic partnerships in the DeFi and meme coin space. Expand Snailverse features and utility for $JEREMY.', completed: false },
];

const RoadmapCard: React.FC<{ item: RoadmapItem, index: number }> = ({ item, index }) => {
  const isEven = index % 2 === 0;
  return (
    <div className={`roadmap-item flex ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} mb-8 md:mb-0 w-full`}>
      <div className="hidden md:flex w-5/12"></div> {/* Spacer for alignment */}
      <div className="hidden md:flex w-2/12 justify-center items-center">
        <div className="w-1 h-full bg-primary-DEFAULT group-hover:bg-secondary-light transition-colors duration-300"></div>
        <div className="absolute w-6 h-6 rounded-full bg-primary-DEFAULT border-4 border-neutral-900 group-hover:bg-secondary-light transition-colors duration-300 z-10"></div>
      </div>
      <div className={`w-full md:w-5/12 p-4 rounded-lg shadow-xl bg-neutral-800 border border-neutral-700 hover:border-secondary-DEFAULT transition-all duration-300 transform hover:scale-105 ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
        <div className="text-sm font-semibold text-secondary-light mb-1">{item.quarter}</div>
        <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
        <p className="text-neutral-300 text-sm">{item.description}</p>
        {item.completed && <span className="inline-block mt-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Completed</span>}
      </div>
    </div>
  );
};


const SectionRoadmap: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current && timelineRef.current) {
      animateRoadmapTimeline(timelineRef.current.querySelectorAll('.roadmap-item'));
    }
  }, []);

  return (
    <section id="roadmap" ref={sectionRef} className="py-16 md:py-24 bg-neutral-800 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-16 md:mb-20 bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary-light">
          Our Journey to the Moon
        </h2>
        <div ref={timelineRef} className="relative wrap overflow-hidden">
          {/* Central line for desktop */}
          <div className="absolute h-full border border-dashed border-opacity-20 border-primary-light hidden md:block" style={{ left: '50%', transform: 'translateX(-50%)' }}></div>
          
          {/* Mobile line */}
           <div className="absolute h-full border border-dashed border-opacity-20 border-primary-light md:hidden" style={{ left: '20px' }}></div>


          {roadmapData.map((item, index) => (
             <div key={index} className={`roadmap-item group mb-8 flex md:justify-between items-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              {/* Desktop view */}
              <div className="hidden md:block order-1 w-5/12"></div>
              <div className="hidden md:block z-20 flex items-center order-1 bg-primary-DEFAULT group-hover:bg-secondary-light shadow-xl w-10 h-10 rounded-full transition-colors duration-300">
                <div className="mx-auto text-white font-semibold text-lg">{index + 1}</div>
              </div>
              <div className="order-1 bg-neutral-700 hover:bg-neutral-600 rounded-lg shadow-xl w-full md:w-5/12 px-6 py-4 transition-all duration-300 transform hover:scale-105 border border-neutral-600 hover:border-secondary-DEFAULT ml-8 md:ml-0 md:mr-0">
                <div className="text-sm font-semibold text-secondary-light mb-1">{item.quarter}</div>
                <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                <p className="text-neutral-300 text-sm leading-relaxed">{item.description}</p>
                {item.completed && <span className="inline-block mt-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow">Completed</span>}
              </div>

              {/* Mobile view indicator */}
              <div className="block md:hidden z-20 flex items-center order-first bg-primary-DEFAULT group-hover:bg-secondary-light shadow-xl w-10 h-10 rounded-full transition-colors duration-300 absolute" style={{left: '20px', transform: 'translateX(-50%)'}}>
                 <div className="mx-auto text-white font-semibold text-lg">{index + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionRoadmap;
