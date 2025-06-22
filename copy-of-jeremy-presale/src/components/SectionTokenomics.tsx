
import React, { useEffect, useRef } from 'react';
import { animateElementOnScroll } from './gsap/animations';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TOKENOMICS_CHART_IMAGE_URL } from '../constants'; // For fallback or additional image

const TOKEN_DISTRIBUTION = [
  { name: 'Presale', value: 40, color: '#5E00BC' }, // primary.DEFAULT
  { name: 'Liquidity', value: 25, color: '#00D688' }, // secondary.DEFAULT
  { name: 'Team & Advisors', value: 15, color: '#FFC400' }, // accent.DEFAULT
  { name: 'Marketing & Development', value: 10, color: '#7F00FF' }, // primary.light
  { name: 'Ecosystem Fund', value: 10, color: '#00FFA3' }, // secondary.light
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-700 p-3 rounded-md shadow-lg border border-neutral-600">
        <p className="text-sm text-white">{`${payload[0].name} : ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const SectionTokenomics: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      animateElementOnScroll(sectionRef.current.children);
    }
  }, []);

  return (
    <section id="tokenomics" ref={sectionRef} className="py-16 md:py-24 bg-neutral-900 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12 md:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary-light">
          $JEREMY Tokenomics
        </h2>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div ref={chartRef} className="w-full h-80 md:h-96 relative animate-slide-in">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={TOKEN_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                  // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {TOKEN_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} className="focus:outline-none hover:opacity-80 transition-opacity"/>
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" 
                  wrapperStyle={{ color: '#F3F4F6' /* neutral-light */, fontSize: '14px' }} 
                  formatter={(value, entry) => <span style={{color: entry.color}} className="text-neutral-300 ml-2">{value} ({entry.payload.value}%)</span>}
                />
              </PieChart>
            </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-neutral-800 rounded-full flex items-center justify-center shadow-xl">
                 <img src="/src/assets/jeremy-logo.svg" alt="Jeremy Logo" className="w-16 h-16 md:w-20 md:h-20" />
              </div>
            </div>
          </div>
          <div className="space-y-6 animate-slide-in" style={{animationDelay: '0.2s'}}>
            <p className="text-lg text-neutral-300">
              $JEREMY has a total supply designed for sustainable growth and community rewards. Our tokenomics ensure a fair distribution, strong liquidity, and continuous development.
            </p>
            <ul className="space-y-3">
              {TOKEN_DISTRIBUTION.map(item => (
                <li key={item.name} className="flex items-center">
                  <span className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: item.color }}></span>
                  <span className="text-neutral-200">{item.name}: <strong className="text-white">{item.value}%</strong></span>
                </li>
              ))}
            </ul>
            <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                <p className="text-sm font-semibold text-secondary-light">Total Supply: <span className="text-white">1,000,000,000 $JEREMY</span></p>
                <p className="text-sm font-semibold text-secondary-light mt-1">Token Symbol: <span className="text-white">$JEREMY</span></p>
                <p className="text-sm font-semibold text-secondary-light mt-1">Network: <span className="text-white">Binance Smart Chain (BEP-20)</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionTokenomics;
