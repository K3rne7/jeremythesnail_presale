
import { useState, useEffect, useCallback } from 'react';
import { CountdownValues } from '../types';

const calculateTimeLeft = (targetDate: Date | string): CountdownValues | null => {
  const difference = new Date(targetDate).getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds };
};

const useCountdown = (targetDate: Date | string | null): CountdownValues => {
  const [timeLeft, setTimeLeft] = useState<CountdownValues>(() => 
    targetDate ? calculateTimeLeft(targetDate) || { days: 0, hours: 0, minutes: 0, seconds: 0 } : { days: 0, hours: 0, minutes: 0, seconds: 0 }
  );

  const updateCountdown = useCallback(() => {
    if (!targetDate) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    const newTimeLeft = calculateTimeLeft(targetDate);
    if (newTimeLeft) {
      setTimeLeft(newTimeLeft);
    } else {
       setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  }, [targetDate]);

  useEffect(() => {
    updateCountdown(); // Initial call
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [updateCountdown]);

  return timeLeft;
};

export default useCountdown;
