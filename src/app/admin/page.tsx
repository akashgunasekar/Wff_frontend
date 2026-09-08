"use client";

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { useAdminAuth } from './AdminAuthProvider';
import { LayoutDashboard, Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${API_BASE}/admin/dashboard/stats.php`, { credentials: 'include' });
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchStats();
  }, [user]);

  if (!user) return null;

  return (
    <AdminShell title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Registrations', value: stats?.registrations?.total },
          { label: 'Payment Pending', value: stats?.registrations?.payment_pending },
          { label: 'Paid', value: stats?.registrations?.paid },
          { label: 'Confirmed', value: stats?.registrations?.confirmed },
        ].map((stat, i) => (
          <div key={i} className="bg-[var(--surface)] border border-[var(--border-color)] p-6">
            <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-2">{stat.label}</div>
            <div className="font-display text-4xl text-[var(--navy)] dark:text-white">
              {loading ? <Loader2 size={24} className="animate-spin text-[var(--muted)]" /> : (stat.value !== undefined ? stat.value : '—')}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border-color)] p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
        <LayoutDashboard size={48} className="text-[var(--border-color)] mb-4" strokeWidth={1} />
        <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--text-primary)] mb-2">Welcome, {user.name}</h2>
        <p className="text-[var(--muted)] max-w-md mx-auto">
          Select a module from the sidebar to manage federation data. CMS features will be activated in upcoming steps.
        </p>
      </div>
    </AdminShell>
  );
}
