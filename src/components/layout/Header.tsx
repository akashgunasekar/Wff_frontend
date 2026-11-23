"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, Ticket, Phone, Mail, ChevronRight } from 'lucide-react';

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Association", href: "/association" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll and capture Escape key when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--border-color)] transition-colors w-full max-w-full">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 h-[76px] sm:h-[84px] lg:h-[90px] flex items-center justify-between min-w-0">

        {/* Mobile / Tablet Brands (Screen < 1024px) */}
        <div className="flex lg:hidden items-center gap-2.5 sm:gap-3.5">
          <Link href="/" className="flex items-center shrink-0" title="WFF International">
            <img
              src="/assets/wff-international.png"
              alt="WFF International"
              className="h-11 sm:h-13 w-auto object-contain drop-shadow-sm"
            />
          </Link>
          <div className="h-6 w-px bg-[var(--border-color)] sm:h-8" />
          <Link href="/" className="flex items-center shrink-0" title="WFF India">
            <img
              src="/assets/wff-india.png"
              alt="WFF India"
              className="h-11 sm:h-13 w-auto object-contain drop-shadow-sm"
            />
          </Link>
        </div>

        {/* Desktop Navigation Group (Screen >= 1024px) */}
        {/* Left Logo before Home, Center Nav Tabs, Right Logo after Pass Status, Right Actions */}
        <div className="hidden lg:flex items-center justify-between w-full gap-4 xl:gap-8">
          
          {/* Left Logo (Before Home Tab) - Visually Bigger */}
          <Link
            href="/"
            className="flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-[var(--gold)] rounded-sm group py-1"
            title="World Fitness Federation International"
          >
            <img
              src="/assets/wff-international.png"
              alt="WFF International"
              className="h-16 lg:h-[72px] xl:h-[78px] w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Navigation Links: Home ... Pass Status */}
          <nav className="flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-body font-bold text-[14px] xl:text-[15px] tracking-normal px-2.5 xl:px-3.5 py-1.5 rounded-md transition-all duration-200 relative focus-visible:outline-2 focus-visible:outline-[var(--gold)] ${
                    isActive
                      ? 'text-[var(--gold)] font-extrabold bg-[var(--gold-surface)]'
                      : 'text-[var(--text-primary)] hover:text-[var(--gold)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[var(--gold)] rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Ticket / Stage Pass Status Link */}
            <Link
              href="/registration-status"
              className={`font-body font-bold text-[14px] xl:text-[15px] tracking-normal px-2.5 xl:px-3.5 py-1.5 rounded-md transition-all duration-200 inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[var(--gold)] ${
                pathname === '/registration-status'
                  ? 'text-[var(--gold)] font-extrabold bg-[var(--gold-surface)]'
                  : 'text-[var(--muted)] hover:text-[var(--gold)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              title="Check ticket status or download official stage pass"
            >
              <Ticket size={14} className="text-[var(--gold)]" />
              <span>Pass Status</span>
            </Link>
          </nav>

          {/* Right Logo (After Pass Status Tab) - Visually Bigger */}
          <Link
            href="/"
            className="flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-[var(--gold)] rounded-sm group py-1"
            title="World Fitness Federation India"
          >
            <img
              src="/assets/wff-india.png"
              alt="WFF India"
              className="h-16 lg:h-[72px] xl:h-[78px] w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Desktop Right Actions: Theme Toggle + Register CTA */}
          <div className="flex items-center gap-2 xl:gap-3 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-10 h-10 min-w-[42px] min-h-[42px] flex items-center justify-center text-[var(--muted)] hover:text-[var(--gold)] transition-all duration-200 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--gold-surface)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--gold)]"
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to Corporate Light Mode" : "Switch to Championship Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun size={18} strokeWidth={2} className="text-[var(--gold)] transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon size={18} strokeWidth={2} className="text-[var(--navy)] transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Register CTA (Desktop) */}
            <Link
              href="/register"
              className="inline-flex items-center justify-center h-10 px-5 xl:px-6 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] text-[14px] xl:text-[15px] font-heading font-extrabold tracking-[1px] uppercase rounded-lg shadow-sm hover:brightness-110 hover:-translate-y-[1px] hover:shadow-[0_4px_14px_rgba(201,164,74,0.3)] active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
            >
              Register Now
            </Link>
          </div>

        </div>

        {/* Mobile Right Controls: Theme Toggle + Menu Button */}
        <div className="flex lg:hidden items-center justify-end gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-[var(--muted)] hover:text-[var(--gold)] transition-all duration-200 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--gold-surface)] cursor-pointer"
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun size={18} strokeWidth={2} className="text-[var(--gold)]" />
            ) : (
              <Moon size={18} strokeWidth={2} className="text-[var(--navy)]" />
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--gold)] transition-colors rounded-lg border border-[var(--border-color)] bg-[var(--surface)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--gold)]"
            aria-label={mobileOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} strokeWidth={2.2} /> : <Menu size={22} strokeWidth={2.2} />}
          </button>
        </div>

      </div>

      {/* Accessible Mobile Drawer & Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[76px] sm:top-[84px] z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 top-[76px] sm:top-[84px] bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Drawer Container */}
          <div className="relative w-full max-w-[360px] ml-auto h-[calc(100dvh-76px)] sm:h-[calc(100dvh-84px)] bg-[var(--surface)] border-l border-[var(--border-color)] overflow-y-auto flex flex-col shadow-2xl z-10 transition-transform">
            
            {/* Header with both logos in mobile drawer */}
            <div className="flex items-center justify-center gap-4 py-4 px-5 border-b border-[var(--border-color)] bg-[var(--gold-surface)]/30">
              <img src="/assets/wff-international.png" alt="WFF International" className="h-12 w-auto object-contain drop-shadow-sm" />
              <div className="h-8 w-px bg-[var(--border-color)]" />
              <img src="/assets/wff-india.png" alt="WFF India" className="h-12 w-auto object-contain drop-shadow-sm" />
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between space-y-6">
              
              {/* Main Links */}
              <div>
                <div className="text-[11px] font-heading font-bold uppercase tracking-[2px] text-[var(--muted)] mb-3 px-3">
                  Navigation
                </div>
                <nav className="space-y-1">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-lg font-body text-[14px] font-bold tracking-normal transition-colors ${
                          isActive
                            ? 'bg-[var(--gold-surface)] text-[var(--gold)] border border-[var(--gold)]/30 font-extrabold'
                            : 'text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight size={16} className={isActive ? 'text-[var(--gold)]' : 'text-[var(--muted)] opacity-60'} />
                      </Link>
                    );
                  })}
                </nav>

                {/* Athlete Self-Service Section */}
                <div className="mt-6 pt-5 border-t border-[var(--border-color)]">
                  <div className="text-[11px] font-heading font-bold uppercase tracking-[2px] text-[var(--gold)] mb-2 px-3">
                    Athlete Self-Service
                  </div>
                  <Link
                    href="/registration-status"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-lg bg-[var(--gold-surface)] border border-[var(--gold)]/30 text-[var(--text-primary)] hover:border-[var(--gold)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Ticket size={18} className="text-[var(--gold)]" />
                      <div>
                        <div className="font-heading font-bold text-sm uppercase tracking-[0.05em] text-[var(--text-primary)]">Check Stage Pass</div>
                        <div className="font-body text-[12px] text-[var(--muted)] font-medium">Download official pass &amp; ticket</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[var(--gold)]" />
                  </Link>
                </div>
              </div>

              {/* Bottom Actions & Support */}
              <div className="pt-4 border-t border-[var(--border-color)] space-y-3">
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center h-12 w-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-[15px] tracking-[1px] uppercase rounded-lg shadow-md active:scale-[0.99] transition-all"
                >
                  Register for Championship →
                </Link>

                <div className="text-center pt-2 text-[11px] text-[var(--muted)] space-y-1 font-medium">
                  <div>Official Helpline: <a href="tel:+919952922686" className="font-bold text-[var(--text-primary)]">+91 99529 22686</a></div>
                  <div>Support: <a href="mailto:wfftamilnadu@gmail.com" className="font-bold text-[var(--text-primary)]">wfftamilnadu@gmail.com</a></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </header>
  );
}
