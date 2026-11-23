import { Container } from '@/components/ui/Container';
import { MapPin, Phone, Mail, Map } from 'lucide-react';
import ContactForm from './ContactForm';
import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/api';

const InstagramIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const YoutubeIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.13 1 12 1 12s0 3.87.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.87 23 12 23 12s0-3.87-.46-5.58z"></path>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
  </svg>
);

const WebsiteIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

export const metadata: Metadata = {
  title: 'Contact Us | WFF Tamil Nadu',
  description: 'Get in touch with the World Fitness Federation Tamil Nadu branch.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col min-h-screen bg-wff-bg md:pb-32 pb-10">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden border-b border-wff-border bg-wff-deep-navy">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-wff-navy via-[#030810] to-black opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/assets/hero-pattern.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 text-center px-6 md:mt-16 mt-8 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 border border-wff-gold/30 bg-wff-gold/10 text-wff-gold text-[11px] sm:text-[13px] font-heading font-bold tracking-[2px] uppercase mb-6 rounded-full leading-[1.4]">
            Federation Support
          </div>
          <h1 className="font-heading text-[clamp(36px,4.5vw,64px)] text-white uppercase leading-[0.95] mb-4 tracking-[-1px] font-black drop-shadow-xl animate-fade-up">
            Get In <span className="text-wff-gold">Touch</span>
          </h1>
          <p className="font-body text-wff-muted text-[15px] sm:text-[16px] max-w-[650px] mx-auto font-normal leading-[1.6] animate-fade-up [animation-delay:150ms]">
            Have a question about an upcoming championship or membership? The WFF Tamil Nadu board is here to assist.
          </p>
        </div>
      </section>

      <Container className="md:mt-24 mt-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-24">

          {/* Contact Information Side */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="font-heading text-[clamp(28px,3vw,36px)] uppercase leading-[1.05] tracking-tight text-wff-text-primary mb-3 font-extrabold">Headquarters</h2>
              <p className="text-wff-text-body font-body font-normal text-[15px] leading-[1.6] max-w-md">
                Reach out to the official WFF Tamil Nadu board. We aim to respond to all inquiries within 24-48 business hours.
              </p>
            </div>

            <div className="grid gap-6">
              {settings.contact_address && (
                <div className="bg-wff-surface border border-wff-border md:p-8 p-5 rounded-xl flex items-start gap-5 hover:border-wff-navy/30 transition-colors shadow-sm group">
                  <div className="w-12 h-12 rounded-full bg-wff-bg shrink-0 flex items-center justify-center border border-wff-border group-hover:border-wff-gold/50 transition-colors">
                    <MapPin className="text-wff-gold" size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading text-[18px] sm:text-[20px] uppercase tracking-[1px] text-wff-text-primary mb-1 font-bold">Registered Address</h4>
                    <p className="font-body text-wff-muted font-normal leading-[1.6] whitespace-pre-wrap text-[14px] sm:text-[15px]">
                      {settings.contact_address}
                    </p>
                  </div>
                </div>
              )}

              {settings.phone && (
                <div className="bg-wff-surface border border-wff-border md:p-8 p-5 rounded-xl flex items-start gap-5 hover:border-wff-navy/30 transition-colors shadow-sm group">
                  <div className="w-12 h-12 rounded-full bg-wff-bg shrink-0 flex items-center justify-center border border-wff-border group-hover:border-wff-gold/50 transition-colors">
                    <Phone className="text-wff-gold" size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading text-[18px] sm:text-[20px] uppercase tracking-[1px] text-wff-text-primary mb-1 font-bold">Phone</h4>
                    <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="font-body text-[15px] font-semibold text-wff-text-primary hover:text-wff-gold transition-colors block">
                      {settings.phone}
                    </a>
                  </div>
                </div>
              )}

              {settings.contact_email && (
                <div className="bg-wff-surface border border-wff-border md:p-8 p-5 rounded-xl flex items-start gap-5 hover:border-wff-navy/30 transition-colors shadow-sm group">
                  <div className="w-12 h-12 rounded-full bg-wff-bg shrink-0 flex items-center justify-center border border-wff-border group-hover:border-wff-gold/50 transition-colors">
                    <Mail className="text-wff-gold" size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading text-[18px] sm:text-[20px] uppercase tracking-[1px] text-wff-text-primary mb-1 font-bold">Email Address</h4>
                    <a href={`mailto:${settings.contact_email}`} className="font-body text-[15px] font-semibold text-wff-text-primary hover:text-wff-gold transition-colors block">
                      {settings.contact_email}
                    </a>
                  </div>
                </div>
              )}

              {settings.contact_map_url && settings.contact_map_url !== '#' && (
                <div className="bg-wff-surface border border-wff-border md:p-8 p-5 rounded-xl flex items-start gap-5 hover:border-wff-navy/30 transition-colors shadow-sm group">
                  <div className="w-12 h-12 rounded-full bg-wff-bg shrink-0 flex items-center justify-center border border-wff-border group-hover:border-wff-gold/50 transition-colors">
                    <Map className="text-wff-gold" size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading text-[18px] sm:text-[20px] uppercase tracking-[1px] text-wff-text-primary mb-1 font-bold">Location Map</h4>
                    <a href={settings.contact_map_url} target="_blank" rel="noopener noreferrer" className="font-body text-[14px] font-bold text-wff-gold hover:text-wff-text-primary transition-colors block uppercase tracking-[1px] underline underline-offset-4 decoration-wff-gold/30 hover:decoration-wff-text-primary">
                      View on Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media */}
            {(settings.instagram_url || settings.facebook_url || settings.youtube_url || settings.website_url) && (
              <div className="pt-8 border-t border-wff-border">
                <h4 className="font-heading text-[18px] sm:text-[20px] uppercase tracking-[1px] text-wff-text-primary mb-4 font-bold">Follow Our Socials</h4>
                <div className="flex gap-4 flex-wrap">
                  {settings.instagram_url && settings.instagram_url !== '#' && (
                    <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 rounded-full bg-wff-surface border border-wff-border flex items-center justify-center text-wff-muted hover:text-wff-gold hover:border-wff-gold transition-all shadow-sm group">
                      <InstagramIcon size={20} className="group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                  {settings.facebook_url && settings.facebook_url !== '#' && (
                    <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-12 h-12 rounded-full bg-wff-surface border border-wff-border flex items-center justify-center text-wff-muted hover:text-wff-gold hover:border-wff-gold transition-all shadow-sm group">
                      <FacebookIcon size={20} className="group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                  {settings.youtube_url && settings.youtube_url !== '#' && (
                    <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-12 h-12 rounded-full bg-wff-surface border border-wff-border flex items-center justify-center text-wff-muted hover:text-wff-gold hover:border-wff-gold transition-all shadow-sm group">
                      <YoutubeIcon size={20} className="group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                  {settings.website_url && settings.website_url !== '#' && (
                    <a href={settings.website_url} target="_blank" rel="noopener noreferrer" aria-label="Website" className="w-12 h-12 rounded-full bg-wff-surface border border-wff-border flex items-center justify-center text-wff-muted hover:text-wff-gold hover:border-wff-gold transition-all shadow-sm group">
                      <WebsiteIcon size={20} className="group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-wff-surface border border-wff-border md:p-12 p-6 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-wff-gold"></div>
              <h3 className="font-heading text-[clamp(24px,2.5vw,32px)] uppercase leading-[1.1] text-wff-text-primary mb-8 font-extrabold">Send a Message</h3>
              <ContactForm />
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
