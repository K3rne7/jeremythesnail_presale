
import React, { useEffect, useState } from 'react';
import usePresaleStore from '../hooks/usePresaleStore';
import { HARD_CAP_TOKENS, POLLING_INTERVAL_GENERAL } from '../constants'; // Corrected import
import { PRESALE_CONTRACT_ADDRESS } from '../constants';
import PresaleABI from '../abi/Presale.json';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';

// Helper to format large numbers
const formatTokenAmount = (amount: number): string => {
  if (amount >= 1_000_000_000) return (amount / 1_000_000_000).toFixed(1) + 'B';
  if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1) + 'M';
  if (amount >= 1_000) return (amount / 1_000).toFixed(1) + 'K';
  return amount.toString();
};

const ProgressBar: React.FC = () => {
  const { tokensSold, hardCap, setTokensSold } = usePresaleStore();
  const [displayTokensSold, setDisplayTokensSold] = useState(0);

  const { data: fetchedTokensSold, isLoading, error, refetch } = useReadContract({
    abi: PresaleABI,
    address: PRESALE_CONTRACT_ADDRESS,
    functionName: 'totalTokensSold',
    query: {
      refetchInterval: POLLING_INTERVAL_GENERAL, // Corrected usage
    }
  });

  useEffect(() => {
    if (fetchedTokensSold) {
      // Assuming totalTokensSold returns value in wei (or smallest unit of JEREMY token)
      // And JEREMY token has 18 decimals
      const tokensSoldFormatted = parseFloat(formatUnits(fetchedTokensSold as bigint, 18));
      setTokensSold(tokensSoldFormatted);
    }
  }, [fetchedTokensSold, setTokensSold]);

  useEffect(() => {
    // Smooth animation for tokens sold number
    const target = tokensSold;
    let current = displayTokensSold;
    
    if (current === target) return;

    const increment = (target - current) / 20; // Animate over 20 frames

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
        current = target;
        clearInterval(timer);
      }
      setDisplayTokensSold(current);
    }, 30); // Update every 30ms

    return () => clearInterval(timer);
  }, [tokensSold, displayTokensSold]);


  const percentage = hardCap > 0 ? (tokensSold / hardCap) * 100 : 0;
  const displayPercentage = hardCap > 0 ? (displayTokensSold / hardCap) * 100 : 0;

  return (
    <section id="progress" className="py-12 bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-neutral-800 p-6 md:p-8 rounded-xl shadow-2xl border border-primary-dark">
          <div className="flex justify-between items-end mb-2 text-sm">
            <span className="font-medium text-neutral-300">Progress</span>
            <span className="font-bold text-accent-light">{percentage.toFixed(2)}%</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-6 md:h-8 overflow-hidden border border-neutral-600 shadow-inner">
            <div
              className="bg-gradient-to-r from-secondary-DEFAULT to-primary-light h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end"
              style={{ width: `${displayPercentage > 100 ? 100 : displayPercentage}%` }}
            >
             {displayPercentage > 10 && <span className="pr-3 text-xs md:text-sm font-bold text-white opacity-80">{displayPercentage.toFixed(1)}%</span>}
            </div>
          </div>
          <div className="flex justify-between items-start mt-3 text-sm">
            <div className="text-neutral-400">
              <span className="block">Tokens Sold:</span>
              <span className="font-bold text-lg text-white">{formatTokenAmount(Math.floor(displayTokensSold))} $JEREMY</span>
            </div>
            <div className="text-right text-neutral-400">
              <span className="block">Hard Cap:</span>
              <span className="font-bold text-lg text-white">{formatTokenAmount(hardCap)} $JEREMY</span>
            </div>
          </div>
          {isLoading && <p className="text-center text-neutral-400 mt-4">Loading progress...</p>}
          {error && <p className="text-center text-red-500 mt-4">Error fetching progress. Will retry.</p>}
        </div>
      </div>
    </section>
  );
};

export default ProgressBar;
