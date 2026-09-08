"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface EventActionBoxProps {
  eventId: number;
  targetDateStr: string;
  venue: string;
  isClosed: boolean;
}

export default function EventActionBox({ eventId, targetDateStr, venue, isClosed }: EventActionBoxProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const targetDate = new Date(targetDateStr).getTime();
    
    if (isNaN(targetDate)) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsPassed(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return true;
      } else {
        setIsPassed(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
        return false;
      }
    };

    calculateTimeLeft();
    const interval = setInterval(() => {
      if (calculateTimeLeft()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (!isMounted) return null;

  const dateObj = new Date(targetDateStr);
  const isValidDate = !isNaN(dateObj.getTime());
  
  const monthName = isValidDate ? dateObj.toLocaleString('default', { month: 'long' }).toUpperCase() : '';
  const dayName = isValidDate ? dateObj.getDate().toString().padStart(2, '0') : '';
  const yearName = isValidDate ? dateObj.getFullYear() : '';
  
  // Format standard date: 20 September 2026
  const standardDate = isValidDate ? `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'long' })} ${dateObj.getFullYear()}` : targetDateStr;

  return (
    <div className="bg-white rounded-md shadow-[0_15px_40px_rgba(0,0,0,0.2)] overflow-hidden relative border border-black/5">
      {/* Glow bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#C9A44A] z-10"></div>
      
      {/* Countdown Section */}
      <div className="p-6 text-center bg-[#040A12]">
        <h3 className="font-heading text-[10px] text-wff-muted uppercase tracking-[0.2em] mb-4">Event Countdown</h3>
        
        {!isPassed && isValidDate ? (
          <>
            <div className="text-[#C9A44A] font-bold uppercase tracking-widest text-xs mb-1">{monthName}</div>
            <div className="font-heading text-6xl text-white my-1 leading-none font-bold tracking-tight">{dayName}</div>
            <div className="text-wff-muted font-bold tracking-[0.2em] text-[10px] mb-5">{yearName}</div>
            
            <div className="grid grid-cols-4 gap-2.5 px-2">
              <div className="bg-white rounded p-2 flex flex-col justify-center h-[75px] shadow-sm">
                <div className="font-heading text-xl text-wff-deep-navy tracking-wider leading-none mb-0.5 font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
                <div className="text-[9px] text-[#C9A44A] uppercase tracking-[0.15em] font-bold mt-auto pb-0.5">Days</div>
              </div>
              <div className="bg-white rounded p-2 flex flex-col justify-center h-[75px] shadow-sm">
                <div className="font-heading text-xl text-wff-deep-navy tracking-wider leading-none mb-0.5 font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[9px] text-[#C9A44A] uppercase tracking-[0.15em] font-bold mt-auto pb-0.5">Hrs</div>
              </div>
              <div className="bg-white rounded p-2 flex flex-col justify-center h-[75px] shadow-sm">
                <div className="font-heading text-xl text-wff-deep-navy tracking-wider leading-none mb-0.5 font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-[9px] text-[#C9A44A] uppercase tracking-[0.15em] font-bold mt-auto pb-0.5">Min</div>
              </div>
              <div className="bg-white rounded p-2 flex flex-col justify-center h-[75px] shadow-sm">
                <div className="font-heading text-xl text-wff-deep-navy tracking-wider leading-none mb-0.5 font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-[9px] text-[#C9A44A] uppercase tracking-[0.15em] font-bold mt-auto pb-0.5">Sec</div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-6">
            <div className="text-[#C9A44A] font-bold uppercase tracking-widest text-lg">EVENT DAY</div>
          </div>
        )}
      </div>
      
      {/* Event Info Section */}
      <div className="p-6 space-y-5 bg-white">
        <div>
          <p className="text-[10px] font-bold text-[#C9A44A] tracking-widest uppercase mb-1.5">Event Date</p>
          <p className="font-heading font-bold text-wff-deep-navy text-[14px] tracking-widest uppercase">{standardDate}</p>
        </div>
        
        {venue && (
          <div>
            <p className="text-[10px] font-bold text-[#C9A44A] tracking-widest uppercase mb-1.5">Venue</p>
            <p className="font-heading font-bold text-wff-deep-navy text-[13px] uppercase tracking-widest leading-[1.6]">{venue}</p>
          </div>
        )}
      </div>
      
      {/* Register Section */}
      <div className="p-6 bg-[#F4F5F7] border-t border-black/5">
        {isClosed ? (
          <button 
            disabled
            className="w-full h-12 bg-gray-200 text-gray-500 text-[12px] uppercase tracking-[0.15em] font-bold rounded-md cursor-not-allowed"
          >
            Registration Closed
          </button>
        ) : (
          <>
            <Link href={`/register?eventId=${eventId}`} className="block w-full">
              <button className="w-full h-12 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] text-[14px] uppercase tracking-[0.1em] font-bold rounded shadow-[0_6px_15px_rgba(198,161,91,0.25)] hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300">
                Register Now
              </button>
            </Link>
            <p className="text-center text-[9px] text-[#040A12]/50 mt-3 font-bold uppercase tracking-[0.2em]">
              Secure your spot on stage
            </p>
          </>
        )}
      </div>
    </div>
  );
}
