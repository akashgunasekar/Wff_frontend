"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  photo: string;
  active?: boolean;
}

export default function WinnerSlider({ slides }: { slides: BannerSlide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Filter only active slides
  const activeSlides = slides.filter(s => s.active !== false);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  if (!activeSlides || activeSlides.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-wff-border dark:border-wff-gold/10 bg-wff-surface shadow-sm w-full" style={{ aspectRatio: '12/5' }}>
      {activeSlides.map((slide, index) => (
        <div 
          key={index} 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {slide.photo && (
            <img src={slide.photo} alt={`Winner Announcement Banner ${index + 1}`} className="w-full h-full object-contain bg-black" />
          )}
        </div>
      ))}
      
      {activeSlides.length > 1 && (
        <>
          <button 
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-wff-gold hover:text-black transition-colors backdrop-blur-sm"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => setCurrentIndex((prev) => (prev + 1) % activeSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-wff-gold hover:text-black transition-colors backdrop-blur-sm"
          >
            <ChevronRight size={24} />
          </button>
        
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
            {activeSlides.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors shadow-md ${idx === currentIndex ? 'bg-wff-gold' : 'bg-white/50 hover:bg-white/80'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
