import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Star, Award, Users, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Winner } from '@/types';
import { resolveImageUrl } from '@/lib/api';

interface WinnersSectionProps {
  winners: Winner[];
}

export function WinnersSection({ winners }: WinnersSectionProps) {
  const bgImage = (winners && winners.length > 0 && winners[0].photo)
    ? (resolveImageUrl(winners[0].photo) || '/assets/hall-of-champions.jpg')
    : '/assets/hall-of-champions.jpg';

  return (
    <section className="relative w-full py-16 sm:py-24 md:py-32 lg:py-40 flex items-center justify-center overflow-hidden border-t border-black/[0.05]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="Hall of Champions"
          fill
          unoptimized={bgImage.startsWith('/uploads') || bgImage.startsWith('http')}
          className="object-cover object-[center_35%]"
          priority
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-[#040A12]/80 backdrop-brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040A12] via-transparent to-[#040A12]/80" />
      </div>

      <div className="relative z-10 w-[92%] sm:w-[90%] max-w-[1400px] mx-auto flex flex-col items-center text-center">
        
        <Reveal direction="up" className="flex flex-col items-center w-full max-w-[800px]">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-3 sm:mb-5">
            <div className="w-8 h-px bg-[#C9A44A]" />
            <span className="font-heading font-bold text-[11px] sm:text-[13px] tracking-[2px] leading-[1.4] uppercase text-[#C9A44A]">
              Our Legacy
            </span>
            <div className="w-8 h-px bg-[#C9A44A]" />
          </div>

          {/* Title */}
          <h2 className="font-heading font-extrabold text-[clamp(32px,3.5vw,48px)] uppercase leading-[1.05] tracking-tight mb-4 sm:mb-5">
            <span className="text-white">Hall Of </span>
            <span className="text-[#C9A44A]">Champions</span>
          </h2>

          {/* Subtitle */}
          <p className="font-body font-normal text-[15px] sm:text-[16px] max-w-[650px] leading-[1.6] text-white/80 mb-8 sm:mb-10 tracking-normal">
            Celebrating the athletes who have set the benchmark for natural fitness and inspired generations to come.
          </p>

          {/* Button */}
          <Link 
            href="/events"
            className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border border-[#C9A44A]/40 bg-transparent hover:bg-[#C9A44A]/10 transition-all duration-300 rounded-sm"
          >
            <span className="font-heading font-extrabold text-[13px] sm:text-[15px] tracking-[1px] uppercase text-white">
              View All Champions
            </span>
            <ArrowRight size={16} className="text-[#C9A44A] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        {/* Bottom Features Row */}
        <Reveal delay={200} direction="up" className="mt-12 sm:mt-20 md:mt-28 w-full border-t border-white/10 pt-6 sm:pt-8">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-12 lg:gap-16 text-left sm:text-center">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Trophy size={18} className="text-[#C9A44A] sm:w-5 sm:h-5 shrink-0" />
              <span className="font-heading font-bold text-[11px] sm:text-[12px] uppercase tracking-[1px] text-white">Discipline</span>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Star size={18} className="text-[#C9A44A] sm:w-5 sm:h-5 shrink-0" />
              <span className="font-heading font-bold text-[11px] sm:text-[12px] uppercase tracking-[1px] text-white">Determination</span>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Award size={18} className="text-[#C9A44A] sm:w-5 sm:h-5 shrink-0" />
              <span className="font-heading font-bold text-[11px] sm:text-[12px] uppercase tracking-[1px] text-white">Championship</span>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Users size={18} className="text-[#C9A44A] sm:w-5 sm:h-5 shrink-0" />
              <span className="font-heading font-bold text-[11px] sm:text-[12px] uppercase tracking-[1px] text-white">Stronger Tomorrow</span>
            </div>
          </div>
        </Reveal>

        {/* Right side signature (Barlow Condensed branding) */}
        <Reveal delay={300} className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
          <div className="font-heading font-black uppercase text-[#C9A44A] text-[48px] leading-[0.95] tracking-tight text-right select-none">
            Champions<br />
            Inspire<br />
            Always
          </div>
        </Reveal>

      </div>
    </section>
  );
}
