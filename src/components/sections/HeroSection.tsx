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
    const cleanTitle = decodeHtml(title).trim();
    const upper = cleanTitle.toUpperCase();
    let line1 = '';
    let line2 = '';

    if (upper.includes('SOUTH INDIA')) {
      const idx = upper.indexOf('SOUTH INDIA');
      const rest = cleanTitle.slice(idx + 11).trim();
      line1 = 'SOUTH INDIA';
      line2 = rest || 'NATURAL LEAGUE 2027';
    } else if (upper.includes('INDIA NATURAL')) {
      const idx = upper.indexOf('INDIA NATURAL');
      const rest = cleanTitle.slice(idx + 13).trim();
      line1 = 'INDIA NATURAL';
      line2 = rest || '2027';
    } else if (upper.includes('NATURAL LEAGUE') && (upper.includes('TAMIL NADU') || upper.includes('CHAMPIONSHIP'))) {
      const splitTarget = upper.includes('TAMIL NADU') ? 'TAMIL NADU' : 'CHAMPIONSHIP';
      const splitIdx = upper.indexOf(splitTarget);
      line1 = cleanTitle.slice(0, splitIdx).trim();
      line2 = cleanTitle.slice(splitIdx).trim();
    } else {
      const words = cleanTitle.split(/\s+/);
      if (words.length > 2) {
        const mid = Math.ceil(words.length / 2);
        line1 = words.slice(0, mid).join(' ');
        line2 = words.slice(mid).join(' ');
      } else if (words.length === 2) {
        line1 = words[0];
        line2 = words[1];
      } else {
        line1 = cleanTitle;
        line2 = '';
      }
    }

    return (
      <h1 className="font-heading font-black uppercase leading-[0.92] tracking-[-1px] mb-3 sm:mb-4 drop-shadow-2xl flex flex-col items-start">
        {line1 && (
          <span className="text-[clamp(34px,4.8vw,74px)] leading-[0.92] tracking-[-1px]">
            {line1.toUpperCase().startsWith('WFF ') ? (
              <>
                <span className="text-white">WFF </span>
                <span className="text-[#FCF6BA]">{line1.slice(4)}</span>
              </>
            ) : (
              <span className="text-white">{line1}</span>
            )}
          </span>
        )}
        {line2 && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] text-[clamp(36px,5.2vw,80px)] leading-[0.92] tracking-[-1px]">
            {line2}
          </span>
        )}
      </h1>
    );
  };

  // Live countdown timer in Asia/Kolkata (IST = UTC+5:30)
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number; isPassed: boolean }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false
  });

  useEffect(() => {
    const targetDateStr = slide.event_date ? `${slide.event_date}T08:00:00+05:30` : '2027-01-10T08:00:00+05:30';
    const eventTargetDate = new Date(targetDateStr).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = eventTargetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [slide.event_date]);

  return (
    <section className="relative w-full min-h-[520px] sm:min-h-[640px] lg:min-h-[700px] lg:h-[82vh] flex flex-col justify-between overflow-hidden bg-[#040A12]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getImageUrl(slide.image)}
          alt={decodeHtml(slide.title)}
          unoptimized={slide.image?.startsWith('/uploads')}
          fill
          priority
          className="object-cover object-center saturate-[0.85] brightness-95"
          sizes="100vw"
        />
        {/* Shadow overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-[#040A12]/95 via-[#040A12]/85 sm:via-[#040A12]/60 to-[#040A12]/40 sm:to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#040A12] via-transparent to-transparent opacity-95 sm:opacity-80"></div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 w-full flex-grow flex flex-col justify-center pt-8 sm:pt-14 lg:pt-16 pb-8 sm:pb-10">
        <div className="w-full max-w-[760px] flex flex-col items-start text-left">

          {/* Eyebrow */}
          {slide.subtitle && (
            <div className="flex items-center gap-3 sm:gap-4 mb-2.5 sm:mb-3">
              <div className="w-8 sm:w-10 h-[2px] bg-[#C9A44A]" />
              <span className="font-heading font-bold text-[11px] sm:text-[13px] tracking-[2px] leading-[1.4] uppercase text-[#FCF6BA] drop-shadow-md">
                {decodeHtml(slide.subtitle)}
              </span>
            </div>
          )}

          {/* Title */}
          {renderTitle(slide.title)}

          {/* Federation Notice */}
          <div className="flex items-center gap-2 mb-3 text-xs sm:text-[13px] font-heading font-semibold uppercase tracking-[1.5px] text-[#FCF6BA]/90">
            <span className="w-2 h-2 rounded-full bg-[#C9A44A] inline-block"></span>
            <span>World Fitness Federation Tamil Nadu</span>
          </div>

          {/* Description */}
          {slide.description && (
            <p className="font-body font-normal text-[14.5px] sm:text-[15.5px] text-white/85 max-w-[650px] mb-5 sm:mb-6 leading-[1.6] tracking-normal drop-shadow-md">
              {decodeHtml(slide.description)}
            </p>
          )}

          {/* Date & Location */}
          {(slide.date || slide.location) && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-6 mb-6 sm:mb-7 border-l-2 border-[#C9A44A]/40 pl-4 sm:pl-6">
              {slide.date && (
                <div className="flex items-center gap-2.5 sm:gap-3 whitespace-nowrap shrink-0">
                  <Calendar size={18} className="text-[#C9A44A] shrink-0 sm:w-5 sm:h-5" strokeWidth={1.8} />
                  <span className="font-body font-bold text-white tracking-normal text-[14px] sm:text-[16px] whitespace-nowrap">
                    {decodeHtml(slide.date)}
                  </span>
                  {slide.date_type === 'multi' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-heading font-extrabold uppercase bg-[var(--gold)]/20 text-[#FCF6BA] border border-[var(--gold)]/40 tracking-[1px] whitespace-nowrap shrink-0">
                      Multi-Day
                    </span>
                  )}
                </div>
              )}
              {slide.location && (
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <MapPin size={18} className="text-[#C9A44A] shrink-0 sm:w-5 sm:h-5" strokeWidth={1.8} />
                  <div className="font-body font-medium text-white/90 tracking-normal leading-[1.5] text-[13.5px] sm:text-[14px]">
                    {decodeHtml(slide.location)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Live Countdown Timer (Asia/Kolkata) */}
          <div className="mb-7 sm:mb-8 w-full max-w-[500px]">
            <div className="text-[11px] font-heading font-bold uppercase tracking-[2px] text-[#FCF6BA] mb-2 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A44A] animate-pulse"></span>
              <span>Championship Countdown ({slide.date || 'Upcoming Championship'})</span>
            </div>
            {timeLeft.isPassed ? (
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-[#C9A44A]/20 border border-[#C9A44A]/40 text-[#FCF6BA] font-heading font-bold text-sm uppercase tracking-[1px]">
                Championship Concluded
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map((unit, idx) => (
                  <div key={idx} className="bg-[#071A2E]/80 backdrop-blur-md border border-[#C9A44A]/30 rounded-lg p-2 sm:p-2.5 text-center shadow-lg">
                    <span className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-white block leading-tight">
                      {String(unit.value).padStart(2, '0')}
                    </span>
                    <span className="font-heading text-[10px] sm:text-[11px] text-[#FCF6BA] uppercase tracking-[1px] font-semibold">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {(slide.event_status === 'open' || (!slide.event_status && slide.event_id === 11)) ? (
              <>
                <Link
                  href={slide.event_id ? `/register?eventId=${slide.event_id}` : "/register?eventId=11"}
                  className="w-full sm:w-auto inline-flex items-center justify-center h-12 sm:h-14 px-7 sm:px-10 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-[13px] sm:text-[15px] tracking-[1px] uppercase hover:brightness-110 active:scale-[0.99] transition-all duration-300 shadow-[0_4px_20px_rgba(198,161,91,0.25)] rounded-lg min-h-[48px]"
                >
                  REGISTER NOW
                  <ArrowRight size={16} strokeWidth={2.2} className="ml-2.5 sm:w-[18px] sm:h-[18px]" />
                </Link>

                <Link
                  href={slide.slug ? `/events/${slide.slug}` : slide.event_id === 11 ? "/events/south-india-natural-league-2027" : "/events"}
                  className="w-full sm:w-auto inline-flex items-center justify-center h-12 sm:h-14 px-7 sm:px-10 border border-white/30 text-white font-heading font-extrabold text-[13px] sm:text-[15px] tracking-[1px] uppercase hover:bg-white/10 hover:border-white/50 active:scale-[0.99] backdrop-blur-sm transition-all duration-300 rounded-lg min-h-[48px]"
                >
                  EXPLORE EVENT
                  <ArrowRight size={16} strokeWidth={2} className="ml-2.5 opacity-60 sm:w-[18px] sm:h-[18px]" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={slide.slug ? `/events/${slide.slug}` : "/events"}
                  className="w-full sm:w-auto inline-flex items-center justify-center h-12 sm:h-14 px-7 sm:px-10 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-[13px] sm:text-[15px] tracking-[1px] uppercase hover:brightness-110 active:scale-[0.99] transition-all duration-300 shadow-[0_4px_20px_rgba(198,161,91,0.25)] rounded-lg min-h-[48px]"
                >
                  EXPLORE CHAMPIONSHIP
                  <ArrowRight size={16} strokeWidth={2.2} className="ml-2.5 sm:w-[18px] sm:h-[18px]" />
                </Link>

                <div
                  className="w-full sm:w-auto inline-flex items-center justify-center h-12 sm:h-14 px-6 sm:px-8 border border-[#C9A44A]/40 bg-[#C9A44A]/10 text-[#FCF6BA] font-heading font-extrabold text-[12px] sm:text-[14px] tracking-[1.5px] uppercase rounded-lg select-none min-h-[48px]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#C9A44A] mr-2.5 animate-pulse" />
                  REGISTRATION OPENS SOON
                </div>
              </>
            )}
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
