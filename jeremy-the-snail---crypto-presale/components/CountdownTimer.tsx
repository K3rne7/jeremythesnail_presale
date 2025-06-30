import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: Date): TimeLeft | null => {
  const difference = +targetDate - +new Date();
  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return null;
};

const TimerBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-full aspect-square flex items-center justify-center bg-black/50 rounded-xl text-white shadow-inner border border-white/10">
      <span className="font-black text-3xl sm:text-4xl lg:text-5xl leading-none">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="mt-2 text-xs font-bold uppercase tracking-wider text-[#A9A9D5]">{label}</span>
  </div>
);

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  if (!timeLeft) {
    return <div className="text-center text-2xl font-bold text-red-500">Presale has ended!</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4">
      <TimerBlock value={timeLeft.days} label="Days" />
      <TimerBlock value={timeLeft.hours} label="Hours" />
      <TimerBlock value={timeLeft.minutes} label="Mins" />
      <TimerBlock value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

export default CountdownTimer;
