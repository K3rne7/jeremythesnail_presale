
import React, { useEffect } from 'react';
import usePresaleStore, { findCurrentPresaleStage } from '../hooks/usePresaleStore';
import useCountdown from '../hooks/useCountdown';
import { STAGES, PRESALE_START_DATE, PRESALE_END_DATE } from '../data/stages';
import type { CountdownValues } from '../types';

const CountdownUnit: React.FC<{ value: number; unit: string }> = ({ value, unit }) => (
  <div className="flex flex-col items-center mx-1 sm:mx-2 p-2 sm:p-3 bg-neutral-700/50 rounded-lg shadow-md w-16 sm:w-20">
    <span className="text-2xl sm:text-3xl font-bold text-accent-light">{value.toString().padStart(2, '0')}</span>
    <span className="text-xs sm:text-sm text-neutral-400 uppercase">{unit}</span>
  </div>
);

const CountdownWithPrice: React.FC = () => {
  const { 
    currentStageIndex, 
    currentPrice, 
    nextPrice, 
    presaleActive, 
    presaleEnded,
    setTimeLeftInStage,
    setTotalTimeLeft,
    timeLeftInStage,
    totalTimeLeft
  } = usePresaleStore();

  const currentStageData = currentStageIndex >=0 && currentStageIndex < STAGES.length ? STAGES[currentStageIndex] : null;
  
  // Countdown to the end of the current stage, or presale start/end
  let targetDateForStageCountdown: string | null = null;
  let countdownLabel = "Time until Presale Starts";

  if (presaleActive && currentStageData) {
    targetDateForStageCountdown = currentStageData.end;
    countdownLabel = `Stage ${currentStageData.index} Ends In`;
  } else if (!presaleActive && !presaleEnded) { // Before presale
    targetDateForStageCountdown = PRESALE_START_DATE;
  } else if (presaleEnded) { // After presale
    targetDateForStageCountdown = null; // No countdown needed
    countdownLabel = "Presale Has Ended";
  }
  
  const stageTime = useCountdown(targetDateForStageCountdown);
  const overallPresaleTime = useCountdown(presaleActive ? PRESALE_END_DATE : PRESALE_START_DATE);

  useEffect(() => {
    setTimeLeftInStage(stageTime);
  }, [stageTime, setTimeLeftInStage]);

  useEffect(() => {
    setTotalTimeLeft(overallPresaleTime);
  }, [overallPresaleTime, setTotalTimeLeft]);


  useEffect(() => {
    // This effect ensures the store's stage data is up-to-date.
    const interval = setInterval(() => {
      const { current, next } = findCurrentPresaleStage();
      const now = new Date();
      const isActive = now >= new Date(PRESALE_START_DATE) && now <= new Date(PRESALE_END_DATE);
      const hasEnded = now > new Date(PRESALE_END_DATE);
      usePresaleStore.getState().setCurrentStage(current, next);
      usePresaleStore.getState().setPresaleStatus(isActive, hasEnded);
    }, 5000); // Check every 5 seconds for stage changes
    return () => clearInterval(interval);
  }, []);
  

  const displayTime = presaleActive && currentStageData ? timeLeftInStage : totalTimeLeft;

  return (
    <section id="countdown" className="py-12 md:py-20 bg-neutral-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 text-secondary-light">{countdownLabel}</h2>
        {(!presaleEnded && targetDateForStageCountdown) && (
          <div className="flex justify-center my-6 md:my-8">
            <CountdownUnit value={displayTime.days} unit="Days" />
            <CountdownUnit value={displayTime.hours} unit="Hours" />
            <CountdownUnit value={displayTime.minutes} unit="Mins" />
            <CountdownUnit value={displayTime.seconds} unit="Secs" />
          </div>
        )}

        {presaleEnded && <p className="text-2xl text-accent-DEFAULT my-8">Thank you for your participation!</p>}

        {presaleActive && currentStageData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto items-center">
            <div className="bg-neutral-700/70 p-6 rounded-xl shadow-lg border border-primary-DEFAULT">
              <p className="text-sm text-neutral-400 uppercase mb-1">Current Stage</p>
              <p className="text-2xl font-bold text-white">Stage {currentStageData.index}</p>
              <p className="text-sm text-neutral-400 uppercase mt-3 mb-1">Current Price</p>
              <p className="text-3xl font-bold text-accent-light">${currentPrice.toFixed(5)}</p>
              <p className="text-xs text-neutral-500">(per $JEREMY)</p>
            </div>
            {nextPrice && (
              <div className="bg-neutral-700/50 p-6 rounded-xl shadow-lg border border-neutral-600">
                <p className="text-sm text-neutral-400 uppercase mb-1">Next Stage Price</p>
                <p className="text-3xl font-bold text-secondary-light">${nextPrice.toFixed(5)}</p>
                <p className="text-xs text-neutral-500">Starts after current stage ends</p>
              </div>
            )}
          </div>
        )}
        {!presaleActive && !presaleEnded && STAGES.length > 0 && (
             <div className="mt-8 bg-neutral-700/70 p-6 rounded-xl shadow-lg border border-primary-DEFAULT max-w-md mx-auto">
                <p className="text-sm text-neutral-400 uppercase mb-1">Presale Starting Price</p>
                <p className="text-3xl font-bold text-accent-light">${STAGES[0].price.toFixed(5)}</p>
                <p className="text-xs text-neutral-500">(per $JEREMY)</p>
            </div>
        )}
      </div>
    </section>
  );
};

export default CountdownWithPrice;
