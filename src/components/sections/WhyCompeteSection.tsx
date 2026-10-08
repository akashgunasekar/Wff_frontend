"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Trophy, Target, ShieldCheck, User, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WhyCompeteSection() {
  const standards = [
    {
      num: '01',
      title: 'COMPETITION',
      desc: 'A serious platform for athletes. We provide an environment where hard work meets fair judgment, ensuring that true dedication is always rewarded.',
      icon: Trophy
    },
    {
      num: '02',
      title: 'DISCIPLINE',
      desc: 'Built around preparation and performance. The WFF standard requires unwavering commitment, and our stages are built to showcase exactly that.',
      icon: Target
    },
    {
      num: '03',
      title: 'INTEGRITY',
      desc: 'Competition conducted with clear, uncompromising standards. Our judging criteria are transparent, prioritizing athletic excellence over subjective biases.',
      icon: ShieldCheck
    },
    {
      num: '04',
      title: 'ATHLETE FOCUS',
      desc: 'Designed around the competitor experience. From backstage logistics to stage lighting, every detail is engineered to make athletes look and feel their absolute best.',
      icon: User
    }
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-32 bg-[#F7F5F0] text-wff-text-primary relative overflow-hidden flex flex-col justify-center min-h-[auto] lg:min-h-[720px] w-full">

      {/* ════════════════════════════════════════════════════════════
          BACKGROUND LAYERS
          ════════════════════════════════════════════════════════════ */}

      {/* Layer 2: Subtle texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("/assets/hero-pattern.png")' }}></div>

      {/* Layer 3: Oversized WFF watermark spanning 100% width */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-[28vw] sm:text-[32vw] font-heading font-extrabold text-[#EAE6DA] opacity-40 sm:opacity-50 leading-none select-none pointer-events-none whitespace-nowrap z-0">
        WFF
      </div>

      {/* ════════════════════════════════════════════════════════════
          CONTENT COMPOSITION - 3 COLUMN LAYOUT
          ════════════════════════════════════════════════════════════ */}
      <Container className="max-w-[1536px] w-full relative z-10 px-5 sm:px-6 md:px-8">

        {/* TOP CONTENT: Centered Heading & Subheading */}
        <div className="flex flex-col items-center text-center justify-center mb-10 sm:mb-16 xl:mb-20">
          <Reveal direction="up">
            <div className="flex flex-col items-center">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-8 sm:w-10 h-px bg-wff-gold" />
                <span className="font-heading font-semibold text-[11px] sm:text-[13px] tracking-[0.18em] uppercase text-wff-gold">
                  Our Standards
                </span>
                <div className="w-8 sm:w-10 h-px bg-wff-gold" />
              </div>

              {/* Main Statement */}
              <h2 className="font-heading font-bold text-[30px] xs:text-[36px] sm:text-[46px] md:text-[56px] xl:text-[68px] uppercase leading-[0.95] sm:leading-[0.9] tracking-tight mb-4 sm:mb-6 text-wff-deep-navy">
                The Standard<br className="md:hidden" />
                <span className="text-wff-gold md:ml-4">Behind </span>
                <span className="text-wff-deep-navy md:ml-4">The Stage.</span>
              </h2>

              {/* Supporting Copy */}
              <p className="font-body text-[13.5px] sm:text-[15px] xl:text-[16px] leading-[1.6] sm:leading-[1.65] max-w-[600px] text-wff-muted mb-4 sm:mb-8">
                More than a competition. A commitment to fairness, discipline and athlete excellence. The WFF standard ensures that every athlete gets the stage they deserve.
              </p>
            </div>
          </Reveal>
        </div>

        {/* BOTTOM CONTENT: 4 Cards in a Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 xl:gap-8 relative z-10">
          {standards.map((item, idx) => (
            <Reveal key={item.num} delay={idx * 100} direction="up" className="h-full">
              <div className="flex flex-col h-full items-start gap-3 sm:gap-4 xl:gap-6 p-5 sm:p-6 xl:p-8 bg-white shadow-[0_10px_30px_rgba(7,26,46,0.04)] border border-black/[0.03] rounded-lg sm:rounded-sm hover:border-wff-gold/30 transition-all hover:-translate-y-1.5 duration-300 group">
                {/* Top side of card: Icon and huge number stacked horizontally */}
                <div className="flex items-center justify-between w-full mb-1 sm:mb-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 border border-wff-gold/30 flex items-center justify-center text-wff-gold bg-wff-gold/5 rounded-md sm:rounded-sm group-hover:bg-wff-gold group-hover:text-white transition-colors duration-300 shrink-0">
                    <item.icon size={22} className="sm:w-[26px] sm:h-[26px]" strokeWidth={1.5} />
                  </div>
                  <div className="font-heading font-bold text-3xl sm:text-4xl xl:text-5xl text-wff-gold leading-none opacity-40 group-hover:opacity-100 transition-opacity">
                    {item.num}
                  </div>
                </div>

                {/* Bottom side of card: Title and Desc */}
                <div className="flex flex-col flex-grow">
                  <h3 className="font-heading font-bold text-base sm:text-lg xl:text-xl uppercase tracking-wider text-wff-deep-navy mb-2 sm:mb-3 group-hover:text-wff-gold transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="font-body text-[13px] sm:text-[14px] xl:text-[15px] leading-[1.6] sm:leading-[1.65] text-wff-muted">
                    {item.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
