import React, { useEffect, useRef, useState } from 'react';
import { SnailIcon } from './icons/SnailIcon';

const AboutSection: React.FC = () => {
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
      id="about" 
      ref={sectionRef}
      className={`py-20 bg-black/30 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-black text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400 inline-block">The Gospel of Jeremy</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="p-4 transform -rotate-3 bg-black/40 shadow-2xl rounded-3xl shadow-cyan glitch-container">
            <SnailIcon className="w-full h-full text-[#00F2FF] glitch-target" />
          </div>
          <div className="text-lg text-[#A9A9D5] text-left space-y-4">
            <p>
              Legend says Jeremy was born from a radioactive puddle at a 1970s rock festival. He saw the future of crypto and... decided to take a nap. He's not here for a quick pump. He's here for a long, strange trip.
            </p>
            <p>
              $JEREMY isn't a coin; it's a statement. It's for the patient, the believers, the connoisseurs of cosmic memes. This ain't your grandma's investment. It's a vibe. We're building a community-powered snail trail to the stars. Hop on, the ride is smooth, slimy and ridiculously comfy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;