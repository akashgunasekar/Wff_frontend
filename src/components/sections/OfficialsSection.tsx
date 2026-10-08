"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Official } from '@/types';
import { Reveal } from '@/components/ui/Reveal';
import { resolveImageUrl } from '@/lib/api';

interface OfficialsSectionProps {
  officials: Official[];
}

function OfficialPortrait({ official, index }: { official: Official; index: number }) {
  const [imgError, setImgError] = useState(false);
  const initials = official.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <Reveal delay={index * 150} direction="up" className="h-full">
      <div className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(201,164,74,0.15)] transition-all duration-500 hover:-translate-y-1.5 cursor-default">
        
        {/* Portrait - Top Image */}
        <div className="relative w-full aspect-[4/5] bg-wff-navy overflow-hidden">
          {!imgError ? (
            <Image
              src={resolveImageUrl(official.photo) || '/assets/wff-india.png'}
              alt={official.name}
              fill
              className="object-cover object-top opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-wff-deep-navy flex flex-col items-center justify-center">
              <span className="font-heading font-light text-5xl text-wff-gold/20 tracking-widest uppercase">
                {initials}
              </span>
            </div>
          )}
          {/* Subtle gradient overlay at the bottom of the image for smooth transition */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>

        {/* Info - Bottom Content */}
        <div className="flex flex-col flex-grow items-center text-center p-5 sm:p-7 md:p-8 bg-white relative z-10">
          {/* Decorative Gold Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-1 bg-[#C9A44A] rounded-b-md transform origin-top transition-transform duration-500 group-hover:scale-x-150" />
          
          <span className="font-heading font-bold text-[8.5px] sm:text-[9px] xl:text-[10px] tracking-[0.2em] uppercase text-[#C9A44A] mb-3 sm:mb-4 mt-1 sm:mt-2 bg-[#FDF8E7] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-sm">
            {official.role}
          </span>
          <h3 className="font-heading font-extrabold text-[19px] sm:text-[22px] xl:text-[24px] uppercase text-[#040A12] leading-[1.1] mb-1.5 sm:mb-2">
            {official.name}
          </h3>
          <p className="font-heading font-semibold text-[#040A12]/50 text-[10.5px] sm:text-[11px] xl:text-[12px] uppercase tracking-[0.12em] sm:tracking-[0.15em] leading-[1.5] max-w-[95%]">
            {official.designation}
          </p>
        </div>
        
      </div>
    </Reveal>
  );
}

export function OfficialsSection({ officials }: OfficialsSectionProps) {
  if (!officials || officials.length === 0) {
    return null;
  }

  const displayOfficials = officials.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#F9F9F9] relative overflow-hidden w-full">
      
      {/* 92% Width Container */}
      <div className="w-[92%] sm:w-[90%] max-w-[1400px] mx-auto relative z-10">
        
        {/* Centered Title block */}
        <Reveal direction="up">
          <div className="flex flex-col items-center text-center mb-10 sm:mb-14 lg:mb-16">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-px bg-[#C9A44A]" />
              <span className="font-heading font-semibold text-[11px] sm:text-[12px] tracking-[0.2em] uppercase text-[#C9A44A]">
                Our Team
              </span>
              <div className="w-8 h-px bg-[#C9A44A]" />
            </div>
            <h2 className="font-heading font-bold text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[52px] uppercase leading-[1.05] tracking-tight mb-3 sm:mb-4">
              <span className="text-wff-deep-navy">The People Behind</span><br />
              <span className="text-[#C9A44A]">The Standard</span>
            </h2>
            <p className="font-body text-wff-muted text-[13.5px] sm:text-[14px] lg:text-[15px] max-w-[500px] leading-[1.6]">
              Meet the dedicated individuals who work tirelessly to uphold the values and standards of WFF Tamil Nadu.
            </p>
          </div>
        </Reveal>

        {/* 3 Column Grid for Horizontal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 justify-center">
          {displayOfficials.map((official, i) => (
             <OfficialPortrait key={official.id} official={official} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
