import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/types';
import { Calendar, MapPin, ArrowRight, Trophy } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { decodeHtml, formatEventDateRange } from '@/lib/utils';

interface UpcomingEventsSectionProps {
  events: Event[];
}

export function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  if (!events || events.length === 0) {
    return (
      <section className="py-16 sm:py-24 bg-[#F4F6FA] w-full">
        <div className="w-full max-w-[1050px] mx-auto px-4 sm:px-6 text-center">
          <p className="font-heading font-semibold text-xs sm:text-sm tracking-[2px] uppercase text-[#07152F]/60">
            No upcoming championships scheduled.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F4F6FA] w-full overflow-hidden border-t border-black/5">
      <div className="w-full max-w-[1050px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading & Subtitle */}
        <Reveal direction="up">
          <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#D5AD52]/15 border border-[#D5AD52]/30 text-[#07152F] text-[11px] sm:text-[12px] font-heading font-bold uppercase tracking-[2px] rounded-full mb-3.5">
              <Trophy size={13} className="text-[#D5AD52]" />
              <span>OFFICIAL CALENDAR</span>
            </div>
            <h2 className="font-heading font-black text-[clamp(32px,3.5vw,46px)] uppercase leading-[1.05] tracking-tight text-[#07152F] mb-3 sm:mb-4">
              UPCOMING CHAMPIONSHIPS
            </h2>
            <p className="font-body font-normal text-[15px] sm:text-[16px] text-[#4A5568] max-w-[620px] mx-auto leading-[1.6]">
              Explore upcoming bodybuilding and fitness championships organised by WFF Tamil Nadu.
            </p>
          </div>
        </Reveal>

        {/* 2-Column Grid on Desktop & Tablet, 1-Column on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8 justify-center items-stretch max-w-[960px] lg:max-w-[1050px] mx-auto">
          {events.map((event, idx) => {
            // Dynamic registration status badge text
            let statusLabel = 'REGISTRATION CLOSED';
            if (event.status === 'open') {
              statusLabel = 'REGISTRATION OPEN';
            } else if (event.status === 'upcoming') {
              statusLabel = 'UPCOMING';
            }

            const formattedDate = formatEventDateRange(
              event.event_date,
              event.event_end_date,
              event.date_type
            );

            const eventVenue = event.venue || event.location || '';
            const eventUrl = `/events/${event.slug}`;
            const posterImage = event.banner_image || '/assets/wff_hero_banner.png';

            return (
              <Reveal key={event.id} delay={idx * 150} className="h-full">
                <article className="group flex flex-col h-full bg-[#07152F] border border-black/8 hover:border-[#D5AD52]/60 rounded-[16px] overflow-hidden shadow-[0_10px_30px_rgba(7,21,47,0.08)] hover:shadow-[0_20px_40px_rgba(7,21,47,0.18)] hover:-translate-y-1.5 transition-all duration-[350ms] ease-out">
                  
                  {/* Poster Image Area (Reduced by 10% with 5:6 Aspect Ratio) */}
                  <div className="relative w-full aspect-[5/6] bg-[#07152F] overflow-hidden rounded-t-[16px]">
                    <Link href={eventUrl} className="block w-full h-full relative" tabIndex={-1} aria-hidden="true">
                      <Image
                        src={posterImage}
                        alt={decodeHtml(event.event_name)}
                        fill
                        className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-[350ms] ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
                        priority={idx === 0}
                      />
                      {/* Subtle Dark Gradient Overlay near bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07152F] via-[#07152F]/15 to-transparent opacity-85 pointer-events-none" />
                    </Link>

                    {/* Registration Status Badge (Top-Left) */}
                    <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
                      <span className={`${
                        event.status === 'open'
                          ? 'bg-[#D5AD52] text-[#040A12]'
                          : 'bg-[#0B1E38]/95 text-[#FCF6BA] border border-[#D5AD52]/60 shadow-lg backdrop-blur-md'
                      } font-heading font-extrabold text-[12px] tracking-[1px] uppercase px-3 py-1.5 rounded-[4px] shadow-md leading-none`}>
                        {statusLabel}
                      </span>
                      {event.date_type === 'multi' && (
                        <span className="bg-[#07152F]/90 text-[#FCF6BA] border border-[#D5AD52]/40 font-heading font-extrabold text-[11px] tracking-[1px] uppercase px-2.5 py-1.5 rounded-[4px] backdrop-blur-md shadow-md leading-none">
                          Multi-Day
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dark Premium Information Panel */}
                  <div className="bg-[#07152F] p-5 sm:p-6 flex flex-col flex-grow justify-between rounded-b-[16px]">
                    <div className="flex flex-col">
                      {/* Event Title (Barlow Condensed, 24px desktop, 800, max 2 lines) */}
                      <h3 className="font-heading font-extrabold text-[20px] sm:text-[23px] uppercase text-white line-clamp-2 leading-[1.15] tracking-normal mb-2.5 group-hover:text-[#D5AD52] transition-colors duration-300">
                        <Link href={eventUrl}>
                          {decodeHtml(event.event_name)}
                        </Link>
                      </h3>

                      {/* Event Date (Inter, 14px, 600, Gold #D5AD52) */}
                      <div className="flex items-center gap-2 text-[#D5AD52] font-body font-semibold text-[13.5px] sm:text-[14px] leading-tight mb-2">
                        <Calendar size={15} className="shrink-0 text-[#D5AD52]" />
                        <span>{formattedDate}</span>
                      </div>

                      {/* Event Location (Inter, 13px, 400, Light Grey) */}
                      {eventVenue && (
                        <div className="flex items-start gap-2 text-white/70 font-body font-normal text-[12.5px] sm:text-[13px] leading-[1.45] mb-4 line-clamp-1 sm:line-clamp-2">
                          <MapPin size={14} className="shrink-0 text-white/40 mt-0.5" />
                          <span>{decodeHtml(eventVenue)}</span>
                        </div>
                      )}
                    </div>

                    {/* View Event Button (Gold Gradient, Barlow Condensed, 800, 1px tracking, Right Arrow) */}
                    <Link
                      href={eventUrl}
                      className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-[14px] sm:text-[15px] tracking-[1px] uppercase shadow-md hover:brightness-110 active:scale-[0.99] transition-all duration-300 group/btn mt-auto"
                    >
                      <span>View Event</span>
                      <ArrowRight size={16} strokeWidth={2.4} className="transition-transform duration-300 ease-out group-hover/btn:translate-x-1" />
                    </Link>
                  </div>

                </article>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
