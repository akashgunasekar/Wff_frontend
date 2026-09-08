import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/types';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';

interface UpcomingEventsSectionProps {
  events: Event[];
}

export function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  if (!events || events.length === 0) {
    return (
      <section className="py-24 lg:py-32 bg-wff-bg">
        <Container className="text-center">
          <p className="font-heading font-medium text-sm tracking-[0.16em] uppercase text-wff-muted">No upcoming championships scheduled.</p>
        </Container>
      </section>
    );
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section className="py-24 lg:py-32 bg-wff-bg border-t border-black/[0.05] overflow-hidden">
      <Container>
        
        {/* CENTERED HEADER */}
        <Reveal direction="up">
          <div className="flex flex-col items-center text-center mb-16 lg:mb-20">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-px bg-wff-gold" />
              <span className="font-heading font-semibold text-[13px] tracking-[0.2em] uppercase text-wff-gold">
                Events
              </span>
              <div className="w-10 h-px bg-wff-gold" />
            </div>
            <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-[56px] uppercase leading-[1.05] tracking-tight mb-6">
              <span className="text-wff-deep-navy">Upcoming</span><br />
              <span className="text-wff-gold">Championships</span>
            </h2>
            <p className="font-body text-wff-muted text-[15px] lg:text-[16px] max-w-[700px] leading-[1.65]">
              Be part of prestigious WFF championship events that celebrate natural fitness, discipline and athletic excellence across Tamil Nadu.
            </p>
          </div>
        </Reveal>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12 max-w-[1440px] mx-auto">
          {events.slice(0, 3).map((event, idx) => {
            let statusLabel = 'CLOSED';
            if (event.status === 'open') statusLabel = 'REGISTRATION OPEN';
            else if (event.status === 'upcoming') statusLabel = 'UPCOMING';

            return (
              <Reveal key={event.id} delay={idx * 150} className="h-full">
                <div className="group flex flex-col h-full bg-white shadow-[0_10px_40px_rgba(7,26,46,0.06)] hover:shadow-[0_20px_60px_rgba(198,161,91,0.15)] border border-black/[0.04] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-default">
                  
                  {/* Poster Area */}
                  <Link href={`/events/${event.slug}`} className="relative aspect-[5/7] bg-wff-navy overflow-hidden block">
                    <Image 
                      src={event.banner_image || '/assets/wff_hero_banner.png'} 
                      alt={event.event_name} 
                      fill 
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                    />
                    
                    {/* Status Badge - Solid Gold Block */}
                    <div className="absolute top-0 left-0 bg-[#C9A44A] text-[#040A12] font-heading font-bold text-[10px] md:text-[11px] uppercase tracking-[0.15em] px-4 py-2 z-10 shadow-lg rounded-br-lg">
                      {statusLabel}
                    </div>

                    {/* Date Overlay */}
                    <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent w-full pt-20 p-5 md:p-6 flex items-end gap-3 z-10">
                       <span className="font-heading font-extrabold text-white text-5xl md:text-6xl leading-[0.8] tracking-tighter">
                         {formatDate(event.event_date).split(' ')[0]}
                       </span>
                       <span className="font-heading font-bold text-white/90 text-xs md:text-sm uppercase tracking-widest pb-1">
                         {formatDate(event.event_date).split(' ').slice(1).join(' ')}
                       </span>
                    </div>
                  </Link>
                  
                  {/* Bottom White Half */}
                  <div className="p-6 md:p-8 flex flex-col items-center flex-grow bg-white text-center">
                    <h3 className="font-heading font-bold text-[22px] md:text-[24px] uppercase text-wff-deep-navy group-hover:text-[#C9A44A] transition-colors duration-300 leading-[1.2] tracking-wide mb-6">
                      <Link href={`/events/${event.slug}`}>
                        {event.event_name}
                      </Link>
                    </h3>
                    
                    <div className="mt-auto pt-6 w-full border-t border-black/[0.06] flex justify-center">
                      <Link 
                        href={`/events/${event.slug}`}
                        className="group/btn inline-flex items-center gap-2 font-heading font-bold text-[12px] md:text-[13px] tracking-[0.15em] uppercase text-[#C9A44A] hover:text-wff-deep-navy transition-colors"
                      >
                        VIEW MORE
                        <ArrowRight size={16} className="transition-transform duration-250 ease-out group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
