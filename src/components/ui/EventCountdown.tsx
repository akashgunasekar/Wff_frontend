"use client";

import { useEffect, useState } from 'react';

export default function EventCountdown({ targetDateStr }: { targetDateStr: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Parse targetDateStr to get timestamp
    // If it's something like "20-May-2026", Date.parse might need valid formats.
    const targetDate = new Date(targetDateStr).getTime();
    
    if (isNaN(targetDate)) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return true; // Reached zero
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
        return false;
      }
    };

    calculateTimeLeft(); // initial calc
    const interval = setInterval(() => {
      if (calculateTimeLeft()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (!isMounted) return null; // Avoid hydration mismatch

  const dateObj = new Date(targetDateStr);
  const isValidDate = !isNaN(dateObj.getTime());
  
  const monthName = isValidDate ? dateObj.toLocaleString('default', { month: 'long' }).toUpperCase() : '';
  const dayName = isValidDate ? dateObj.getDate().toString().padStart(2, '0') : '';
  const yearName = isValidDate ? dateObj.getFullYear() : '';

  return (
    <div className="bg-wff-deep-navy border border-wff-gold/20 rounded-2xl shadow-xl overflow-hidden relative p-6">
      {/* Glow bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient z-10"></div>
      
      <div className="text-center mb-6 border-b border-white/10 pb-4">
        <h3 className="font-heading text-sm text-white uppercase tracking-[0.2em] mb-4">Event Countdown</h3>
        
        {isValidDate && (
          <>
            <div className="text-wff-gold font-bold uppercase tracking-widest text-xs">{monthName}</div>
            <div className="font-heading text-4xl text-white my-1">{dayName}</div>
            <div className="text-wff-muted font-bold tracking-widest text-xs">{yearName}</div>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#030810] border border-white/5 rounded-sm p-4 text-center shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="font-heading text-3xl text-white tracking-wider">{String(timeLeft.days).padStart(2, '0')}</div>
          <div className="text-[10px] text-wff-gold uppercase tracking-widest mt-1 font-bold">Days</div>
        </div>
        <div className="bg-[#030810] border border-white/5 rounded-sm p-4 text-center shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="font-heading text-3xl text-white tracking-wider">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-[10px] text-wff-gold uppercase tracking-widest mt-1 font-bold">Hrs</div>
        </div>
        <div className="bg-[#030810] border border-white/5 rounded-sm p-4 text-center shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="font-heading text-3xl text-white tracking-wider">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-[10px] text-wff-gold uppercase tracking-widest mt-1 font-bold">Min</div>
        </div>
        <div className="bg-[#030810] border border-white/5 rounded-sm p-4 text-center shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="font-heading text-3xl text-white tracking-wider">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-[10px] text-wff-gold uppercase tracking-widest mt-1 font-bold">Sec</div>
        </div>
      </div>
    </div>
  );
}
