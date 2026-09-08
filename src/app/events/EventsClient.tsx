"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/types';
import { ArrowUpRight, Trophy, Users, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';

interface EventsClientProps {
  initialEvents: Event[];
}

type FilterType = 'ALL' | 'UPCOMING' | 'REGISTRATION OPEN' | 'CLOSED';

export function EventsClient({ initialEvents }: EventsClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

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
    <div className="bg-wff-bg min-h-[80vh]">
      <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32 bg-[#040A12] text-white overflow-hidden border-b border-white/5">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/event-banner.png"
            alt="Events Banner"
            fill
            className="object-cover object-[center_right] opacity-80"
            priority
          />
          {/* Gradient Overlay for text readability on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#040A12] via-[#040A12]/90 to-transparent" />
        </div>
        
        {/* Giant Watermark WFF */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-[0.03] pointer-events-none hidden md:block select-none">
           <span className="font-heading font-bold text-[30vw] tracking-tighter text-white">WFF</span>
        </div>

        <div className="w-[90%] max-w-[1400px] mx-auto relative z-10 px-4 md:px-0">
          
          <Reveal direction="up" className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#C9A44A]" />
              <span className="font-heading font-semibold text-sm tracking-[0.2em] uppercase text-[#C9A44A]">
                Calendar
              </span>
            </div>
            
            <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-[72px] uppercase leading-[0.95] tracking-tight mb-6 text-white drop-shadow-lg">
              Events
            </h1>
            
            <p className="font-body text-[15px] md:text-[16px] text-white/80 max-w-xl leading-[1.65] mb-12 drop-shadow-md">
              Championships, competitions and official WFF events in Tamil Nadu. Be a part of a platform that celebrates natural fitness, discipline and athletic excellence.
            </p>

            {/* Icon Row */}
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-10">
              <div className="flex items-center gap-3">
                <Calendar size={28} className="text-[#C9A44A] shrink-0" strokeWidth={1.5} />
                <div className="flex flex-col">
                   <span className="font-heading font-bold text-[11px] md:text-[12px] uppercase tracking-[0.15em] text-white leading-tight">Official Events</span>
                   <span className="font-heading font-medium text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-[#C9A44A]/80 leading-tight">Across Tamil Nadu</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users size={28} className="text-[#C9A44A] shrink-0" strokeWidth={1.5} />
                <div className="flex flex-col">
                   <span className="font-heading font-bold text-[11px] md:text-[12px] uppercase tracking-[0.15em] text-white leading-tight">Natural Athletes</span>
                   <span className="font-heading font-medium text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-[#C9A44A]/80 leading-tight">Real People</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Trophy size={28} className="text-[#C9A44A] shrink-0" strokeWidth={1.5} />
                <div className="flex flex-col">
                   <span className="font-heading font-bold text-[11px] md:text-[12px] uppercase tracking-[0.15em] text-white leading-tight">A Stronger</span>
                   <span className="font-heading font-medium text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-[#C9A44A]/80 leading-tight">Tomorrow</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Cursive Text on the right */}
          <Reveal delay={200} className="hidden lg:block absolute right-[5%] xl:right-10 top-1/2 -translate-y-1/2 z-10 pointer-events-none mt-16">
             <div className="font-heading italic font-light text-[#C9A44A] text-[40px] xl:text-[48px] leading-[1.1] tracking-wider transform -rotate-12 text-right drop-shadow-xl opacity-90">
               More<br />
               Than a<br />
               Competition
             </div>
          </Reveal>
        </div>
      </section>

      <section className="py-4 border-b border-black/5 sticky top-[72px] z-30 bg-wff-surface shadow-sm overflow-hidden">
        <div className="w-[90%] max-w-[1400px] mx-auto px-4 md:px-0 flex flex-col md:flex-row justify-between items-center gap-4">
           {/* Filters */}
           <div className="flex overflow-x-auto no-scrollbar gap-3 w-full md:w-auto">
             {(['ALL', 'UPCOMING', 'REGISTRATION OPEN', 'CLOSED'] as FilterType[]).map((filter) => (
               <button
                 key={filter}
                 onClick={() => setActiveFilter(filter)}
                 className={`shrink-0 h-10 px-5 font-heading font-bold text-[11px] tracking-[0.1em] uppercase transition-all duration-300 border ${activeFilter === filter ? 'bg-[#040A12] text-white border-[#040A12]' : 'bg-transparent text-[#040A12]/60 border-black/10 hover:border-black/30 hover:text-[#040A12]'}`}
               >
                 {filter}
               </button>
             ))}
           </div>
           
           {/* Search & Tagline */}
           <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="relative w-full md:w-[250px]">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Search events..." className="w-full h-10 pl-10 pr-4 bg-transparent border border-black/10 rounded-sm font-body text-sm text-[#040A12] focus:outline-none focus:border-black/30 placeholder:text-black/30" />
              </div>
              <div className="hidden lg:flex items-center gap-4 h-10 pl-6 border-l border-[#C9A44A]/40">
                <span className="font-heading font-bold text-[10px] tracking-[0.2em] uppercase text-[#040A12]/40 leading-[1.2]">
                  Discipline<br/>Builds<br/>Champions
                </span>
              </div>
           </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden min-h-screen">
        {/* Background elements */}
        <div className="absolute left-[-10%] bottom-0 w-[600px] h-[600px] bg-no-repeat bg-contain bg-left-bottom opacity-[0.03] pointer-events-none hidden lg:block" style={{ backgroundImage: "url('/assets/wff_hero_banner.png')" }} />

        <div className="w-[90%] max-w-[1400px] mx-auto relative z-10 px-4 md:px-0">
          
          <div>
            {/* Cards Grid */}
            <div className="w-full">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-32 border border-dashed border-black/10 bg-white">
                   <h3 className="font-heading font-bold text-2xl uppercase tracking-widest text-[#040A12] mb-4">No Events Found</h3>
                   <p className="font-body text-[#040A12]/60 text-lg">
                     {activeFilter === 'REGISTRATION OPEN' && "No events are currently open for registration."}
                     {activeFilter === 'UPCOMING' && "No upcoming championships are scheduled at the moment."}
                     {activeFilter === 'CLOSED' && "No closed events available."}
                     {activeFilter === 'ALL' && "No events are available at this time."}
                   </p>
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

                    const eventDate = new Date(event.event_date);
                    const day = eventDate.getDate();
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const month = monthNames[eventDate.getMonth()];
                    const year = eventDate.getFullYear();

                    return (
                      <div key={event.id} className="group flex flex-col bg-white border border-black/[0.04] shadow-[0_4px_20px_rgba(7,26,46,0.03)] hover:shadow-[0_20px_40px_rgba(7,26,46,0.08)] transition-all duration-500 overflow-hidden rounded-sm hover:-translate-y-1">
                        
                        {/* Image Banner */}
                        <div className="relative w-full aspect-[4/3] bg-[#040A12] overflow-hidden">
                          <Image 
                            src={event.banner_image || '/assets/wff_hero_banner.png'} 
                            alt={event.event_name} 
                            fill 
                            className="object-cover group-hover:scale-105 group-hover:opacity-90 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" 
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" 
                          />
                          
                          {/* Status Badge */}
                          <div className="absolute top-4 left-0 bg-[#C9A44A] px-4 py-1.5 shadow-md z-10">
                            <span className="font-heading font-bold text-[10px] tracking-[0.15em] uppercase text-[#040A12]">
                              {statusLabel}
                            </span>
                          </div>

                          {/* Date Block */}
                          <div className="absolute bottom-4 right-4 bg-[#040A12] text-white flex flex-col items-center justify-center p-3 shadow-xl border border-white/10 z-10 min-w-[70px]">
                            <span className="font-heading font-bold text-3xl leading-none">{day}</span>
                            <span className="font-heading font-semibold text-xs tracking-widest uppercase mt-1">{month}</span>
                            <span className="font-heading font-bold text-[10px] tracking-widest text-[#C9A44A] mt-1">{year}</span>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 xl:p-8 flex flex-col flex-grow">
                           <h3 className="font-heading font-bold text-xl xl:text-[24px] uppercase text-[#040A12] leading-[1.2] mb-6 group-hover:text-[#C9A44A] transition-colors duration-300">
                             <Link href={`/events/${event.slug}`} className="block">
                               {event.event_name}
                             </Link>
                           </h3>
                           
                           <div className="space-y-4 mb-8 mt-auto">
                             <div className="flex gap-4 items-start">
                               <Calendar size={18} className="text-[#040A12]/40 shrink-0 mt-0.5" strokeWidth={2} />
                               <div className="flex flex-col">
                                 <span className="font-heading font-bold text-[10px] tracking-[0.15em] uppercase text-[#040A12]/40 mb-1">Date</span>
                                 <span className="font-heading font-semibold text-sm text-[#040A12]">{formatDate(event.event_date)}</span>
                               </div>
                             </div>
                             <div className="flex gap-4 items-start">
                               <svg className="w-[18px] h-[18px] text-[#040A12]/40 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                               <div className="flex flex-col">
                                 <span className="font-heading font-bold text-[10px] tracking-[0.15em] uppercase text-[#040A12]/40 mb-1">Location</span>
                                 <span className="font-heading font-semibold text-sm text-[#040A12] leading-snug">{event.venue || event.location}</span>
                               </div>
                             </div>
                           </div>
                           
                           {/* Buttons */}
                           <div className="flex flex-col gap-3">
                             <Link href={event.status === 'open' ? `/register?eventId=${event.id}` : `/events/${event.slug}`} className="w-full inline-flex justify-center items-center h-[48px] bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] font-heading font-bold text-[12px] tracking-[0.15em] uppercase text-[#040A12] hover:brightness-110 transition-all shadow-[0_4px_14px_rgba(201,164,74,0.3)]">
                               {event.status === 'open' ? 'Register Now' : 'View Details'} <ArrowUpRight size={16} className="ml-2" />
                             </Link>
                             <Link href={`/events/${event.slug}`} className="w-full inline-flex justify-center items-center h-[48px] border border-[#040A12]/20 font-heading font-bold text-[12px] tracking-[0.15em] uppercase text-[#040A12] hover:bg-[#040A12] hover:text-white transition-colors">
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
          
        </div>
      </section>
    </div>
  );
}
