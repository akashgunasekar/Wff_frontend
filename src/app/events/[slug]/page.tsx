import { notFound } from 'next/navigation';
import { fetchEventBySlug, fetchEvents, resolveImageUrl } from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Calendar, MapPin, IndianRupee, Trophy, Info, AlertTriangle, CheckCircle2, Star, Target, FileText, HelpCircle, Globe } from 'lucide-react';
import EventActionBox from '@/components/ui/EventActionBox';
import WinnerSlider from '@/components/ui/WinnerSlider';
import FaqAccordion from '@/components/ui/FaqAccordion';

export async function generateStaticParams() {
  try {
    const events = await fetchEvents();
    if (!events || !Array.isArray(events)) return [];
    return events.filter(e => e?.slug).map((event) => ({
      slug: event.slug,
    }));
  } catch (error) {
    console.error('generateStaticParams error:', error);
    return [];
  }
}

export default async function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const event = await fetchEventBySlug(resolvedParams.slug);

  if (!event) {
    notFound();
  }

  // Determine if registration should be disabled
  const canRegister = event.status === 'open' || event.status === 'upcoming';
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
              <div className="inline-block mb-6 rounded-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-bold px-6 py-2 text-[11px] tracking-[0.2em] uppercase shadow-[0_4px_15px_rgba(198,161,91,0.2)]">
                {event.status === 'open' ? 'Registration Open' : event.status === 'upcoming' ? 'Upcoming Championship' : 'Registration Closed'}
              </div>
              
              <h1 className="font-heading text-5xl md:text-6xl lg:text-[72px] uppercase leading-[0.95] tracking-tight mb-6 drop-shadow-lg font-bold">
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
              
              <h2 className="font-heading text-xl md:text-2xl text-wff-gold uppercase tracking-[0.2em] mb-10 font-bold drop-shadow-sm">
                {event.subtitle}
              </h2>
              
              <div className="flex flex-col sm:flex-row flex-wrap items-center md:items-start gap-6 text-[13px] tracking-widest font-bold uppercase text-white/90 justify-center md:justify-start">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-wff-gold shrink-0" />
                  <span>{event.event_day ? `${event.event_day}, ` : ''}{event.event_date}</span>
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

            {/* Categories Section */}
            {event.categories && event.categories.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Trophy size={24} className="text-wff-gold" />
                  <h3 className="font-heading text-3xl uppercase tracking-wider text-wff-text-primary">
                    Categories
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.categories.map((category) => (
                    <div key={category.id} className="bg-wff-surface border border-wff-border p-8 rounded-sm shadow-sm relative overflow-hidden flex flex-col h-full hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
                      {category.availability === 'closed' && (
                         <div className="absolute top-0 right-0 bg-wff-navy text-white text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 shadow-sm z-10">
                           Closed
                         </div>
                      )}
                      
                      <div className="mb-6">
                        <h4 className="font-heading text-2xl text-wff-text-primary uppercase tracking-wide leading-tight mb-2 pr-16">{category.name}</h4>
                        <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-wff-gold">
                          {category.structure_type === 'single' ? 'Single Category' : category.structure_type === 'weight' ? 'Weight Classes' : 'Height Classes'}
                          {category.short_description ? ` · ${category.short_description}` : ''}
                        </div>
                      </div>

                      <div className="mb-8 flex-grow">
                        <ul className="space-y-3 text-sm text-wff-text-primary font-medium mb-6">
                          <li className="flex justify-between border-b border-wff-border pb-2"><span className="text-wff-muted uppercase tracking-widest text-[11px]">Gender</span> <span>{category.gender || 'Any'}</span></li>
                          <li className="flex justify-between border-b border-wff-border pb-2"><span className="text-wff-muted uppercase tracking-widest text-[11px]">Division / Age</span> <span>{category.age_group || 'Open Age'}</span></li>
                        </ul>
                        
                        {category.structure_type === 'weight' && category.weight_divisions && category.weight_divisions.length > 0 && (
                          <div className="bg-black/5 dark:bg-black/20 p-4 rounded-sm text-[13px] text-wff-text-primary leading-relaxed border border-wff-border font-medium">
                            <strong className="block text-[10px] uppercase tracking-[0.2em] text-wff-muted mb-2">Weight Classes</strong>
                            {category.weight_divisions.join(' · ')}
                          </div>
                        )}

                        {category.structure_type === 'height' && category.height_divisions && category.height_divisions.length > 0 && (
                          <div className="bg-black/5 dark:bg-black/20 p-4 rounded-sm text-[13px] text-wff-text-primary leading-relaxed border border-wff-border font-medium">
                            <strong className="block text-[10px] uppercase tracking-[0.2em] text-wff-muted mb-2">Height Classes</strong>
                            {category.height_divisions.join(' · ')}
                          </div>
                        )}
                      </div>

                      <div className="mt-auto border-t border-wff-border pt-6">
                        <div className="mb-4">
                          <div className="font-heading text-2xl font-bold text-wff-text-primary">₹{category.entry_fee || '0'}</div>
                          <div className="text-[10px] uppercase font-bold text-wff-muted tracking-[0.2em] mt-1">Base Entry Fee</div>
                        </div>
                        
                        <div className="flex justify-between items-center bg-black/5 dark:bg-black/20 p-3 rounded-sm border border-wff-border">
                          <span className="text-[10px] font-bold text-wff-muted uppercase tracking-[0.15em]">Additional Category</span>
                          <span className="text-sm font-bold text-wff-gold">₹{(parseFloat(category.entry_fee || '0') * 0.5).toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Event Officials */}
            {event.officials && event.officials.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Star size={24} className="text-wff-gold" />
                  <h3 className="font-heading text-3xl uppercase tracking-wider text-wff-text-primary">
                    Special Guests & Judges
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {event.officials.map((official: any, idx: number) => (
                    <div key={official.official_id || idx} className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(201,164,74,0.15)] transition-all duration-500 hover:-translate-y-2 cursor-default">
                      {/* Portrait - Top Image */}
                      <div className="relative w-full aspect-[4/5] bg-wff-navy overflow-hidden">
                        <img 
                          src={resolveImageUrl(official.photo) || '/assets/wff-india.png'} 
                          alt={official.name} 
                          className="w-full h-full object-cover object-top opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                        />
                        {/* Subtle gradient overlay */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>

                      {/* Info - Bottom Content */}
                      <div className="flex flex-col flex-grow items-center text-center p-6 bg-white relative z-10">
                        {/* Decorative Gold Accent Line */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#C9A44A] rounded-b-md transform origin-top transition-transform duration-500 group-hover:scale-x-150" />
                        
                        <span className="font-heading font-bold text-[9px] xl:text-[10px] tracking-[0.2em] uppercase text-[#C9A44A] mb-4 mt-2 bg-[#FDF8E7] px-3 py-1.5 rounded-sm">
                          {official.role}
                        </span>
                        <h5 className="font-heading font-extrabold text-[18px] xl:text-[20px] uppercase text-[#040A12] leading-[1.1] mb-2">
                          {official.name}
                        </h5>
                        {official.designation && (
                          <p className="font-heading font-semibold text-[#040A12]/50 text-[10px] xl:text-[11px] uppercase tracking-[0.15em] leading-[1.6] max-w-[90%] mb-4">
                            {official.designation}
                          </p>
                        )}

                        {(official.instagram_url || official.facebook_url) && (
                          <div className="flex gap-4 mt-auto text-[#040A12]/30 justify-center items-center w-full border-t border-black/5 pt-4">
                            {official.instagram_url && (
                              <a href={official.instagram_url} target="_blank" rel="noopener noreferrer" aria-label={`${official.name} Instagram`} className="hover:text-[#C9A44A] transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                              </a>
                            )}
                            {official.facebook_url && (
                              <a href={official.facebook_url} target="_blank" rel="noopener noreferrer" aria-label={`${official.name} Facebook`} className="hover:text-[#C9A44A] transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
              />
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
