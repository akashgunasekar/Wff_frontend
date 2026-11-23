"use client";

import { useState } from 'react';
import { useAdminAuth } from '@/app/admin/AdminAuthProvider';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Image as ImageIcon, 
  Medal, 
  Trophy, 
  Megaphone, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function AdminShell({ children, title }: { children: React.ReactNode, title: string }) {
  const { user, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, active: pathname === '/admin' },
    { name: 'Registrations', href: '/admin/registrations', icon: Users, active: pathname.startsWith('/admin/registrations') },
    { name: 'Events', href: '/admin/events', icon: Calendar, active: pathname.startsWith('/admin/events') },
    { name: 'Categories', href: '/admin/categories', icon: Trophy, active: pathname.startsWith('/admin/categories') },
    { name: 'Officials', href: '/admin/officials', icon: Medal, active: pathname.startsWith('/admin/officials') },
    { name: 'Champions', href: '/admin/champions', icon: Trophy, active: pathname.startsWith('/admin/champions') },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon, active: pathname.startsWith('/admin/gallery') },
    { name: 'Announcements', href: '/admin/homepage', icon: Megaphone, active: false },
    { name: 'Homepage CMS', href: '/admin/homepage', icon: LayoutDashboard, active: pathname.startsWith('/admin/homepage') },
    { name: 'Settings', href: '/admin/settings', icon: Settings, active: pathname.startsWith('/admin/settings') },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] flex w-full transition-colors duration-250">
      {/* Sidebar (Desktop) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#071A2E] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block shadow-xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="font-heading font-bold text-xs tracking-wide uppercase text-[var(--gold)] mb-1">
                WFF Tamil Nadu
              </div>
              <div className="font-heading text-xl uppercase tracking-tight text-white font-extrabold">
                Admin Panel
              </div>
            </div>
            <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex-1 py-6 px-3.5 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm tracking-wide uppercase font-heading transition-all ${
                    item.active 
                      ? 'bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-black shadow-md' 
                      : 'text-white/70 hover:text-white hover:bg-white/10 font-bold'
                  }`}
                >
                  <Icon size={17} strokeWidth={item.active ? 2.2 : 1.7} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="p-5 border-t border-white/10 bg-black/20">
            <div className="font-body text-xs text-[var(--gold)] mb-1 font-semibold tracking-label">Logged in as</div>
            <div className="font-body font-medium text-xs text-white/90 truncate mb-3">{user.email}</div>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-btn text-rose-300 hover:text-rose-200 transition-colors py-1 cursor-pointer"
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--bg)] overflow-x-hidden font-body">
        {/* Top Header */}
        <header className="h-16 bg-[var(--surface)] border-b border-[var(--border-color)] flex items-center justify-between px-4 lg:px-8 shrink-0 transition-colors shadow-xs">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-[var(--text-primary)] p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-body font-medium text-[var(--muted)]">
              <Link href="/admin" className="hover:text-[var(--gold)] transition-colors">Admin</Link>
              <ChevronRight size={13} />
              <span className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-tight-heading text-[var(--text-primary)]">{title}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* View Live Website Button */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading tracking-btn uppercase font-bold text-[var(--text-primary)] hover:text-[var(--gold)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--gold-surface)] transition-all"
            >
              <span>View Site</span>
              <ExternalLink size={12} />
            </Link>

            {/* Admin Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 flex items-center justify-center text-[var(--muted)] hover:text-[var(--gold)] transition-all rounded-lg border border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--gold-surface)]"
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to Corporate Light Dashboard" : "Switch to Midnight Dark Dashboard"}
            >
              {theme === "dark" ? (
                <Sun size={16} strokeWidth={2} className="text-[var(--gold)]" />
              ) : (
                <Moon size={16} strokeWidth={2} className="text-[var(--navy)]" />
              )}
            </button>

            {/* Role Badge */}
            <span className="font-body text-xs font-semibold tracking-label uppercase px-3 py-1 bg-[var(--navy)] text-[var(--gold)] dark:bg-white/10 dark:text-white rounded-full border border-[var(--gold)]/30">
              {user.role}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </div>
      </main>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
