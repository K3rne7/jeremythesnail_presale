
import React, { useEffect, useRef } from 'react';
import { animateElementOnScroll } from './gsap/animations'; // Assuming animateCardFlip exists or create a similar one
import { TEAM_MEMBER_PLACEHOLDER_IMAGE_URL, SNAIL_THRONE_IMAGE_URL, SNAIL_GRAFFITI_IMAGE_URL } from '../constants';
import type { TeamMember } from '../types';

const teamMembers: TeamMember[] = [
  { name: 'J-Snail Prime', role: 'El Presidente & Visionary', image: SNAIL_THRONE_IMAGE_URL, bio: 'The OG snail with the golden chain. Mastermind behind the $JEREMY empire. Slow, steady, and filthy rich.' },
  { name: 'Shelly "The Dev" Snail', role: 'Lead Blockchain Developer', image: TEAM_MEMBER_PLACEHOLDER_IMAGE_URL, bio: 'Codes faster than a cheetah on espresso. Built the Snailverse from scratch. Don\'t let the shell fool you.' },
  { name: 'Gary "The Hype" Gastropod', role: 'Chief Marketing Officer', image: SNAIL_GRAFFITI_IMAGE_URL, bio: 'Spreads the word of $JEREMY like wildfire. Can sell salt to a slug. Master of memes and viral campaigns.' },
];

const TeamCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (cardRef.current) {
  //     // animateCardFlip(cardRef.current); // If using a flip animation
  //   }
  // }, []);

  return (
    <div ref={cardRef} className="team-card bg-neutral-800 rounded-xl shadow-2xl overflow-hidden border-2 border-primary-dark transform transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_theme(colors.secondary.DEFAULT)] group">
      <div className="relative card-front">
        <img src={member.image} alt={member.name} className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h4 className="text-2xl font-bold text-white font-display">{member.name}</h4>
          <p className="text-secondary-light font-medium">{member.role}</p>
        </div>
      </div>
      {/* Optional back for flip animation, simplified here */}
       <div className="p-6 bg-neutral-800">
         <p className="text-neutral-300 text-sm">{member.bio}</p>
       </div>
    </div>
  );
};

const SectionTeam: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      // Animate each card individually for a staggered effect
      const cards = sectionRef.current.querySelectorAll('.team-card');
      cards.forEach((card, index) => {
        animateElementOnScroll(card as HTMLElement, { delay: index * 0.15 });
      });
    }
  }, []);

  return (
    <section id="team" ref={sectionRef} className="py-16 md:py-24 bg-neutral-900 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12 md:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary-light">
          Meet the Snails Behind the Shells
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {teamMembers.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionTeam;
