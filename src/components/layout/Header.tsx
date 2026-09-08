"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon } from 'lucide-react';

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Association", href: "/association" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)]/95 backdrop-blur-sm border-b border-[var(--border-color)]">
      <div className="max-w-[1440px] mx-auto px-6 h-[72px] flex items-center justify-between">

        {/* Spacer for perfect desktop centering */}
        <div className="hidden lg:block flex-1"></div>

        {/* Mobile Left Logo */}
        <Link href="/" className="flex lg:hidden items-center gap-3 shrink-0">
          <img
            src="/assets/wff-india.png"
            alt="WFF Tamil Nadu"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Center Cluster (Logo + Nav + Logo) */}
        <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 shrink-0">
          {/* Left WFF TN Logo */}
          <Link href="/" className="shrink-0">
            <img
              src="/assets/wff-india.png"
              alt="WFF Tamil Nadu"
              className="h-[68px] w-auto object-contain"
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display font-bold text-[15px] tracking-[0.10em] uppercase px-3 py-2 text-[var(--text-primary)] hover:text-[var(--gold)] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right WFF International Logo */}
          <img
            src="/assets/wff-international.png"
            alt="WFF International"
            className="h-[58px] w-auto object-contain shrink-0"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-4 flex-1">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 flex items-center justify-center text-[var(--muted)] hover:text-[var(--gold)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
          </button>

          {/* Register CTA */}
          <Link
            href="/register"
            className="hidden md:inline-flex items-center h-10 px-6 bg-[var(--navy)] text-white text-[13.5px] font-display font-bold tracking-[0.12em] uppercase rounded hover:bg-[var(--gold)] hover:text-[var(--navy)] transition-all duration-200"
          >
            Register
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center text-[var(--text-primary)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-[var(--surface)] z-50">
          <div className="h-full flex flex-col px-6 pt-8">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-4 py-4 border-b border-[var(--border-color)] group"
                >
                  <span className="font-display text-[11px] tracking-[0.12em] text-[var(--gold)] font-medium">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display font-semibold text-lg tracking-[0.06em] uppercase text-[var(--text-primary)] group-hover:text-[var(--gold)] transition-colors">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto pb-8">
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center h-12 w-full bg-[var(--navy)] text-white font-display font-semibold text-sm tracking-[0.12em] uppercase rounded hover:bg-[var(--gold)] hover:text-[var(--navy)] transition-all"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
