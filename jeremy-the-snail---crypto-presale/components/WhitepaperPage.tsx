import React from 'react';

interface WhitepaperPageProps {
  onBack: () => void;
}

const WhitepaperPage: React.FC<WhitepaperPageProps> = ({ onBack }) => {
  return (
    <main className="pt-40 pb-20 px-6 relative z-10 animate-fade-in">
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
       `}</style>
      <div className="container mx-auto">
        <button 
          onClick={onBack}
          className="mb-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2 px-6 rounded-full hover:shadow-lg hover:shadow-purple-500/40 transition-all transform hover:scale-105"
        >
          &larr; Back to the Trip
        </button>

        <div className="bg-black/40 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-purple-500/50 shadow-purple-500/30">
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight bg-gradient-to-r from-[#FF00E5] via-[#7B2BFC] to-[#00F2FF] bg-clip-text text-transparent">
            The Sacred Scrolls of Jeremy
          </h1>
          <p className="text-xl text-[#A9A9D5] mb-8 max-w-4xl">
            This is where the magic happens. Our whitepaper, meticulously scribbled by Jeremy on a particularly trippy Tuesday. It details the vision, the tech (or lack thereof), and the master plan for snail-based financial domination.
          </p>
          
          <div className="w-full min-h-[70vh] bg-black/50 border-2 border-purple-500/50 rounded-xl flex flex-col items-center justify-center p-8 text-center overflow-hidden">
             <div className="w-full h-full border-4 border-dashed border-purple-500/30 rounded-lg flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-white mb-4">Whitepaper Coming Soon...</h2>
                <p className="text-[#A9A9D5]">Jeremy is still... uh... "researching". The ink is drying. The shrooms are kicking in. It'll be here before the heat death of the universe. Probably.</p>
                <p className="text-6xl mt-8 animate-float-light">🐌📜</p>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WhitepaperPage;