import { notFound } from 'next/navigation';
import { fetchEventBySlug, fetchEvents, resolveImageUrl } from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Calendar, MapPin, IndianRupee, Trophy, Info, AlertTriangle, CheckCircle2, Star, Target, FileText, HelpCircle, Globe, Phone, ShieldCheck, Tag } from 'lucide-react';
import { formatEventDateRange } from '@/lib/utils';
import EventActionBox from '@/components/ui/EventActionBox';
import WinnerSlider from '@/components/ui/WinnerSlider';
import FaqAccordion from '@/components/ui/FaqAccordion';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const event = await fetchEventBySlug(resolvedParams.slug);
  if (!event) return { title: 'Event Not Found | WFF Tamil Nadu' };
  
  if (resolvedParams.slug === 'india-natural-2027') {
    return {
      title: 'India Natural 2027 Chennai | Natural National Championship & Fashion Show | WFF Tamil Nadu',
      description: 'Official WFF Natural League presents India Natural 2027 — Natural National Championship & Fashion Show in Chennai on February 27 & 28, 2027. Register online today.',
      alternates: {
        canonical: 'https://wfftamilnadu.in/events/india-natural-2027'
      },
      openGraph: {
        title: 'India Natural 2027 Chennai | WFF Natural League',
        description: 'Natural National Championship & Fashion Show in Chennai on February 27 & 28, 2027.',
        images: [
          {
            url: '/assets/india-natural-2027.png',
            width: 1200,
            height: 630,
            alt: 'India Natural 2027 Official Championship Poster'
          }
        ]
      }
    };
  }

  if (resolvedParams.slug === 'south-india-natural-league-2027') {
    return {
      title: 'South India Natural League 2027 Chennai | WFF Tamil Nadu',
      description: 'Register for South India Natural League 2027, hosted by WFF Tamil Nadu in Chennai on 10 January 2027. Explore Denim Jeans Model, Bermuda Beach Model and Men Bodybuilding categories.',
      alternates: {
        canonical: 'https://wfftamilnadu.in/events/south-india-natural-league-2027'
      },
      openGraph: {
        title: 'South India Natural League 2027 Chennai | WFF Tamil Nadu',
        description: 'Register for South India Natural League 2027, hosted by WFF Tamil Nadu in Chennai on 10 January 2027. Explore Denim Jeans Model, Bermuda Beach Model and Men Bodybuilding categories.',
        images: [
          {
            url: '/assets/south-india-natural-league-2027.jpg',
            width: 1200,
            height: 630,
            alt: 'South India Natural League 2027 Official Poster'
          }
        ]
      }
    };
  }

  return {
    title: `${event.event_name} | WFF Tamil Nadu`,
    description: event.subtitle || event.description || 'Championship Event',
  };
}

