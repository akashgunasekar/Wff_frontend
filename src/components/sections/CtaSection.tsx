import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowRight } from 'lucide-react';

export function CtaSection({ section }: { section?: any }) {
  let ctaData = { label: 'REGISTER NOW', destination: '/register' };
  try {
    if (section && section.content) ctaData = JSON.parse(section.content);
  } catch(e) {}

  return (
    <section className="relative w-full bg-wff-deep-navy overflow-hidden flex items-center min-h-[500px]">
      
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/wff_hero_banner_2.png"
          alt="Championship Stage"
          fill
          className="object-cover opacity-20 mix-blend-overlay grayscale"
          sizes="100vw"
          loading="lazy"
        />
        {/* Navy Gradient to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-wff-deep-navy via-wff-deep-navy/90 to-wff-deep-navy/30" />
      </div>

      <Container className="relative z-10 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* LEFT - 6 Cols */}
          <div className="lg:col-span-6">
            <Reveal direction="left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-wff-gold" />
                <span className="font-heading font-semibold text-[13px] tracking-[0.2em] uppercase text-wff-gold">
                  Next Step
                </span>
              </div>
              
              <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase text-white leading-[0.95] tracking-tight">
                {section?.title || "Ready To Compete?"}
              </h2>
            </Reveal>
          </div>

          {/* RIGHT - 6 Cols */}
          <div className="lg:col-span-6 lg:pl-12 xl:pl-20 lg:border-l border-white/10">
            <Reveal direction="up" delay={200}>
              <p className="font-body text-white/70 text-[15px] md:text-[16px] leading-[1.6] mb-10 max-w-[55ch]">
                {section?.subtitle || "Your discipline deserves a professional stage. Step onto the WFF Tamil Nadu championship platform and compete alongside the finest natural athletes in the state."}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <Link
                  href={ctaData.destination || "/register"}
                  className="group relative inline-flex w-full sm:w-auto items-center justify-center rounded-[2px] font-heading font-bold tracking-[0.15em] uppercase transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] hover:brightness-110 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(201,164,74,0.4)] h-[56px] px-10 text-[13px] md:text-[14px] whitespace-nowrap"
                >
                  <span className="relative z-10 flex items-center">
                    {ctaData.label || "Register Now"}
                    <ArrowRight size={16} className="ml-3 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                  </span>
                  {/* Subtle shine effect on hover */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                </Link>
                
                <Link
                  href="/events"
                  className="group inline-flex w-full sm:w-auto items-center justify-center rounded-[2px] font-heading font-bold tracking-[0.15em] uppercase transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] bg-transparent border border-white/20 text-white hover:border-[#C9A44A] hover:bg-[#C9A44A]/10 hover:text-[#C9A44A] backdrop-blur-sm h-[56px] px-10 text-[13px] md:text-[14px] whitespace-nowrap hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(225,170,39,0.15)]"
                >
                  View Events
                </Link>
              </div>
            </Reveal>
          </div>

        </div>
      </Container>
    </section>
  );
}
