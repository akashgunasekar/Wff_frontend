import Link from 'next/link';
import Image from 'next/image';
import { getSiteSettings } from '@/lib/api';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink, Lock } from 'lucide-react';

const exploreLinks = [
  { label: 'About Federation', href: '/about' },
  { label: 'Championship Events', href: '/events' },
  { label: 'Association & Board', href: '/association' },
  { label: 'Media Gallery', href: '/gallery' },
  { label: 'Contact & Support', href: '/contact' },
];

const policyLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Cancellation & Refund Policy', href: '/cancellation-refund-policy' },
  { label: 'Shipping & Delivery Policy', href: '/shipping-delivery-policy' },
  { label: 'Pricing & Registration', href: '/pricing' },
];

export async function Footer() {
  const settings = await getSiteSettings();
  const siteName = settings.site_name || 'WFF Tamil Nadu';
  const phone = settings.phone || '+91 99529 22686';
  const email = settings.contact_email || 'wfftamilnadu@gmail.com';
  const address = settings.contact_address || 'No. 7/8, Near ICICI Bank, Link Road, Kilpauk Garden Road, Shenoy Nagar, Chennai – 600030, Tamil Nadu.';

  return (
    <footer className="bg-[#040A12] text-white/80 border-t border-[#C9A44A]/20 relative overflow-hidden">
      {/* Decorative top accent glow */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C9A44A] to-transparent"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-16 lg:py-20">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">

          {/* Col 1 — Federation (Col-span 4) */}
          <div className="lg:col-span-4 pr-0 lg:pr-6">
            <div className="flex flex-col gap-5 mb-6">
              <div className="flex items-center gap-4">
                <Image
                  src="/assets/wff-international.png"
                  alt="WFF International"
                  width={75}
                  height={75}
                  className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md hover:scale-105 transition-transform"
                />
                <Image
                  src="/assets/wff-india.png"
                  alt="WFF India"
                  width={75}
                  height={75}
                  className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <div className="font-heading font-bold text-xl md:text-2xl tracking-wider uppercase text-white leading-tight mb-1">
                  WFF Tamil Nadu
                </div>
                <div className="font-heading font-semibold text-[11px] md:text-[12px] tracking-[0.2em] uppercase text-[#C9A44A]">
                  World Fitness Federation
                </div>
              </div>
            </div>
            
            <p className="font-body text-[14px] md:text-[15px] text-white/70 leading-[1.7] mb-6">
              The official state chapter of World Fitness Federation, committed to advancing natural, drug-free bodybuilding championships and athletic excellence across Tamil Nadu.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[12px] text-white/70">
              <ShieldCheck size={14} className="text-[#C9A44A]" />
              <span>Official Razorpay Verified Registration Gateway</span>
            </div>
          </div>

          {/* Col 2 — About & Events (Col-span 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold text-[13px] md:text-[14px] tracking-[0.18em] uppercase text-[#C9A44A] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A44A]"></span>
              About &amp; Events
            </h4>
            <nav className="flex flex-col gap-3">
              {exploreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-[14px] text-white/75 hover:text-[#C9A44A] hover:translate-x-1 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Legal & Policies (Col-span 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-heading font-bold text-[13px] md:text-[14px] tracking-[0.18em] uppercase text-[#C9A44A] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A44A]"></span>
              Legal &amp; Policies
            </h4>
            <nav className="flex flex-col gap-3">
              {policyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-[14px] text-white/75 hover:text-[#C9A44A] hover:translate-x-1 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4 — Support & Contact (Col-span 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-heading font-bold text-[13px] md:text-[14px] tracking-[0.18em] uppercase text-[#C9A44A] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A44A]"></span>
              Support &amp; Contact
            </h4>
            <div className="flex flex-col gap-4 font-body text-[14px] text-white/75">
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-[#C9A44A] shrink-0 mt-1" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-white/50 font-bold">Helpline</div>
                  <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-white hover:text-[#C9A44A] transition-colors font-medium">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={16} className="text-[#C9A44A] shrink-0 mt-1" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-white/50 font-bold">Inquiries &amp; Refunds</div>
                  <a href={`mailto:${email}`} className="text-white hover:text-[#C9A44A] transition-colors font-medium break-all">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#C9A44A] shrink-0 mt-1" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-white/50 font-bold">Registered Office</div>
                  <p className="text-white/60 leading-relaxed text-[13px] mt-0.5">
                    {address}
                  </p>
                </div>
              </div>

              {/* Social Icons Strip */}
              <div className="pt-3 flex items-center gap-3">
                {settings.whatsapp_url && settings.whatsapp_url !== '#' && (
                  <a
                    href={settings.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#C9A44A] hover:text-[#040A12] flex items-center justify-center text-white/70 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                )}
                {settings.instagram_url && settings.instagram_url !== '#' && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#C9A44A] hover:text-[#040A12] flex items-center justify-center text-white/70 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                )}
                {settings.facebook_url && settings.facebook_url !== '#' && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#C9A44A] hover:text-[#040A12] flex items-center justify-center text-white/70 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {settings.youtube_url && settings.youtube_url !== '#' && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#C9A44A] hover:text-[#040A12] flex items-center justify-center text-white/70 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.086 0 12 0 12s0 3.914.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.914 24 12 24 12s0-3.914-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Razorpay & Security Trust */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p className="font-body text-[13px] text-white/50">
              &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
            <span className="hidden sm:inline text-white/20">•</span>
            <p className="font-body text-[13px] text-white/40">
              World Fitness Federation — Tamil Nadu Chapter
            </p>
          </div>

          <div className="flex items-center gap-4 text-[12px] text-white/50">
            <span className="flex items-center gap-1 text-white/60">
              <Lock size={12} className="text-[#C9A44A]" /> 256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span className="text-white/60">
              Razorpay Secured Gateway
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