export default async function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const event = await fetchEventBySlug(resolvedParams.slug);

  if (!event) {
    notFound();
  }

  // Determine if registration should be disabled
  const canRegister = event.status === 'open';
  const isUpcoming = event.status === 'upcoming';
  const isClosed = event.status === 'closed' || event.status === 'completed';

  return (
    <div className="flex flex-col min-h-screen bg-wff-bg pb-24">
      {/* Event Hero */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center overflow-hidden border-b border-wff-border bg-wff-deep-navy">
        <div className="absolute inset-0 z-0">
          <img 
            src={resolveImageUrl(event.banner_image) || '/assets/wff_hero_banner.png'} 
            alt={event.event_name}
            className="w-full h-full object-cover opacity-[0.15] mix-blend-overlay grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-wff-deep-navy via-wff-deep-navy/90 to-transparent"></div>
        </div>
        
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center justify-between">
            
            {/* Info (Left on Desktop now, matching editorial style) */}
            <div className="text-center md:text-left order-2 md:order-1 md:w-[60%] lg:w-[65%]">
              <div className="inline-block mb-6 rounded-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold px-6 py-2 text-[11px] tracking-[2px] uppercase shadow-[0_4px_15px_rgba(198,161,91,0.2)]">
                {event.status === 'open' ? 'Registration Open' : event.status === 'upcoming' ? 'Upcoming Championship' : 'Registration Closed'}
              </div>
              
              <h1 className="font-heading text-[clamp(36px,5vw,72px)] uppercase leading-[0.95] tracking-tight mb-6 drop-shadow-lg font-extrabold">
                {(() => {
                  const words = event.event_name.split(' ');
                  if (words.length <= 1) return <span className="text-white">{event.event_name}</span>;
                  const mid = Math.ceil(words.length / 2);
                  const firstHalf = words.slice(0, mid).join(' ');
                  const secondHalf = words.slice(mid).join(' ');
                  return (
                    <>
                      <span className="text-white">{firstHalf} </span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">{secondHalf}</span>
                    </>
                  );
                })()}
              </h1>
              
              <h2 className="font-heading text-lg sm:text-xl md:text-2xl text-wff-gold uppercase tracking-[1px] mb-8 font-bold drop-shadow-sm">
                {event.subtitle}
              </h2>
              
              <div className="flex flex-col sm:flex-row flex-wrap items-center md:items-start gap-6 text-sm tracking-label font-bold uppercase text-white/90 justify-center md:justify-start font-heading">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-wff-gold shrink-0" />
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>
                      {event.event_day && event.date_type !== 'multi' ? `${event.event_day}, ` : ''}
                      {formatEventDateRange(event.event_date, event.event_end_date, event.date_type)}
                    </span>
                    {event.date_type === 'multi' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-heading font-extrabold uppercase bg-wff-gold/20 text-wff-gold border border-wff-gold/40 tracking-wider">
                        Multi-Day
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-wff-gold shrink-0 mt-0.5" />
                  <span className="max-w-[300px] leading-snug">{event.venue}{event.location ? `, ${event.location}` : ''}</span>
                </div>
                {event.registration_fee && (
                  <div className="flex items-center gap-3">
                    <IndianRupee size={18} className="text-wff-gold shrink-0" />
                    <span>Entry Fee: ₹{event.registration_fee}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Poster (Right on Desktop) */}
            <div className="w-full max-w-[300px] lg:max-w-[350px] shrink-0 order-1 md:order-2">
              <div className="relative aspect-[5/7] rounded-sm overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-wff-navy group">
                <img 
                  src={resolveImageUrl(event.banner_image) || '/assets/wff_hero_banner.png'} 
                  alt={event.event_name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <Container className="mt-16 lg:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: About & Content (Order 2 on mobile, 1 on desktop) */}
          <div className="lg:col-span-8 order-2 lg:order-1 space-y-24">
            
            {/* About Section */}
            {(event.content_meta?.about_content || event.description) && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Info size={24} className="text-wff-gold" />
                  <h3 className="font-heading text-3xl uppercase tracking-wider text-wff-text-primary">
                    {event.content_meta?.about_title || 'About This Event'}
                  </h3>
                </div>
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none text-wff-text-body font-medium leading-relaxed prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-wide prose-a:text-wff-gold"
                  dangerouslySetInnerHTML={{ __html: event.content_meta?.about_content || event.description || '' }}
                />
              </section>
            )}

            {/* Why This Event Matters */}
            {event.content_meta?.why_highlights && event.content_meta.why_highlights.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Target size={24} className="text-wff-gold" />
                  <h3 className="font-heading text-3xl uppercase tracking-wider text-wff-text-primary">
                    {event.content_meta?.why_title || 'Why This Event Matters'}
                  </h3>
                </div>
                {event.content_meta.why_intro && (
                  <p className="text-lg text-wff-text-body font-medium leading-relaxed mb-10">{event.content_meta.why_intro}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.content_meta.why_highlights.filter(h => h.active !== false).map((highlight, idx) => (
                    <div key={idx} className="bg-wff-surface border border-wff-border p-6 rounded-sm shadow-sm flex gap-5 hover:border-wff-navy/30 transition-colors">
                       <div className="shrink-0 mt-1"><CheckCircle2 size={24} className="text-wff-gold" /></div>
                       <div>
                          <h4 className="font-heading text-xl uppercase tracking-wider text-wff-text-primary mb-2">{highlight.title}</h4>
                          <p className="text-sm text-wff-muted leading-relaxed font-medium">{highlight.description}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Registration Fee & Mandatory Clinical Testing Structure (For Tiered / South India League Events) */}
            {event.content_meta?.pricing_tiers && event.content_meta.pricing_tiers.length > 0 && (
              <section className="bg-[#040A12] border-2 border-wff-gold/40 rounded-xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
                
                <div className="flex items-center gap-3 mb-4">
                  <Tag className="text-wff-gold" size={22} />
                  <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-wider text-white">
                    Registration Fee Structure
                  </h3>
                </div>
                <p className="text-white/80 text-sm font-body mb-6 leading-relaxed">
                  Official category entry fee tiers from the championship poster. Additional-category entry discount is built directly into the tiers.
                </p>

                {/* 3 Tier Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {event.content_meta.pricing_tiers.map((tier: any, idx: number) => (
                    <div key={idx} className="bg-[#071A2E] border border-wff-gold/30 rounded-lg p-5 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-heading font-bold uppercase tracking-[1px] text-[#FCF6BA] block mb-1">
                          Tier {idx + 1}
                        </span>
                        <h4 className="font-heading text-xl font-bold uppercase text-white mb-2">
                          {tier.tier || tier.name}
                        </h4>
                      </div>
                      <div className="pt-3 border-t border-white/10 mt-3">
                        <span className="font-heading text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] block">
                          ₹{tier.fee?.toLocaleString()}
                        </span>
                        <span className="text-[11px] font-body text-white/60 block mt-0.5">Category Entry Fee</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mandatory Clinical Testing Charge Banner */}
                <div className="bg-[#11243B] border border-wff-gold/40 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={24} className="text-[#FCF6BA] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-heading text-lg font-bold uppercase text-white tracking-[0.5px]">
                        Mandatory Clinical Testing Charge: ₹2,000 Per Athlete
                      </h4>
                      <p className="text-white/75 text-xs sm:text-sm font-body leading-relaxed mt-0.5">
                        Mandatory drug-free clinical testing fee specified in the official event poster. Charged once per athlete regardless of how many categories are selected.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Example Calculations */}
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-body text-white/80">
                  <span className="font-heading font-bold uppercase text-[#FCF6BA] tracking-[1px]">Sample Totals:</span>
                  <span>Single: <strong className="text-white font-semibold">₹5,000</strong></span>
                  <span>•</span>
                  <span>Double: <strong className="text-white font-semibold">₹7,000</strong></span>
                  <span>•</span>
                  <span>Triple: <strong className="text-white font-semibold">₹8,000</strong></span>
                  {canRegister ? (
                    <Link
                      href={`/register?eventId=${event.id}`}
                      className="ml-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-xs uppercase tracking-[1px] hover:brightness-110 transition-all"
                    >
                      Register Now →
                    </Link>
                  ) : isUpcoming ? (
                    <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-500 font-heading font-extrabold text-xs uppercase tracking-[1px]">
                      Registration Opens Soon
                    </span>
                  ) : null}
                </div>
              </section>
            )}

            {/* Categories Section */}
            {event.categories && event.categories.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Trophy size={24} className="text-wff-gold" />
                  <h3 className="font-heading text-3xl uppercase tracking-wider text-wff-text-primary">
                    Competition Categories
                  </h3>
                </div>

                <div className="space-y-8">
                  {/* Group Categories by Main Category if available */}
                  {(() => {
                    const grouped: Record<string, typeof event.categories> = {};
                    event.categories.forEach((cat) => {
                      const mainName = cat.name.includes(' — ') ? cat.name.split(' — ')[0].trim() : 'Competition Categories';
                      if (!grouped[mainName]) grouped[mainName] = [];
                      grouped[mainName].push(cat);
                    });

                    return Object.entries(grouped).map(([mainCategory, catList], groupIdx) => (
                      <div key={groupIdx} className="bg-wff-surface border border-wff-border rounded-xl p-6 sm:p-8 shadow-sm">
                        <div className="border-b border-wff-border pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h4 className="font-heading text-2xl uppercase tracking-wider text-wff-text-primary font-bold">
                            {mainCategory}
                          </h4>
                          <span className="text-xs font-heading font-bold uppercase tracking-[1.5px] px-3 py-1 rounded-full bg-wff-gold/10 text-wff-gold border border-wff-gold/30 w-fit">
                            {catList.length} Division{catList.length > 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {catList.map((category) => {
                            const subName = category.name.includes(' — ') ? category.name.split(' — ')[1].trim() : category.name;
                            return (
                              <div key={category.id} className="p-4 rounded-lg bg-wff-bg/70 border border-wff-border flex flex-col justify-between hover:border-wff-gold/40 transition-colors">
                                <div>
                                  <h5 className="font-heading text-lg font-bold text-wff-text-primary uppercase tracking-wide mb-1">
                                    {subName}
                                  </h5>
                                  <div className="text-xs font-body text-wff-muted mb-2">
                                    {category.age_group || 'Open for all'}
                                  </div>
                                </div>
                                <div className="pt-3 border-t border-wff-border/50 flex items-center justify-between text-xs">
                                  <span className="font-heading font-bold text-wff-gold uppercase tracking-[1px]">
                                    {category.availability === 'closed' ? 'Closed' : 'Open for Entry'}
                                  </span>
                                  {canRegister && (
                                    <Link
                                      href={`/register?eventId=${event.id}`}
                                      className="text-wff-gold hover:underline font-heading font-bold uppercase tracking-[1px]"
                                    >
                                      Select →
                                    </Link>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </section>
            )}

            {/* Event Officials */}
            {event.officials && event.officials.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Star size={24} className="text-wff-gold" />
                  <h3 className="font-heading text-3xl uppercase tracking-wider text-wff-text-primary">
                    Federation Officials & Contact Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {event.officials.map((official: any, idx: number) => {
                    const phone = official.phone || (official.bio?.match(/(?:\+91\s?)?[0-9]{10}/) ? official.bio.match(/(?:\+91\s?)?[0-9]{10}/)[0] : null);
                    return (
                      <div key={official.official_id || idx} className="group flex flex-col h-full bg-[var(--surface)] rounded-xl overflow-hidden border border-[var(--border-color)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-500 hover:-translate-y-2 cursor-default">
                        {/* Portrait - Top Image */}
                        <div className="relative w-full aspect-[4/5] bg-[var(--navy)] overflow-hidden">
                          <img 
                            src={resolveImageUrl(official.photo) || '/assets/wff-international.png'} 
                            alt={official.name} 
                            className="w-full h-full object-cover object-top opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>

                        {/* Info - Bottom Content */}
                        <div className="flex flex-col flex-grow items-center text-center p-6 bg-[var(--surface)] relative z-10 transition-colors">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[var(--gold)] rounded-b-md transform origin-top transition-transform duration-500 group-hover:scale-x-150" />
                          
                          <span className="font-heading font-bold text-[9px] xl:text-[10px] tracking-[0.2em] uppercase text-[var(--gold)] mb-3 mt-2 bg-[var(--gold-surface)] px-3 py-1.5 rounded-md border border-[var(--gold)]/20">
                            {official.role}
                          </span>
                          <h5 className="font-heading font-extrabold text-[18px] xl:text-[20px] uppercase text-[var(--text-primary)] leading-[1.1] mb-2">
                            {official.name}
                          </h5>
                          {official.designation && (
                            <p className="font-heading font-semibold text-[var(--muted)] text-[10px] xl:text-[11px] uppercase tracking-[0.15em] leading-[1.6] max-w-[90%] mb-3">
                              {official.designation}
                            </p>
                          )}

                          {/* Clickable Phone Number */}
                          {phone && (
                            <a
                              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                              className="inline-flex items-center gap-1.5 text-xs text-wff-gold font-body font-bold hover:underline mb-3 px-3 py-1 rounded bg-wff-gold/10 border border-wff-gold/20"
                            >
                              <Phone size={13} /> {phone}
                            </a>
                          )}

                          {(official.instagram_url || official.facebook_url) && (
                            <div className="flex gap-4 mt-auto text-[var(--muted)] justify-center items-center w-full border-t border-[var(--border-color)] pt-4">
                              {official.instagram_url && (
                                <a href={official.instagram_url} target="_blank" rel="noopener noreferrer" aria-label={`${official.name} Instagram`} className="hover:text-[var(--gold)] transition-colors">
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                </a>
                              )}
                              {official.facebook_url && (
                                <a href={official.facebook_url} target="_blank" rel="noopener noreferrer" aria-label={`${official.name} Facebook`} className="hover:text-[var(--gold)] transition-colors">
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
            
            {/* Winner Announcement */}
            {event.content_meta?.winner_slides && event.content_meta.winner_slides.length > 0 && event.content_meta.winner_slides.some(s => s.active !== false) && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Trophy size={24} className="text-wff-gold" />
                  <h3 className="font-heading text-3xl uppercase tracking-wider text-wff-text-primary">
                    Winner Announcement
                  </h3>
                </div>
                <WinnerSlider slides={event.content_meta.winner_slides} />
              </section>
            )}

            {/* FAQs */}
            {event.content_meta?.faqs && event.content_meta.faqs.length > 0 && event.content_meta.faqs.some(f => f.active !== false) && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <HelpCircle size={24} className="text-wff-gold" />
                  <h3 className="font-heading text-3xl uppercase tracking-wider text-wff-text-primary">
                    Frequently Asked Questions
                  </h3>
                </div>
                <FaqAccordion faqs={event.content_meta.faqs} />
              </section>
            )}

            {/* Terms and Conditions */}
            {(event.content_meta?.terms_content || (event.terms_and_conditions && event.terms_and_conditions.length > 0)) && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <FileText size={24} className="text-wff-gold" />
                  <h3 className="font-heading text-3xl uppercase tracking-wider text-wff-text-primary">
                    Terms & Conditions
                  </h3>
                </div>
                {event.content_meta?.terms_content ? (
                  <div className="bg-wff-surface p-8 rounded-sm border border-wff-border">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-wff-text-body font-medium leading-relaxed prose-headings:font-heading prose-headings:uppercase" dangerouslySetInnerHTML={{ __html: event.content_meta.terms_content }} />
                  </div>
                ) : (
                  <div className="bg-wff-surface p-8 rounded-sm border border-wff-border">
                    <ul className="space-y-5">
                      {event.terms_and_conditions?.map((term, index) => (
                        <li key={index} className="flex items-start gap-4 text-wff-text-body font-medium text-[15px]">
                          <CheckCircle2 size={20} className="text-wff-gold shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{term}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Right Column: Sticky Sidebar Info (Order 1 on mobile, 2 on desktop) */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="sticky top-28 space-y-8">
              <EventActionBox 
                eventId={event.id}
                targetDateStr={event.event_date}
                venue={event.venue}
                isClosed={isClosed}
                status={event.status}
              />
            </div>
          </div>

        </div>
      </Container>

      {/* Mobile Sticky Registration Action Bar */}
      {canRegister && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border-color)] px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3 font-body">
            <div className="min-w-0 flex-1">
              <span className="text-xs uppercase font-bold tracking-label text-[var(--gold)] block font-heading">
                {event.status === 'open' ? 'Registrations Open' : 'Upcoming Event'}
              </span>
              <div className="font-heading font-black text-base text-[var(--text-primary)] leading-tight truncate">
                {event.event_name}
              </div>
            </div>
            <Link
              href={`/register?eventId=${event.id}`}
              className="h-11 px-5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-sm tracking-btn uppercase rounded-lg shadow-md shrink-0 flex items-center justify-center whitespace-nowrap"
            >
              Register Now →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
