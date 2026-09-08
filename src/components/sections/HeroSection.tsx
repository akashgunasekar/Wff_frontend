"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroSlide } from '@/types';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Dumbbell, Users, Trophy, ShieldCheck, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface HeroSectionProps {
  slides: HeroSlide[];
}

export function HeroSection({ slides }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const slide = slides[current] || slides[0];

  const next = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (!slide) return null;
  
  const getImageUrl = (url: string | null) => {
    if (!url) return '/assets/wff_hero_banner.png';
    return url;
  };

  const renderTitle = (title: string) => {
    const words = title.split(' ');
    let line1 = '';
    let line2 = title;
    let line3 = '';
    
    if (words.length >= 3 && title.toUpperCase().includes('WFF')) {
      line1 = words[0];
      const lastWord = words[words.length - 1];
      if (/\d{4}/.test(lastWord)) {
        line3 = lastWord;
        line2 = words.slice(1, words.length - 1).join(' ');
      } else {
        line2 = words.slice(1).join(' ');
      }
    } else {
      line1 = '';
      line2 = title;
      line3 = '';
    }

    return (
      <h1 className="font-heading font-extrabold uppercase leading-[0.88] tracking-[-0.02em] mb-6 drop-shadow-2xl flex flex-col items-start">
        {line1 && <span className="text-white text-[46px] sm:text-[60px] lg:text-[76px] xl:text-[92px]">{line1}</span>}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] text-[46px] sm:text-[60px] lg:text-[76px] xl:text-[92px]">{line2}</span>
        {line3 && <span className="text-white text-[46px] sm:text-[60px] lg:text-[76px] xl:text-[92px]">{line3}</span>}
      </h1>
    );
  };

  return (
    <section className="relative w-full h-[72vh] min-h-[560px] xl:min-h-[680px] flex items-center overflow-hidden bg-[#040A12]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getImageUrl(slide.image)}
          alt={slide.title}
          unoptimized={slide.image?.startsWith('/uploads')}
          fill
          priority
          className="object-cover object-center saturate-[0.8] brightness-100"
          sizes="100vw"
        />
        {/* Shadow overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#040A12]/90 via-[#040A12]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#040A12] via-transparent to-transparent opacity-80"></div>
      </div>



      <div className="max-w-[1440px] mx-auto px-6 md:px-8 relative z-10 w-full h-full flex flex-col justify-center pt-20 pb-32">
        <div className="w-full max-w-[700px] flex flex-col items-start text-left">
          
          {/* Eyebrow */}
          {slide.subtitle && (
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-[2px] bg-[#C9A44A]" />
              <span className="font-heading font-semibold text-[11px] md:text-xs tracking-[0.25em] uppercase text-white drop-shadow-md">
                {slide.subtitle}
              </span>
            </div>
          )}

          {/* Title */}
          {renderTitle(slide.title)}

          {/* Description */}
          {slide.description && (
            <p className="font-body text-[15px] md:text-[16px] text-white/80 max-w-[500px] mb-10 leading-[1.6] drop-shadow-md">
              {slide.description}
            </p>
          )}

          {/* Date & Location */}
          <div className="flex flex-col sm:flex-row items-start gap-8 sm:gap-12 mb-12 border-l-2 border-[#C9A44A]/30 pl-6">
            {slide.date && (
              <div className="flex items-start gap-4">
                <Calendar size={24} className="text-[#C9A44A] mt-0.5 shrink-0" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-white tracking-[0.1em] leading-tight uppercase text-[14px]">
                    {slide.date.split(' ').slice(0, 3).join(' ')}
                  </span>
                  <span className="font-heading font-medium text-white/50 tracking-[0.1em] text-[11px] uppercase mt-1">
                    {slide.date.split(' ').slice(3).join(' ')}
                  </span>
                </div>
              </div>
            )}
            {slide.location && (
              <div className="flex items-start gap-4">
                <MapPin size={24} className="text-[#C9A44A] mt-0.5 shrink-0" strokeWidth={1.5} />
                <div className="font-heading font-bold text-white tracking-[0.08em] leading-[1.4] uppercase max-w-[250px] text-[11px] md:text-[12px] opacity-80">
                  {slide.location}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href={slide.event_id ? `/register?eventId=${slide.event_id}` : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-10 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-bold text-[14px] tracking-[0.15em] uppercase hover:brightness-110 transition-all duration-300 shadow-[0_4px_20px_rgba(198,161,91,0.25)]"
            >
              Register Now
              <ArrowRight size={18} strokeWidth={2} className="ml-3" />
            </Link>
            
            <Link
              href="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-10 border border-white/30 text-white font-heading font-bold text-[14px] tracking-[0.15em] uppercase hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
            >
              Explore Events
              <ArrowRight size={18} strokeWidth={2} className="ml-3 opacity-60" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Features Bar */}
      <div className="absolute bottom-8 left-0 w-full z-20 pointer-events-none">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8">
          <div className="flex flex-wrap items-start gap-8 sm:gap-12 lg:gap-16">
            <div className="flex flex-col items-start gap-3">
              <Dumbbell size={24} className="text-[#C9A44A]" strokeWidth={1.5} />
              <span className="font-heading font-bold text-[10px] tracking-[0.15em] uppercase text-white/90 leading-[1.3]">
                Natural<br/>Athletes
              </span>
            </div>
            <div className="flex flex-col items-start gap-3">
              <Users size={24} className="text-[#C9A44A]" strokeWidth={1.5} />
              <span className="font-heading font-bold text-[10px] tracking-[0.15em] uppercase text-white/90 leading-[1.3]">
                Real<br/>- People
              </span>
            </div>
            <div className="flex flex-col items-start gap-3">
              <Trophy size={24} className="text-[#C9A44A]" strokeWidth={1.5} />
              <span className="font-heading font-bold text-[10px] tracking-[0.15em] uppercase text-white/90 leading-[1.3]">
                Clean<br/>Competition
              </span>
            </div>
            <div className="flex flex-col items-start gap-3">
              <ShieldCheck size={24} className="text-[#C9A44A]" strokeWidth={1.5} />
              <span className="font-heading font-bold text-[10px] tracking-[0.15em] uppercase text-white/90 leading-[1.3]">
                A Stronger<br/>Tomorrow
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      {slides.length > 1 && (
        <div className="absolute right-0 bottom-0 z-30 flex items-center">
          <div className="font-heading font-bold tracking-[0.2em] text-[13px] hidden sm:block mr-8">
             <span className="text-white">{String(current + 1).padStart(2, '0')}</span> 
             <span className="text-white/30 mx-2">/</span> 
             <span className="text-white/50">{String(slides.length).padStart(2, '0')}</span>
          </div>
          <div className="flex">
            <button 
              onClick={prev} 
              className="w-16 h-16 flex items-center justify-center bg-[#040A12]/90 backdrop-blur-md border-t border-l border-white/5 text-white/70 hover:bg-[#C9A44A] hover:text-[#040A12] transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
            <button 
              onClick={next} 
              className="w-16 h-16 flex items-center justify-center bg-[#040A12]/90 backdrop-blur-md border-t border-l border-white/5 text-white/70 hover:bg-[#C9A44A] hover:text-[#040A12] transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
