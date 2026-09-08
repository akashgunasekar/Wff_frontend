import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/types';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface FeaturedEventSectionProps {
  events: Event[];
}

export function FeaturedEventSection({ events }: FeaturedEventSectionProps) {
  if (!events || events.length === 0) {
    return (
      <section className="py-20 lg:py-24 bg-white border-b border-[var(--border-color)]">
        <div className="max-w-[1500px] mx-auto px-6 text-center">
          <p className="font-display font-medium text-sm tracking-[0.16em] uppercase text-[var(--muted)]">No featured championships available.</p>
        </div>
      </section>
    );
  }
  const featured = events[0];
  const secondary = events.slice(1, 3);
  
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const statusLabel = (status: string) => {
    if (status === 'open') return 'Registration Open';
    if (status === 'upcoming') return 'Coming Soon';
    if (status === 'completed') return 'Completed';
    return 'Closed';
  };

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* TOP: FEATURED CHAMPIONSHIP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 mb-16">
          {/* Large Image — 7 cols */}
          <div className="lg:col-span-7 relative group">
            <Link href={`/events/${featured.slug}`} className="block">
              <div className="relative aspect-[4/3] lg:aspect-[16/11] overflow-hidden rounded-sm bg-[var(--navy)]">
                <Image src={featured.banner_image || '/assets/wff_hero_banner.png'} alt={featured.event_name} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 58vw" loading="lazy" />
                <div className="absolute top-5 left-5">
                  <span className={`inline-flex items-center h-7 px-3.5 font-display font-semibold text-[11px] tracking-[0.12em] uppercase rounded-sm ${featured.status === 'open' ? 'bg-[var(--gold)] text-[var(--deep-navy)]' : 'bg-white/10 text-white/80 backdrop-blur-sm'}`}>
                    {statusLabel(featured.status)}
                  </span>
                </div>
              </div>
            </Link>
          </div>
          {/* Info — 5 cols */}
          <div className="lg:col-span-5 flex flex-col justify-center px-0 lg:px-10 xl:px-14 py-8 lg:py-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-display font-bold text-sm text-[var(--gold)] tracking-[0.12em]">01</span>
              <div className="w-6 h-px bg-[var(--gold)]" />
              <span className="font-display font-medium text-[10px] tracking-[0.18em] uppercase text-[var(--muted)]">Featured Championship</span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-[2.5rem] uppercase text-[var(--text-primary)] leading-[0.95] tracking-[0.01em] mb-4">
              {featured.event_name}
            </h2>
            <div className="grid grid-cols-2 gap-y-5 gap-x-6 mb-10 mt-4">
              <div>
                <span className="font-display font-medium text-[11px] tracking-[0.16em] uppercase text-[var(--muted)] block mb-1">Date</span>
                <span className="font-body font-semibold text-[14px] text-[var(--text-primary)]">{formatDate(featured.event_date)}</span>
              </div>
              <div>
                <span className="font-display font-medium text-[11px] tracking-[0.16em] uppercase text-[var(--muted)] block mb-1">Location</span>
                <span className="font-body font-semibold text-[14px] text-[var(--text-primary)]">{featured.venue}, {featured.location}</span>
              </div>
              <div>
                <span className="font-display font-medium text-[11px] tracking-[0.16em] uppercase text-[var(--muted)] block mb-1">Category</span>
                <span className="font-body font-semibold text-[14px] text-[var(--text-primary)]">Open & Natural</span>
              </div>
              <div>
                <span className="font-display font-medium text-[11px] tracking-[0.16em] uppercase text-[var(--muted)] block mb-1">Status</span>
                <span className="font-body font-semibold text-[14px] text-[var(--gold)] uppercase">{statusLabel(featured.status)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href={`/events/${featured.slug}`} className="inline-flex items-center justify-center h-[50px] px-8 bg-[var(--navy)] text-white font-display font-bold text-[13px] tracking-[0.10em] uppercase rounded-sm hover:bg-[var(--gold)] hover:text-[var(--navy)] transition-all">
                Register Now
              </Link>
              <Link href={`/events/${featured.slug}`} className="inline-flex items-center justify-center h-[50px] px-8 border border-[var(--border-color)] text-[var(--text-body)] font-display font-bold text-[13px] tracking-[0.10em] uppercase rounded-sm hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all">
                View Event
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM: SECONDARY EVENTS */}
        {secondary.length > 0 && (
          <div>
            <h3 className="font-display font-semibold text-[12px] tracking-[0.16em] uppercase text-[var(--muted)] mb-5">Secondary Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {secondary.map((event) => (
                <Link href={`/events/${event.slug}`} key={event.id} className="group block">
                  <div className="border border-[var(--border-color)] rounded-sm overflow-hidden hover:border-[var(--gold)]/50 transition-colors flex items-center p-4 gap-5">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-[var(--navy)] shrink-0 rounded-sm overflow-hidden">
                      <Image src={event.banner_image || '/assets/wff_hero_banner.png'} alt={event.event_name} fill className="object-cover group-hover:scale-[1.05] transition-transform duration-700" sizes="150px" loading="lazy" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg sm:text-xl uppercase text-[var(--text-primary)] group-hover:text-[var(--gold)] transition-colors leading-tight mb-2">
                        {event.event_name}
                      </h4>
                      <p className="font-body text-[13px] text-[var(--muted)]">{formatDate(event.event_date)} • {event.location}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
