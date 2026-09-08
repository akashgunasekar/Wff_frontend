import Link from 'next/link';
import Image from 'next/image';
import { getSiteSettings } from '@/lib/api';

const exploreLinks = [
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Association", href: "/association" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export async function Footer() {
  const settings = await getSiteSettings();
  const siteName = settings.site_name || "WFF Tamil Nadu";

  return (
    <footer className="bg-[#040A12] text-white/80 border-t border-[#C9A44A]/10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">

          {/* Col 1 — Federation */}
          <div className="lg:col-span-1 pr-4">
            <div className="flex flex-col gap-5 mb-6">
              <div className="flex items-center gap-5">
                <Image src="/assets/wff-international.png" alt="WFF International" width={80} height={80} className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md hover:scale-105 transition-transform" />
                <Image src="/assets/wff-india.png" alt="WFF India" width={80} height={80} className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md hover:scale-105 transition-transform" />
              </div>
              <div>
                <div className="font-heading font-bold text-lg md:text-xl tracking-wide uppercase text-white leading-tight mb-1">
                  WFF Tamil Nadu
                </div>
                <div className="font-heading font-semibold text-[11px] md:text-[12px] tracking-[0.15em] uppercase text-[#C9A44A]">
                  World Fitness Federation
                </div>
              </div>
            </div>
            <p className="font-body text-[14px] md:text-[15px] text-white/70 leading-[1.7] max-w-sm">
              The official state chapter of World Fitness Federation, dedicated to promoting natural, drug-free bodybuilding championships.
            </p>
          </div>

          {/* Col 2 — Explore */}
          <div>
            <h4 className="font-heading font-bold text-[13px] md:text-[14px] tracking-[0.15em] uppercase text-[#C9A44A] mb-6">
              Explore
            </h4>
            <nav className="flex flex-col gap-3.5">
              {exploreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-[15px] text-white/80 hover:text-[#C9A44A] hover:translate-x-1 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <h4 className="font-heading font-bold text-[13px] md:text-[14px] tracking-[0.15em] uppercase text-[#C9A44A] mb-6">
              Contact
            </h4>
            <div className="flex flex-col gap-3.5 font-body text-[15px] text-white/80">
              {settings.phone && (
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-[#C9A44A] transition-colors">
                  {settings.phone}
                </a>
              )}
              {settings.contact_email && (
                <a href={`mailto:${settings.contact_email}`} className="hover:text-[#C9A44A] transition-colors">
                  {settings.contact_email}
                </a>
              )}
              {settings.contact_address && (
                <p className="text-white/60 leading-relaxed whitespace-pre-wrap mt-2">
                  {settings.contact_address}
                </p>
              )}
            </div>
          </div>

          {/* Col 4 — Connect */}
          <div>
            <h4 className="font-heading font-bold text-[13px] md:text-[14px] tracking-[0.15em] uppercase text-[#C9A44A] mb-6">
              Connect
            </h4>
            <div className="flex flex-col gap-3.5">
              {settings.whatsapp_url && settings.whatsapp_url !== '#' && (
                <a
                  href={settings.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 font-body text-[15px] text-white/80 hover:text-[#C9A44A] hover:translate-x-1 transition-all"
                >
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
              )}
              {settings.instagram_url && settings.instagram_url !== '#' && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 font-body text-[15px] text-white/80 hover:text-[#C9A44A] hover:translate-x-1 transition-all"
                >
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  Instagram
                </a>
              )}
              {settings.facebook_url && settings.facebook_url !== '#' && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 font-body text-[15px] text-white/80 hover:text-[#C9A44A] hover:translate-x-1 transition-all"
                >
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </a>
              )}
              {settings.youtube_url && settings.youtube_url !== '#' && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 font-body text-[15px] text-white/80 hover:text-[#C9A44A] hover:translate-x-1 transition-all"
                >
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.086 0 12 0 12s0 3.914.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.914 24 12 24 12s0-3.914-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  YouTube
                </a>
              )}
              {settings.website_url && settings.website_url !== '#' && (
                <a
                  href={settings.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 font-body text-[15px] text-white/80 hover:text-[#C9A44A] hover:translate-x-1 transition-all"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-[13px] text-white/50">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <p className="font-body text-[13px] text-white/40">
            World Fitness Federation — Tamil Nadu Chapter
          </p>
        </div>
      </div>
    </footer>
  );
}
