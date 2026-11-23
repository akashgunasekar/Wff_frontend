"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Official } from '@/types';
import { Reveal } from '@/components/ui/Reveal';
import { resolveImageUrl } from '@/lib/api';
import { decodeHtml } from '@/lib/utils';

interface OfficialsSectionProps {
  officials: Official[];
}

function OfficialPortrait({ official, index }: { official: Official; index: number }) {
  const [imgError, setImgError] = useState(false);
  const cleanName = decodeHtml(official.name || '');
  const cleanRole = decodeHtml(official.role || '');
  const cleanDesignation = decodeHtml(official.designation || '');

  const initials = cleanName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2);

  return (
    <Reveal delay={index * 150} direction="up" className="h-full">
      <div className="group flex flex-col h-full bg-[var(--surface)] rounded-xl overflow-hidden border border-[var(--border-color)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-500 hover:-translate-y-1.5 cursor-default">
        
        {/* Portrait - Top Image */}
        <div className="relative w-full aspect-[4/5] bg-[var(--navy)] overflow-hidden">
          {!imgError ? (
            <Image
              src={resolveImageUrl(official.photo) || '/assets/wff-india.png'}
              alt={cleanName}
              fill
              unoptimized
              className="object-cover object-top opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-[var(--navy)] flex flex-col items-center justify-center">
              <span className="font-heading font-light text-5xl text-[var(--gold)]/30 tracking-widest uppercase">
                {initials}
              </span>
            </div>
          )}
          {/* Subtle gradient overlay at the bottom of the image for smooth transition */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>

        {/* Info - Bottom Content */}
        <div className="flex flex-col flex-grow items-center text-center p-5 sm:p-7 md:p-8 bg-[var(--surface)] relative z-10 transition-colors">
          {/* Decorative Gold Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-1 bg-[var(--gold)] rounded-b-md transform origin-top transition-transform duration-500 group-hover:scale-x-150" />
          
          {cleanRole && (
            <span className="font-heading font-bold text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-[var(--gold)] mb-3 sm:mb-4 mt-1 sm:mt-2 bg-[var(--gold-surface)] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md border border-[var(--gold)]/20">
              {cleanRole}
            </span>
          )}
          <h3 className="font-heading font-bold text-[19px] sm:text-[22px] uppercase text-[var(--text-primary)] leading-[1.1] mb-1.5 sm:mb-2">
            {cleanName}
          </h3>
          {cleanDesignation && (
            <p className="font-body font-medium text-[var(--muted)] text-[13px] sm:text-[14px] leading-[1.5] max-w-[95%]">
              {cleanDesignation}
            </p>
          )}
        </div>
        
      </div>
    </Reveal>
  );
}

export function OfficialsSection({ officials }: OfficialsSectionProps) {
  if (!officials || officials.length === 0) {
    return null;
  }

  // Display all active officials dynamically
  const displayOfficials = officials.filter(o => o.status === 1 || o.status === undefined);

  if (displayOfficials.length === 0) {
    return null;
  }

  const gridColsClass = displayOfficials.length === 1
    ? "grid-cols-1 max-w-[420px]"
    : displayOfficials.length === 2
    ? "grid-cols-1 sm:grid-cols-2 max-w-[860px]"
    : displayOfficials.length === 4
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[var(--bg)] border-t border-[var(--border-color)] relative overflow-hidden w-full transition-colors">
      
      {/* 92% Width Container */}
      <div className="w-[92%] sm:w-[90%] max-w-[1400px] mx-auto relative z-10">
        
        {/* Centered Title block */}
        <Reveal direction="up">
          <div className="flex flex-col items-center text-center mb-10 sm:mb-14 lg:mb-16">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-px bg-[var(--gold)]" />
              <span className="font-heading font-bold text-[11px] sm:text-[13px] tracking-[2px] leading-[1.4] uppercase text-[var(--gold)]">
                Our Leadership
              </span>
              <div className="w-8 h-px bg-[var(--gold)]" />
            </div>
            <h2 className="font-heading font-extrabold text-[clamp(32px,3.5vw,48px)] uppercase leading-[1.05] tracking-tight mb-3 sm:mb-4">
              <span className="text-[var(--text-primary)]">The People Behind</span><br />
              <span className="text-[var(--gold)]">The Standard</span>
            </h2>
            <p className="font-body font-normal text-[15px] sm:text-[16px] max-w-[650px] leading-[1.6] text-[var(--muted)] tracking-normal">
              Meet the dedicated federation officials and international judges upholding the prestigious values and standards of WFF Tamil Nadu.
            </p>
          </div>
        </Reveal>

        {/* Dynamic Responsive Grid for Leadership Cards */}
        <div className={`grid ${gridColsClass} gap-6 xl:gap-8 justify-center mx-auto`}>
          {displayOfficials.map((official, i) => (
             <OfficialPortrait key={official.id} official={official} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
