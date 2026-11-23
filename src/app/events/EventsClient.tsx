"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/types';
import { ArrowUpRight, Trophy, Users, Calendar, Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import { decodeHtml, formatEventDateRange } from '@/lib/utils';

interface EventsClientProps {
  initialEvents: Event[];
}

type FilterType = 'ALL' | 'UPCOMING' | 'REGISTRATION OPEN' | 'CLOSED';

export function EventsClient({ initialEvents }: EventsClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getFilteredEvents = () => {
    let filtered = initialEvents;

    if (activeFilter === 'UPCOMING') {
      filtered = initialEvents.filter(e => e.status === 'upcoming');
    } else if (activeFilter === 'REGISTRATION OPEN') {
      filtered = initialEvents.filter(e => e.status === 'open');
    } else if (activeFilter === 'CLOSED') {
      filtered = initialEvents.filter(e => e.status === 'closed' || e.status === 'completed');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.event_name.toLowerCase().includes(q) ||
        (e.venue && e.venue.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q))
      );
    }

    // Sort: UPCOMING/OPEN closest first, CLOSED most recent first.
    return filtered.sort((a, b) => {
      const dateA = new Date(a.event_date).getTime();
      const dateB = new Date(b.event_date).getTime();
      if (a.status === 'closed' || a.status === 'completed') {
        return dateB - dateA; // Descending
      }
      return dateA - dateB; // Ascending
    });
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="bg-[var(--bg)] min-h-[80vh] transition-colors">
      <section className="relative w-full pt-16 pb-14 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32 bg-[#040A12] text-white overflow-hidden border-b border-white/10">

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/event-banner.png"
            alt="Events Banner"
            fill
            className="object-cover object-[center_right] opacity-75"
            priority
          />
          {/* Gradient Overlay for text readability on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#040A12] via-[#040A12]/90 to-transparent" />
        </div>

        {/* Giant Watermark WFF */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-[0.03] pointer-events-none hidden md:block select-none">
          <span className="font-heading font-bold text-[30vw] tracking-tighter text-white">WFF</span>
        </div>

        <div className="w-[90%] max-w-[1400px] mx-auto relative z-10 px-2 md:px-0">

          <Reveal direction="up" className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#C9A44A]" />
              <span className="font-heading font-bold text-[11px] sm:text-[13px] tracking-[2px] leading-[1.4] uppercase text-[#C9A44A]">
                Calendar
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-[clamp(36px,4.5vw,72px)] uppercase leading-[0.95] tracking-tight mb-6 text-white drop-shadow-lg">
              Events &amp; Competitions
            </h1>

            <p className="font-body font-normal text-[15px] sm:text-[16px] text-white/80 max-w-xl leading-[1.6] mb-12 tracking-normal drop-shadow-md">
              Championships, grand prix competitions and official WFF events across Tamil Nadu. Experience a premier platform celebrating natural fitness and true sportsmanship.
            </p>

            {/* Icon Row */}
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-10">
              <div className="flex items-center gap-3">
                <Calendar size={28} className="text-[#C9A44A] shrink-0" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-[11px] md:text-[12px] uppercase tracking-[1px] text-white leading-tight">Official Events</span>
                  <span className="font-body font-medium text-[11px] text-[#C9A44A]/90 leading-tight">Across Tamil Nadu</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users size={28} className="text-[#C9A44A] shrink-0" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-[11px] md:text-[12px] uppercase tracking-[1px] text-white leading-tight">Natural Athletes</span>
                  <span className="font-body font-medium text-[11px] text-[#C9A44A]/90 leading-tight">Global Affiliation</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Trophy size={28} className="text-[#C9A44A] shrink-0" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-[11px] md:text-[12px] uppercase tracking-[1px] text-white leading-tight">Pro Cards</span>
                  <span className="font-body font-medium text-[11px] text-[#C9A44A]/90 leading-tight">Championship Titles</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STICKY FILTER BAR */}
      <section className="py-4 border-b border-[var(--border-color)] sticky top-[64px] z-30 bg-[var(--surface)]/95 backdrop-blur-md shadow-sm overflow-hidden transition-colors">
        <div className="w-[90%] max-w-[1400px] mx-auto px-4 md:px-0 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Filters */}
          <div className="flex overflow-x-auto no-scrollbar gap-2.5 w-full md:w-auto">
            {(['ALL', 'UPCOMING', 'REGISTRATION OPEN', 'CLOSED'] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 h-10 px-5 rounded-lg font-heading font-bold text-[12px] tracking-[1px] uppercase transition-all duration-200 border cursor-pointer ${
                  activeFilter === filter 
                    ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-[#040A12] border-transparent shadow-sm' 
                    : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border-color)] hover:border-[var(--gold)]/50 hover:text-[var(--text-primary)]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Search & Count */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            <span className="font-heading font-semibold text-xs tracking-wider uppercase text-[var(--muted)] shrink-0 hidden sm:inline-block">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'Championship' : 'Championships'}
            </span>
            <div className="relative w-full md:w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
              <input
                type="text"
                aria-label="Search championships by name or venue"
                placeholder="Search championships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-9 bg-[var(--bg)] border border-[var(--border-color)] rounded-lg font-body text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] placeholder:text-[var(--muted)] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text-primary)] p-1 rounded-full"
                >
                  <span className="text-xs font-bold leading-none">✕</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS GRID */}
      <section className="md:py-20 py-12 relative overflow-hidden min-h-screen">
        <div className="w-[90%] max-w-[1400px] mx-auto relative z-10 px-2 md:px-0">
          <div className="w-full">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-20 px-6 border border-dashed border-[var(--border-color)] bg-[var(--surface)] rounded-2xl max-w-xl mx-auto shadow-sm">
                <div className="w-14 h-14 rounded-full bg-[var(--gold-surface)] text-[var(--gold)] flex items-center justify-center mx-auto mb-4 border border-[var(--gold)]/30">
                  <Search size={24} />
                </div>
                <h3 className="font-heading font-bold text-2xl uppercase tracking-widest text-[var(--text-primary)] mb-2">No Events Found</h3>
                <p className="font-body text-[var(--muted)] text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  {searchQuery 
                    ? `No championships match "${searchQuery}". Try modifying your search keywords or resetting your filters.` 
                    : "No championships are currently available in this filter category."}
                </p>
                {(searchQuery || activeFilter !== 'ALL') && (
                  <button
                    type="button"
                    onClick={() => { setActiveFilter('ALL'); setSearchQuery(''); }}
                    className="inline-flex items-center justify-center px-6 h-11 rounded-lg bg-[var(--gold)] text-[#040A12] font-heading font-bold text-xs uppercase tracking-[0.15em] hover:bg-[var(--gold-hover)] transition-all"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
                {filteredEvents.map((event) => {
                  let statusLabel = 'CLOSED';
                  if (event.status === 'open') {
                    statusLabel = 'REGISTRATION OPEN';
                  } else if (event.status === 'upcoming') {
                    statusLabel = 'UPCOMING';
                  }

                  const isMulti = event.date_type === 'multi' && !!event.event_end_date;
                  const eventDate = new Date(event.event_date);
                  const day = eventDate.getDate();
                  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  const month = monthNames[eventDate.getMonth()];
                  const year = eventDate.getFullYear();
                  const endDay = isMulti ? new Date(event.event_end_date!).getDate() : null;

                  return (
                    <div key={event.id} className="group flex flex-col bg-[var(--surface)] border border-[var(--border-color)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-500 overflow-hidden rounded-xl hover:-translate-y-1.5 font-body">

                      {/* Image Banner */}
                      <div className="relative w-full aspect-[4/3] bg-[var(--navy)] overflow-hidden">
                        <Image
                          src={event.banner_image || '/assets/wff_hero_banner.png'}
                          alt={event.event_name}
                          fill
                          className="object-cover group-hover:scale-105 group-hover:opacity-90 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />

                        {/* Status Badge */}
                        <div className={`absolute top-0 left-0 ${
                          event.status === 'open'
                            ? 'bg-[var(--gold)] text-[#040A12]'
                            : 'bg-[#0B1E38] text-[#FCF6BA] border-b border-r border-[#D5AD52]/50'
                        } px-4 py-1.5 shadow-md z-10 rounded-br-lg flex items-center gap-1.5`}>
                          <span className="font-heading font-bold text-[10px] tracking-label uppercase">
                            {statusLabel}
                          </span>
                          {isMulti && (
                            <span className="px-1.5 py-0.2 rounded bg-black/30 text-white font-heading text-[9px] uppercase tracking-wider font-extrabold">
                              Multi-Day
                            </span>
                          )}
                        </div>

                        {/* Date Block */}
                        <div className="absolute bottom-4 right-4 bg-[#040A12]/90 backdrop-blur-sm text-white flex flex-col items-center justify-center p-3 shadow-xl border border-white/10 z-10 min-w-[70px] rounded-lg">
                          <span className="font-heading font-bold text-2xl lg:text-3xl leading-none">
                            {isMulti && endDay ? `${day}–${endDay}` : day}
                          </span>
                          <span className="font-heading font-semibold text-xs tracking-wider uppercase mt-1">{month}</span>
                          <span className="font-heading font-bold text-[10px] tracking-label text-[#C9A44A] mt-1">{year}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 xl:p-8 flex flex-col flex-grow">
                        <h3 className="font-heading font-bold text-[19px] sm:text-[22px] uppercase text-[var(--text-primary)] leading-[1.2] mb-6 group-hover:text-[var(--gold)] transition-colors duration-300">
                          <Link href={`/events/${event.slug}`} className="block">
                            {decodeHtml(event.event_name)}
                          </Link>
                        </h3>

                        <div className="space-y-4 mb-8 mt-auto">
                          <div className="flex gap-4 items-start">
                            <Calendar size={18} className="text-[var(--gold)] shrink-0 mt-0.5" strokeWidth={2} />
                            <div className="flex flex-col">
                              <span className="font-heading font-bold text-[11px] tracking-[1px] uppercase text-[var(--muted)] mb-0.5">Date</span>
                              <span className="font-body font-bold text-[15px] text-[var(--text-primary)]">
                                {formatEventDateRange(event.event_date, event.event_end_date, event.date_type)}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-4 items-start">
                            <svg className="w-[18px] h-[18px] text-[var(--gold)] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <div className="flex flex-col">
                              <span className="font-heading font-bold text-[11px] tracking-[1px] uppercase text-[var(--muted)] mb-0.5">Location</span>
                              <span className="font-body font-medium text-[14px] text-[var(--text-primary)] leading-snug">{event.venue || event.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3">
                          <Link href={event.status === 'open' ? `/register?eventId=${event.id}` : `/events/${event.slug}`} className="w-full inline-flex justify-center items-center h-[48px] bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] font-heading font-extrabold text-[13px] sm:text-[15px] tracking-[1px] uppercase text-[#040A12] hover:brightness-110 transition-all shadow-[0_4px_14px_rgba(201,164,74,0.3)] rounded-lg">
                            {event.status === 'open' ? 'Register Now' : 'View Details'} <ArrowUpRight size={16} className="ml-2" />
                          </Link>
                          <Link href={`/events/${event.slug}`} className="w-full inline-flex justify-center items-center h-[48px] border border-[var(--border-color)] font-heading font-extrabold text-[13px] sm:text-[15px] tracking-[1px] uppercase text-[var(--text-primary)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors rounded-lg">
                            Event Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
