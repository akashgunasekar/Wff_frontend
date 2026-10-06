"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { useAdminAuth } from './AdminAuthProvider';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Trophy,
  Medal,
  Image as ImageIcon,
  Settings,
  ArrowUpRight,
  ArrowRight,
  RefreshCw,
  IndianRupee,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Layers,
  FileCheck
} from 'lucide-react';

interface RegistrationItem {
  id: number;
  registration_number: string;
  athlete_name: string;
  phone: string;
  email: string;
  city?: string;
  event_name: string;
  category_name: string;
  registration_status: string;
  payment_status?: string;
  payment_method?: string;
  total_amount?: number;
  created_at: string;
}

interface EventItem {
  id: number;
  event_name: string;
  event_date: string;
  venue: string;
  status: string;
  registration_count: number;
  category_count: number;
}

interface DashboardStats {
  active_events: number;
  total_events: number;
  total_champions: number;
  total_officials: number;
  pending_approvals_count: number;
  registrations: {
    total: number;
    payment_pending: number;
    paid: number;
    confirmed: number;
    rejected: number;
  };
  revenue?: {
    confirmed: number;
    paid: number;
    pending: number;
    total_projected: number;
  };
  recent_registrations: RegistrationItem[];
  events_summary: EventItem[];
}

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.wfftamilnadu.in/api';
      const res = await fetch(`${API_BASE}/admin/dashboard/stats.php`, { credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchStats();
  }, [user, fetchStats]);

  if (!user) return null;

  const totalRegs = stats?.registrations?.total || 0;
  const confirmedRegs = stats?.registrations?.confirmed || 0;
  const paidRegs = stats?.registrations?.paid || 0;
  const pendingRegs = stats?.registrations?.payment_pending || 0;
  const confirmedPercent = totalRegs > 0 ? Math.round((confirmedRegs / totalRegs) * 100) : 0;
  const paidPercent = totalRegs > 0 ? Math.round((paidRegs / totalRegs) * 100) : 0;

  const formatCurrency = (val?: number) => {
    if (!val) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={12} /> Confirmed
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <FileCheck size={12} /> Paid (Review)
          </span>
        );
      case 'payment_pending':
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock size={12} /> Unpaid
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <AdminShell title="Dashboard">
      {/* Welcome Banner & Quick Overview */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[var(--navy)] via-[var(--deep-navy)] to-[var(--navy)] text-white p-6 lg:p-8 rounded-xl border border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--gold)]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-display tracking-[0.2em] bg-[var(--gold)] text-black font-bold">
              Official Administration
            </span>
            <span className="text-xs text-white/60">• WFF Tamil Nadu</span>
          </div>
          <h1 className="font-display text-white text-2xl lg:text-3xl uppercase tracking-wider font-bold">
            Welcome Back, <span className="text-[var(--gold)]">{user.name || 'Admin'}</span>
          </h1>
          <p className="text-sm text-white/70 mt-1 max-w-xl">
            Live overview of athlete registrations, verified entry fees, upcoming championships, and federation records.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white rounded-lg text-xs uppercase tracking-widest font-display transition-all border border-white/10 disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-[var(--gold)]' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <Link
            href="/admin/registrations"
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black rounded-lg text-xs uppercase tracking-widest font-display font-bold transition-all shadow-md"
          >
            <Users size={14} />
            <span>Manage Athletes</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Registrations */}
        <div className="bg-[var(--surface)] border border-[var(--border-color)] p-6 rounded-xl relative overflow-hidden transition-all hover:border-[var(--gold)]/50 hover:shadow-md group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-display uppercase tracking-widest text-[var(--muted)] font-semibold">
              Total Registrations
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-[var(--gold)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={18} />
            </div>
          </div>
          <div className="font-display text-3xl lg:text-4xl font-bold text-[var(--navy)] dark:text-white mb-1">
            {loading ? '...' : totalRegs}
          </div>
          <div className="text-xs text-[var(--muted)] flex items-center gap-1.5">
            <span>Across all active championships</span>
          </div>
          <div className="mt-3 w-full bg-black/5 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[var(--gold)] h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Needs Verification (Paid Proofs) */}
        <Link
          href="/admin/registrations"
          className="bg-[var(--surface)] border border-[var(--border-color)] p-6 rounded-xl relative overflow-hidden transition-all hover:border-blue-500 hover:shadow-md group block"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-display uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5">
              <span>Paid & Proof Uploaded</span>
              {paidRegs > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              )}
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck size={18} />
            </div>
          </div>
          <div className="font-display text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-baseline gap-2">
            <span>{loading ? '...' : paidRegs}</span>
            {paidRegs > 0 && (
              <span className="text-[10px] font-sans uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-300">
                Action Required
              </span>
            )}
          </div>
          <div className="text-xs text-[var(--muted)] flex items-center justify-between">
            <span>{paidPercent}% of total</span>
            <span className="text-blue-600 dark:text-blue-400 text-[11px] font-semibold flex items-center gap-0.5">
              Verify proofs <ArrowRight size={12} />
            </span>
          </div>
          <div className="mt-3 w-full bg-black/5 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${paidPercent}%` }}></div>
          </div>
        </Link>

        {/* Confirmed Athletes */}
        <div className="bg-[var(--surface)] border border-[var(--border-color)] p-6 rounded-xl relative overflow-hidden transition-all hover:border-emerald-500/50 hover:shadow-md group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-display uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
              Confirmed Entries
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="font-display text-3xl lg:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            {loading ? '...' : confirmedRegs}
          </div>
          <div className="text-xs text-[var(--muted)] flex items-center justify-between">
            <span>Verified & Approved</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{confirmedPercent}%</span>
          </div>
          <div className="mt-3 w-full bg-black/5 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${confirmedPercent}%` }}></div>
          </div>
        </div>

        {/* Payment Pending */}
        <div className="bg-[var(--surface)] border border-[var(--border-color)] p-6 rounded-xl relative overflow-hidden transition-all hover:border-amber-500/50 hover:shadow-md group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-display uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold">
              Unpaid / Pending
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock size={18} />
            </div>
          </div>
          <div className="font-display text-3xl lg:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-1">
            {loading ? '...' : pendingRegs}
          </div>
          <div className="text-xs text-[var(--muted)] flex items-center justify-between">
            <span>Awaiting athlete payment</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              {totalRegs > 0 ? Math.round((pendingRegs / totalRegs) * 100) : 0}%
            </span>
          </div>
          <div className="mt-3 w-full bg-black/5 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all"
              style={{ width: `${totalRegs > 0 ? Math.round((pendingRegs / totalRegs) * 100) : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Shortcuts */}
      <div className="mb-8">
        <div className="text-xs uppercase font-display tracking-[0.2em] text-[var(--muted)] font-bold mb-3 px-1">
          Quick Management Shortcuts
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {[
            { label: 'Registrations', href: '/admin/registrations', icon: Users, desc: 'View & Verify' },
            { label: 'Events', href: '/admin/events', icon: Calendar, desc: 'Schedule & Venue' },
            { label: 'Categories', href: '/admin/categories', icon: Trophy, desc: 'Weight & Age' },
            { label: 'Champions', href: '/admin/champions', icon: Medal, desc: 'Hall of Fame' },
            { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon, desc: 'Photos & Media' },
            { label: 'Settings', href: '/admin/settings', icon: Settings, desc: 'Config & Fees' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="bg-[var(--surface)] border border-[var(--border-color)] hover:border-[var(--gold)] p-4 rounded-xl flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-sm group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--navy)]/5 dark:bg-white/5 text-[var(--navy)] dark:text-[var(--gold)] flex items-center justify-center group-hover:bg-[var(--gold)] group-hover:text-black transition-colors">
                    <Icon size={16} />
                  </div>
                  <ArrowUpRight size={14} className="text-[var(--muted)] group-hover:text-[var(--gold)] transition-colors" />
                </div>
                <div>
                  <div className="font-display text-sm uppercase tracking-wider font-bold text-[var(--text-primary)]">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-[var(--muted)] truncate">
                    {item.desc}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Dual Grid: Recent Registrations & Active Championships */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Live Registrations Stream */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
              <div>
                <h2 className="font-display text-lg uppercase tracking-wider font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Sparkles size={16} className="text-[var(--gold)]" />
                  Recent Athlete Registrations
                </h2>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Latest entries received for upcoming competitions
                </p>
              </div>
              <Link
                href="/admin/registrations"
                className="text-xs uppercase font-display tracking-widest font-bold text-[var(--gold)] hover:underline flex items-center gap-1"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm text-[var(--muted)]">
                Loading registrations stream...
              </div>
            ) : !stats?.recent_registrations || stats.recent_registrations.length === 0 ? (
              <div className="p-12 text-center text-sm text-[var(--muted)]">
                No recent registrations recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-[10px] font-display uppercase tracking-widest text-[var(--muted)] bg-black/[0.01]">
                      <th className="py-3.5 px-4 font-semibold">Athlete</th>
                      <th className="py-3.5 px-4 font-semibold">Event & Category</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)] text-xs">
                    {stats.recent_registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[var(--text-primary)] text-sm">
                            {reg.athlete_name}
                          </div>
                          <div className="text-[11px] text-[var(--muted)] flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[var(--gold)]">{reg.registration_number}</span>
                            {reg.phone && <span>• {reg.phone}</span>}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 max-w-[220px]">
                          <div className="font-medium text-[var(--text-primary)] truncate">
                            {reg.category_name || 'General'}
                          </div>
                          <div className="text-[11px] text-[var(--muted)] truncate">
                            {reg.event_name}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getStatusBadge(reg.registration_status)}
                          <div className="text-[10px] text-[var(--muted)] mt-1">
                            {formatDate(reg.created_at)}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <Link
                            href={`/admin/registrations`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[var(--navy)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black font-display text-[11px] uppercase tracking-wider font-bold transition-colors"
                          >
                            Review <ChevronRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Active Events & Federation Vitality */}
        <div className="space-y-6">
          {/* Active Events Overview */}
          <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
              <h2 className="font-display text-base uppercase tracking-wider font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Calendar size={16} className="text-[var(--gold)]" />
                Active Competitions
              </h2>
              <Link
                href="/admin/events"
                className="text-xs uppercase font-display tracking-widest font-bold text-[var(--gold)] hover:underline"
              >
                Manage
              </Link>
            </div>

            <div className="p-5 space-y-4">
              {loading ? (
                <div className="text-center py-6 text-sm text-[var(--muted)]">
                  Loading events...
                </div>
              ) : !stats?.events_summary || stats.events_summary.length === 0 ? (
                <div className="text-center py-6 text-sm text-[var(--muted)]">
                  No events found. Create one from the Events tab.
                </div>
              ) : (
                stats.events_summary.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-lg border border-[var(--border-color)] bg-black/[0.01] dark:bg-white/[0.01] hover:border-[var(--gold)]/60 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display text-sm uppercase font-bold text-[var(--text-primary)] line-clamp-1">
                        {evt.event_name}
                      </h3>
                      <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-display uppercase tracking-wider bg-[var(--navy)] text-[var(--gold)] font-bold">
                        {evt.status || 'Active'}
                      </span>
                    </div>

                    <div className="text-xs text-[var(--muted)] flex items-center gap-1.5 mb-3">
                      <Calendar size={13} className="shrink-0 text-[var(--gold)]" />
                      <span>{formatDate(evt.event_date)}</span>
                      {evt.venue && <span className="truncate">• {evt.venue}</span>}
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border-color)]/60 text-xs">
                      <span className="text-[var(--muted)]">Registrations</span>
                      <span className="font-display text-sm font-bold text-[var(--navy)] dark:text-white">
                        {evt.registration_count} Athletes
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Federation System Status & Database Counters */}
          <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl p-5 shadow-sm">
            <h2 className="font-display text-base uppercase tracking-wider font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[var(--gold)]" />
              Federation Portal Metrics
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-color)]">
                <div className="text-[10px] font-display uppercase tracking-wider text-[var(--muted)] mb-1">
                  Hall of Champions
                </div>
                <div className="font-display text-2xl font-bold text-[var(--gold)]">
                  {stats?.total_champions ?? 0}
                </div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5">Title winners</div>
              </div>

              <div className="p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-color)]">
                <div className="text-[10px] font-display uppercase tracking-wider text-[var(--muted)] mb-1">
                  Active Officials
                </div>
                <div className="font-display text-2xl font-bold text-[var(--navy)] dark:text-white">
                  {stats?.total_officials ?? 0}
                </div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5">Judges & Execs</div>
              </div>

              <div className="p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-color)]">
                <div className="text-[10px] font-display uppercase tracking-wider text-[var(--muted)] mb-1">
                  Total Events
                </div>
                <div className="font-display text-2xl font-bold text-[var(--navy)] dark:text-white">
                  {stats?.total_events ?? 0}
                </div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5">Competitions</div>
              </div>

              <div className="p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-color)]">
                <div className="text-[10px] font-display uppercase tracking-wider text-[var(--muted)] mb-1">
                  System Status
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Online</span>
                </div>
                <div className="text-[11px] text-[var(--muted)] mt-1">WFF Portal v2.0</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--muted)]">
              <span>Admin: {user.email}</span>
              <span className="uppercase font-display tracking-wider text-[10px] px-2 py-0.5 rounded bg-[var(--gold)]/10 text-[var(--gold)] font-bold">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
