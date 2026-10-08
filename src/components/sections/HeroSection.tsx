"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroSlide } from '@/types';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Dumbbell, Users, Trophy, ShieldCheck, ArrowRight } from 'lucide-react';
import { resolveImageUrl } from '@/lib/api';
import { decodeHtml } from '@/lib/utils';

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
    return resolveImageUrl(url) || '/assets/wff_hero_banner.png';
  };

  const renderTitle = (title: string) => {
    const cleanTitle = decodeHtml(title);
    const words = cleanTitle.split(' ');
    let line1 = '';
    let line2 = cleanTitle;
    let line3 = '';

    if (words.length >= 3 && cleanTitle.toUpperCase().includes('WFF')) {
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
      line2 = cleanTitle;
      line3 = '';
    }

    return (
      <h1 className="font-heading font-extrabold uppercase leading-[0.92] sm:leading-[0.88] tracking-[-0.02em] mb-4 sm:mb-6 drop-shadow-2xl flex flex-col items-start">
        {line1 && <span className="text-white text-[32px] xs:text-[40px] sm:text-[54px] lg:text-[70px] xl:text-[50px]">{line1}</span>}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] text-[40px] xs:text-[40px] sm:text-[54px] lg:text-[70px] xl:text-[50px]">{line2}</span>
        {line3 && <span className="text-white text-[32px] xs:text-[40px] sm:text-[54px] lg:text-[70px] xl:text-[50px]">{line3}</span>}
      </h1>
    );
  };

  return (
    <section className="relative w-full min-h-[500px] sm:min-h-[660px] lg:min-h-[680px] lg:h-[76vh] md:flex md:flex-col justify-between overflow-hidden bg-[#040A12]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getImageUrl(slide.image)}
          alt={decodeHtml(slide.title)}
          unoptimized={slide.image?.startsWith('/uploads')}
          fill
          priority
          className="object-cover object-center saturate-[0.8] brightness-100"
          sizes="100vw"
        />
        {/* Shadow overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-[#040A12]/95 via-[#040A12]/80 sm:via-[#040A12]/50 to-[#040A12]/40 sm:to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#040A12] via-transparent to-transparent opacity-90 sm:opacity-80"></div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-8 relative z-10 w-full md:flex-grow md:flex md:flex-col justify-center pt-6 sm:pt-16 lg:pt-20 pb-8 sm:pb-12">
        <div className="w-full max-w-[700px] flex flex-col items-start text-left">

          {/* Eyebrow */}
          {slide.subtitle && (
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-8 sm:w-10 h-[2px] bg-[#C9A44A]" />
              <span className="font-heading font-semibold text-[16px] sm:text-[11px] md:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white drop-shadow-md">
                {decodeHtml(slide.subtitle)}
              </span>
            </div>
          )}

          {/* Title */}
          {renderTitle(slide.title)}

          {/* Description */}
          {slide.description && (
            <p className="font-body text-[13.5px] sm:text-[15px] md:text-[16px] text-white/80 max-w-[500px] mb-6 sm:mb-8 leading-[1.55] sm:leading-[1.6] drop-shadow-md">
              {decodeHtml(slide.description)}
            </p>
          )}

          {/* Date & Location */}
          {(slide.date || slide.location) && (
            <div className="flex flex-col xs:flex-row items-start gap-4 sm:gap-6 mb-8 sm:mb-10 border-l-2 border-[#C9A44A]/30 pl-4 sm:pl-6">
              {slide.date && (
                <div className="flex items-center gap-3 sm:gap-4">
                  <Calendar size={20} className="text-[#C9A44A] mt-0.5 shrink-0 sm:w-6 sm:h-6" strokeWidth={1.5} />
                  <div className="flex flex-col">
                    <span className="font-heading font-bold text-white tracking-[0.1em] leading-tight uppercase text-[15px] sm:text-[14px]">
                      {slide.date.split(' ').slice(0, 3).join(' ')}
                    </span>
                    <span className="font-heading font-medium text-white/50 tracking-[0.1em] text-[14px] sm:text-[11px] uppercase mt-0.5">
                      {slide.date.split(' ').slice(3).join(' ')}
                    </span>
                  </div>
                </div>
              )}
              {slide.location && (
                <div className="flex items-center gap-3 sm:gap-4">
                  <MapPin size={20} className="text-[#C9A44A] mt-0.5 shrink-0 sm:w-6 sm:h-6" strokeWidth={1.5} />
                  <div className="font-heading font-bold text-white tracking-[0.08em] leading-[1.3] uppercase text-[14px] sm:text-[16px] opacity-80">
                    {decodeHtml(slide.location)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href={slide.event_id ? `/register?eventId=${slide.event_id}` : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 sm:h-14 px-6 sm:px-10 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-bold text-[12.5px] sm:text-[14px] tracking-[0.15em] uppercase hover:brightness-110 transition-all duration-300 shadow-[0_4px_20px_rgba(198,161,91,0.25)] rounded-sm"
            >
              Register Now
              <ArrowRight size={16} strokeWidth={2} className="ml-2 sm:ml-3 sm:w-[18px] sm:h-[18px]" />
            </Link>

            <Link
              href="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 sm:h-14 px-6 sm:px-10 border border-white/30 text-white font-heading font-bold text-[12.5px] sm:text-[14px] tracking-[0.15em] uppercase hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 rounded-sm"
            >
              Explore Events
              <ArrowRight size={16} strokeWidth={2} className="ml-2 sm:ml-3 opacity-60 sm:w-[18px] sm:h-[18px]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Features Bar */}
      <div className="relative w-full z-20 pb-6 sm:pb-8 pt-4">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-start gap-4 sm:gap-10 lg:gap-16 pt-4 border-t border-white/10 sm:border-none">
            <div className="flex items-center sm:items-center gap-2.5 sm:gap-3">
              <Dumbbell size={20} className="text-[#C9A44A] shrink-0 sm:w-6 sm:h-6" strokeWidth={1.5} />
              <span className="font-heading font-bold text-[13px] sm:text-[16px] tracking-[0.12em] sm:tracking-[0.15em] uppercase text-white/90 leading-[1.25]">
                Natural Athletes
              </span>
            </div>
            <div className="flex items-center sm:items-center gap-2.5 sm:gap-3">
              <Users size={20} className="text-[#C9A44A] shrink-0 sm:w-6 sm:h-6" strokeWidth={1.5} />
              <span className="font-heading font-bold text-[13px] sm:text-[16px] tracking-[0.12em] sm:tracking-[0.15em] uppercase text-white/90 leading-[1.25]">
                Real People
              </span>
            </div>
            <div className="flex items-center sm:items-center gap-2.5 sm:gap-3">
              <Trophy size={20} className="text-[#C9A44A] shrink-0 sm:w-6 sm:h-6" strokeWidth={1.5} />
              <span className="font-heading font-bold text-[13px] sm:text-[16px] tracking-[0.12em] sm:tracking-[0.15em] uppercase text-white/90 leading-[1.25]">
                Clean Competition
              </span>
            </div>
            <div className="flex items-center sm:items-center gap-2.5 sm:gap-3">
              <ShieldCheck size={20} className="text-[#C9A44A] shrink-0 sm:w-6 sm:h-6" strokeWidth={1.5} />
              <span className="font-heading font-bold text-[13px] sm:text-[16px] tracking-[0.12em] sm:tracking-[0.15em] uppercase text-white/90 leading-[1.25]">
                A Stronger Tomorrow
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      {slides.length > 1 && (
        <div className="absolute right-3 sm:right-0 bottom-3 sm:bottom-0 z-30 flex items-center">
          <div className="font-heading font-bold tracking-[0.2em] text-[12px] sm:text-[13px] hidden md:block mr-6 lg:mr-8">
            <span className="text-white">{String(current + 1).padStart(2, '0')}</span>
            <span className="text-white/30 mx-2">/</span>
            <span className="text-white/50">{String(slides.length).padStart(2, '0')}</span>
          </div>
          <div className="flex rounded-sm sm:rounded-none overflow-hidden shadow-lg sm:shadow-none">
            <button
              onClick={prev}
              className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center bg-[#040A12]/90 backdrop-blur-md border border-white/10 sm:border-t sm:border-l sm:border-b-0 sm:border-r-0 text-white/70 hover:bg-[#C9A44A] hover:text-[#040A12] active:scale-95 transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} className="sm:w-6 sm:h-6" strokeWidth={1.5} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center bg-[#040A12]/90 backdrop-blur-md border border-white/10 sm:border-t sm:border-l sm:border-b-0 sm:border-r-0 text-white/70 hover:bg-[#C9A44A] hover:text-[#040A12] active:scale-95 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight size={18} className="sm:w-6 sm:h-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
