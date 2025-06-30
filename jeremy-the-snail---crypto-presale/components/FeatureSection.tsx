import React from 'react';

interface FeatureSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imagePosition?: 'left' | 'right';
  id?: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ title, description, icon, imagePosition = 'left', id }) => {
  const isImageLeft = imagePosition === 'left';

  return (
    <section id={id} className="py-20 bg-black/20">
      <div className="container mx-auto px-6">
        <div className={`flex flex-col md:flex-row items-center gap-12 ${!isImageLeft ? '' : 'md:flex-row-reverse'}`}>
          
          <div className="md:w-1/2 text-center md:text-left flex-shrink-0 flex justify-center">
             <div className={`p-4 transform bg-black/40 shadow-2xl rounded-3xl shadow-cyan glitch-container ${isImageLeft ? 'rotate-3' : '-rotate-3'}`}>
              {icon}
            </div>
          </div>

          <div className="md:w-1/2 text-center md:text-left">
            <h3 className="text-4xl font-black text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 inline-block">
              {title}
            </h3>
            <p className="text-lg text-[#A9A9D5] space-y-4">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
