"use client";

import { useState } from 'react';
import { useAdminAuth } from '@/app/admin/AdminAuthProvider';
import { Menu, X, LayoutDashboard, Users, Calendar, Image as ImageIcon, Medal, Trophy, Megaphone, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminShell({ children, title }: { children: React.ReactNode, title: string }) {
  const { user, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, active: pathname === '/admin' },
    { name: 'Registrations', href: '/admin/registrations', icon: Users, active: pathname.startsWith('/admin/registrations') },
    { name: 'Events', href: '/admin/events', icon: Calendar, active: pathname.startsWith('/admin/events') },
    { name: 'Categories', href: '/admin/categories', icon: Trophy, active: pathname.startsWith('/admin/categories') },
    { name: 'Officials', href: '/admin/officials', icon: Medal, active: false },
    { name: 'Champions', href: '/admin/champions', icon: Trophy, active: pathname.startsWith('/admin/champions') },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon, active: pathname.startsWith('/admin/gallery') },
    { name: 'Announcements', href: '#', icon: Megaphone, active: false },
    { name: 'Homepage', href: '/admin/homepage', icon: LayoutDashboard, active: pathname.startsWith('/admin/homepage') },
    { name: 'Settings', href: '/admin/settings', icon: Settings, active: pathname.startsWith('/admin/settings') },
  ];

  return (
    <div className="min-h-screen bg-[var(--surface)] flex w-full">
      {/* Sidebar (Desktop) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--navy)] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="font-display font-bold text-[10px] tracking-[0.2em] uppercase text-[var(--gold)] mb-1">
                WFF Tamil Nadu
              </div>
              <div className="font-display text-lg uppercase tracking-widest">
                Admin Panel
              </div>
            </div>
            <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return item.href === '#' ? (
                <div 
                  key={item.name}
                  className={`flex items-center gap-3 px-4 py-3 rounded text-sm tracking-wider uppercase font-display transition-colors text-white/60 hover:text-white hover:bg-white/5 cursor-not-allowed opacity-50`}
                  title="Coming Soon"
                >
                  <Icon size={18} strokeWidth={1.5} />
                  {item.name}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded text-sm tracking-wider uppercase font-display transition-colors ${
                    item.active 
                      ? 'bg-[var(--gold)] text-black font-semibold' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} strokeWidth={item.active ? 2 : 1.5} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-6 border-t border-white/10">
            <div className="text-[10px] uppercase tracking-widest text-[var(--gold)] mb-1">Logged in as</div>
            <div className="font-medium text-sm truncate mb-4">{user.email}</div>
            <button onClick={logout} className="flex items-center gap-2 text-xs uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-black/5 dark:bg-black/20 overflow-x-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[var(--surface)] border-b border-[var(--border-color)] flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-[var(--text-primary)]" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="font-display text-xl uppercase tracking-widest text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-md">{title}</h1>
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-display tracking-widest uppercase px-3 py-1 bg-[var(--navy)] text-[var(--gold)] rounded-full">
              {user.role}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
