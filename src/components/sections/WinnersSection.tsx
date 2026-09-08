import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Star, Award, Users, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Winner } from '@/types'; // Kept for prop typing consistency

interface WinnersSectionProps {
  winners: Winner[];
}

export function WinnersSection({ winners }: WinnersSectionProps) {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40 flex items-center justify-center overflow-hidden border-t border-black/[0.05]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/wff_hero_banner.png"
          alt="Hall of Champions"
          fill
          className="object-cover object-[center_30%]"
          priority
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-[#040A12]/85 backdrop-brightness-50" />
      </div>

      <div className="relative z-10 w-[90%] max-w-[1400px] mx-auto flex flex-col items-center text-center">
        
        <Reveal direction="up" className="flex flex-col items-center">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#C9A44A]" />
            <span className="font-heading font-semibold text-[12px] tracking-[0.2em] uppercase text-[#C9A44A]">
              Our Legacy
            </span>
            <div className="w-8 h-px bg-[#C9A44A]" />
          </div>

          {/* Title */}
          <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-[64px] uppercase leading-[1.05] tracking-tight mb-5">
            <span className="text-white">Hall Of </span>
            <span className="text-[#C9A44A]">Champions</span>
          </h2>

          {/* Subtitle */}
          <p className="font-body text-white/70 text-[14px] md:text-[16px] max-w-[600px] leading-[1.6] mb-10">
            Celebrating the athletes who have set the benchmark for natural fitness and inspired generations to come.
          </p>

          {/* Button */}
          <Link 
            href="/events"
            className="group inline-flex items-center gap-3 px-8 py-4 border border-[#C9A44A]/40 bg-transparent hover:bg-[#C9A44A]/10 transition-all duration-300"
          >
            <span className="font-heading font-bold text-[12px] tracking-[0.15em] uppercase text-white">
              View All Champions
            </span>
            <ArrowRight size={16} className="text-[#C9A44A] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        {/* Bottom Features Row */}
        <Reveal delay={200} direction="up" className="mt-20 md:mt-28 w-full border-t border-white/10 pt-8 flex flex-wrap justify-center gap-6 md:gap-12 lg:gap-16">
          <div className="flex items-center gap-3">
            <Trophy size={20} className="text-[#C9A44A]" />
            <span className="font-heading font-semibold text-[11px] md:text-[12px] uppercase tracking-[0.15em] text-white">Discipline</span>
          </div>
          <div className="flex items-center gap-3">
            <Star size={20} className="text-[#C9A44A]" />
            <span className="font-heading font-semibold text-[11px] md:text-[12px] uppercase tracking-[0.15em] text-white">Determination</span>
          </div>
          <div className="flex items-center gap-3">
            <Award size={20} className="text-[#C9A44A]" />
            <span className="font-heading font-semibold text-[11px] md:text-[12px] uppercase tracking-[0.15em] text-white">Championship</span>
          </div>
          <div className="flex items-center gap-3">
            <Users size={20} className="text-[#C9A44A]" />
            <span className="font-heading font-semibold text-[11px] md:text-[12px] uppercase tracking-[0.15em] text-white">A Stronger Tomorrow</span>
          </div>
        </Reveal>

        {/* Right side cursive signature (absolute positioning on large screens) */}
        <Reveal delay={300} className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 opacity-80 pointer-events-none">
          <div className="font-heading italic font-light text-[#C9A44A] text-[40px] leading-[1.1] tracking-wider transform -rotate-6 text-right drop-shadow-md">
            Champions<br />
            Inspire<br />
            Always
          </div>
        </Reveal>

      </div>
    </section>
  );
}
