"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Search, Loader2, FileText, ChevronLeft, ChevronRight, Trash, Download } from 'lucide-react';

interface RegistrationList {
  id: number;
  registration_number: string;
  athlete_name: string;
  phone: string;
  email: string;
  registration_status: string;
  payment_status: string;
  payment_method: string;
  event_name: string;
  category_name: string;
  created_at: string;
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [eventId, setEventId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [pagination, setPagination] = useState({ total: 0, total_pages: 1 });

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        status,
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        event_id: eventId,
        from_date: fromDate,
        to_date: toDate
      });
      
      const res = await fetch(`${API_BASE}/admin/registrations/index.php?${params.toString()}`, {
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error(res.status === 401 ? 'Unauthorized' : 'Failed to fetch');
      
      const json = await res.json();
      if (json.success) {
        setRegistrations(json.data.registrations);
        setPagination(json.data.pagination);
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status, paymentStatus, paymentMethod, eventId, fromDate, toDate]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${API_BASE}/admin/events/index.php`, { credentials: 'include' });
        const json = await res.json();
        if (json.success) setEvents(json.data);
      } catch (err) {
        console.error("Failed to load events for filter", err);
      }
    };
    fetchEvents();
  }, []);

  const handleExport = () => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    const params = new URLSearchParams({
      status,
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      event_id: eventId,
      from_date: fromDate,
      to_date: toDate
    });
    
    // Trigger download
    window.location.href = `${API_BASE}/admin/registrations/export.php?${params.toString()}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRegistrations();
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    payment_pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const paymentColors: Record<string, string> = {
    created: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    authorized: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    captured: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    refunded: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the registration for "${name}"? This action cannot be undone.`)) return;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/registrations/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      fetchRegistrations();
    } catch (err: any) {
      setError(err.message || 'Failed to delete registration');
    }
  };

  const handleCollectCash = async (id: number, name: string) => {
    if (!window.confirm(`Confirm that WFF staff has physically received cash for "${name}"? This will mark the registration as Paid.`)) return;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/registrations/collect-cash.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      fetchRegistrations();
    } catch (err: any) {
      setError(err.message || 'Failed to collect cash');
    }
  };

  return (
    <AdminShell title="Registrations">
      <div className="bg-[var(--surface)] border border-[var(--border-color)] p-4 md:p-6 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] w-4 h-4" />
              <Input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Name, Phone, Email, Reg #" 
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Registration</label>
            <Select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="payment_pending">Payment Pending</option>
              <option value="paid">Paid</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
          
          <div className="w-full md:w-48">
            <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Payment</label>
            <Select value={paymentStatus} onChange={e => { setPaymentStatus(e.target.value); setPage(1); }}>
              <option value="">All Payments</option>
              <option value="created">Created</option>
              <option value="authorized">Authorized</option>
              <option value="captured">Captured</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </Select>
          </div>
          
          <div className="w-full md:w-48">
            <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Event</label>
            <Select value={eventId} onChange={e => { setEventId(e.target.value); setPage(1); }}>
              <option value="">All Events</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.event_name}</option>
              ))}
            </Select>
          </div>
          
          <div className="w-full md:w-48">
            <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Payment Method</label>
            <Select value={paymentMethod} onChange={e => { setPaymentMethod(e.target.value); setPage(1); }}>
              <option value="">All Methods</option>
              <option value="online">Online (Razorpay)</option>
              <option value="cash">Cash</option>
            </Select>
          </div>
          
          <div className="w-full md:w-36">
            <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">From Date</label>
            <Input type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setPage(1); }} />
          </div>
          
          <div className="w-full md:w-36">
            <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">To Date</label>
            <Input type="date" value={toDate} onChange={e => { setToDate(e.target.value); setPage(1); }} />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button type="submit" variant="primary" className="flex-1 md:flex-none uppercase tracking-widest text-xs h-10 px-6">
              Apply
            </Button>
            <Button type="button" variant="secondary" onClick={handleExport} className="flex-1 md:flex-none uppercase tracking-widest text-xs h-10 px-4 border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-4 mb-6 rounded text-sm">
          {error}
        </div>
      )}

      <div className="bg-[var(--surface)] border border-[var(--border-color)] overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <FileText className="w-12 h-12 text-[var(--muted)] mb-4 opacity-50" />
            <h3 className="font-display text-lg uppercase tracking-widest text-[var(--text-primary)] mb-2">No Registrations Yet</h3>
            <p className="text-[var(--muted)] text-sm max-w-md">
              Athlete registrations will appear here when competitors submit the official registration form.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
                    <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Reg #</th>
                    <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Athlete</th>
                    <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Event / Category</th>
                    <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Status</th>
                    <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Payment</th>
                    <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)] text-sm">
                  {registrations.map(reg => (
                    <tr key={reg.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-display font-medium text-[var(--text-primary)]">{reg.registration_number}</div>
                        <div className="text-[10px] text-[var(--muted)]">{new Date(reg.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-[var(--text-primary)]">{reg.athlete_name}</div>
                        <div className="text-[11px] text-[var(--muted)]">{reg.phone}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-[var(--text-primary)] truncate max-w-[200px]">{reg.event_name}</div>
                        <div className="text-[11px] text-[var(--muted)]">{reg.category_name}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${statusColors[reg.registration_status] || 'bg-gray-100 text-gray-800'}`}>
                          {reg.registration_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${reg.payment_status ? (paymentColors[reg.payment_status] || 'bg-gray-100 text-gray-800') : 'bg-gray-100/50 text-gray-500'}`}>
                          {reg.payment_status ? reg.payment_status : 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {reg.payment_method === 'cash' && reg.payment_status === 'created' && (
                            <Button onClick={() => handleCollectCash(reg.id, reg.athlete_name)} className="text-[10px] bg-yellow-500 hover:bg-yellow-600 text-white uppercase tracking-widest h-8 px-3">
                              Collect Cash
                            </Button>
                          )}
                          <Link href={`/admin/registrations/${reg.id}`}>
                            <Button variant="secondary" className="text-xs uppercase tracking-widest h-8 px-4">
                              View
                            </Button>
                          </Link>
                          <Button 
                            variant="secondary"
                            className="text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white h-8 w-8 p-0 bg-red-500/10"
                            onClick={() => handleDelete(reg.id, reg.athlete_name)}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Records */}
            <div className="block md:hidden divide-y divide-[var(--border-color)]">
              {registrations.map(reg => (
                <div key={reg.id} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-display font-medium text-[var(--text-primary)] mb-1">{reg.registration_number}</div>
                      <div className="text-[10px] text-[var(--muted)]">{new Date(reg.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="flex gap-2">
                      {reg.payment_method === 'cash' && reg.payment_status === 'created' && (
                        <Button onClick={() => handleCollectCash(reg.id, reg.athlete_name)} className="text-[9px] bg-yellow-500 hover:bg-yellow-600 text-white uppercase tracking-widest h-7 px-2">
                          Collect
                        </Button>
                      )}
                      <Link href={`/admin/registrations/${reg.id}`}>
                        <Button variant="secondary" className="text-[10px] uppercase tracking-widest h-7 px-3">
                          View
                        </Button>
                      </Link>
                      <Button 
                        variant="secondary"
                        className="text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white h-7 w-7 p-0 bg-red-500/10"
                        onClick={() => handleDelete(reg.id, reg.athlete_name)}
                      >
                        <Trash size={12} />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-[var(--text-primary)] text-sm">{reg.athlete_name}</div>
                    <div className="text-xs text-[var(--muted)]">{reg.phone}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-[var(--text-primary)] truncate">{reg.event_name}</div>
                    <div className="text-xs text-[var(--muted)]">{reg.category_name}</div>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <span className={`inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm ${statusColors[reg.registration_status] || 'bg-gray-100 text-gray-800'}`}>
                      {reg.registration_status.replace('_', ' ')}
                    </span>
                    <span className={`inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm ${reg.payment_status ? (paymentColors[reg.payment_status] || 'bg-gray-100 text-gray-800') : 'bg-gray-100/50 text-gray-500'}`}>
                      {reg.payment_status ? reg.payment_status : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between bg-black/5 dark:bg-white/5">
              <div className="flex items-center gap-4">
                <span className="text-xs text-[var(--muted)] uppercase tracking-wider">Rows per page:</span>
                <Select value={limit.toString()} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }} className="h-8 w-20 text-xs">
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Select>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-xs text-[var(--muted)] uppercase tracking-wider">
                  Page {page} of {pagination.total_pages || 1} ({pagination.total} total)
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    className="h-8 w-8 p-0" 
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="h-8 w-8 p-0" 
                    disabled={page >= pagination.total_pages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
