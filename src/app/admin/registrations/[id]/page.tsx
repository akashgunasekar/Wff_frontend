"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Loader2, AlertCircle, Check, X, ShieldAlert } from 'lucide-react';

export default function AdminRegistrationDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean, action: string, status: string } | null>(null);

  useEffect(() => {
    fetchDetail();
  }, [resolvedParams.id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/registrations/show.php?id=${resolvedParams.id}`, {
        credentials: 'include'
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch registration');
      setData(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/registrations/status.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: resolvedParams.id, status: newStatus })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update status');
      
      // Refresh data
      await fetchDetail();
      setConfirmDialog(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
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

  return (
    <AdminShell title={`Registration ${data?.registration?.registration_number || ''}`}>
      <div className="mb-6">
        <Link href="/admin/registrations" className="inline-flex items-center text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft size={14} className="mr-2" /> Back to Registrations
        </Link>
      </div>

      {loading ? (
        <div className="bg-[var(--surface)] border border-[var(--border-color)] p-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-6 rounded flex items-start gap-4">
          <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display uppercase tracking-widest mb-2 font-bold">Error Loading Registration</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            {/* ATHLETE */}
            <section className="bg-[var(--surface)] border border-[var(--border-color)] p-6 md:p-8">
              <h2 className="font-display text-lg uppercase tracking-widest text-[var(--text-primary)] mb-6 border-b border-[var(--border-color)] pb-4">Athlete Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Full Name</div>
                  <div className="font-medium text-[var(--text-primary)]">{data.registration.athlete_name}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Date of Birth</div>
                  <div className="font-medium text-[var(--text-primary)]">{data.registration.date_of_birth}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Gender</div>
                  <div className="font-medium text-[var(--text-primary)]">{data.registration.gender}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Phone</div>
                  <div className="font-medium text-[var(--text-primary)]">{data.registration.phone}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Email</div>
                  <div className="font-medium text-[var(--text-primary)]">{data.registration.email || '—'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Instagram</div>
                  <div className="font-medium text-[var(--text-primary)]">{data.registration.instagram_id || '—'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Height / Weight</div>
                  <div className="font-medium text-[var(--text-primary)]">
                    {data.registration.height ? `${data.registration.height} cm` : '—'} / {data.registration.weight ? `${data.registration.weight} kg` : '—'}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Address</div>
                  <div className="font-medium text-[var(--text-primary)]">
                    {[data.registration.address, data.registration.city, data.registration.state].filter(Boolean).join(', ') || '—'}
                  </div>
                </div>
              </div>
            </section>

            {/* EVENT */}
            <section className="bg-[var(--surface)] border border-[var(--border-color)] p-6 md:p-8">
              <h2 className="font-display text-lg uppercase tracking-widest text-[var(--text-primary)] mb-6 border-b border-[var(--border-color)] pb-4">Event Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Championship</div>
                  <div className="font-medium text-[var(--text-primary)]">{data.registration.event_name}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Event Date</div>
                  <div className="font-medium text-[var(--text-primary)]">{data.registration.event_date}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Total Fee</div>
                  <div className="font-medium text-[var(--gold)]">₹{data.registration.total_amount || data.registration.entry_fee}</div>
                </div>
                
                <div className="sm:col-span-2 border-t border-[var(--border-color)] pt-6 mt-2">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-3">Categories Selected</div>
                  <ul className="space-y-2">
                    {(data.registration.categories || [data.registration.category_name]).map((c: string, idx: number) => (
                      <li key={idx} className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--gold)] inline-block"></span>
                        {c}
                      </li>
                    ))}
                  </ul>
                  
                  {data.registration.tan_spray_requested && (
                    <div className="mt-4 text-xs font-bold text-[var(--gold)] uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--gold)] inline-block"></span>
                      + TAN SPRAY REQUESTED
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* PAYMENTS */}
            <section className="bg-[var(--surface)] border border-[var(--border-color)] p-6 md:p-8">
              <h2 className="font-display text-lg uppercase tracking-widest text-[var(--text-primary)] mb-6 border-b border-[var(--border-color)] pb-4">Payment History</h2>
              
              {data.payments && data.payments.length > 0 ? (
                <div className="space-y-4">
                  {data.payments.map((p: any, i: number) => (
                    <div key={p.id} className="p-4 bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-sm text-sm">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${paymentColors[p.status] || 'bg-gray-100 text-gray-800'}`}>
                          {p.status}
                        </span>
                        <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest">{new Date(p.created_at).toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-[var(--muted)]">Order ID</span>
                          <span className="font-medium font-mono text-xs">{p.razorpay_order_id}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-[var(--muted)]">Payment ID</span>
                          <span className="font-medium font-mono text-xs">{p.razorpay_payment_id || '—'}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-[var(--muted)]">Amount</span>
                          <span className="font-medium">{p.currency} {p.amount / 100}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--muted)]">No payment records found for this registration.</p>
              )}
            </section>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* REGISTRATION STATUS */}
            <div className="bg-[var(--surface)] border border-[var(--border-color)] p-6 md:p-8">
              <h3 className="font-display text-sm uppercase tracking-widest text-[var(--text-primary)] mb-4">Registration Info</h3>
              
              <div className="mb-6">
                <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-2">Current Status</div>
                <span className={`inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm ${statusColors[data.registration.status] || 'bg-gray-100 text-gray-800'}`}>
                  {data.registration.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="space-y-4 border-t border-[var(--border-color)] pt-6">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Registration #</div>
                  <div className="font-display font-medium text-lg text-[var(--navy)] dark:text-white">{data.registration.registration_number}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Created At</div>
                  <div className="text-sm text-[var(--text-primary)]">{new Date(data.registration.created_at).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* ADMIN ACTIONS */}
            <div className="bg-[var(--surface)] border border-[var(--border-color)] p-6 md:p-8">
              <h3 className="font-display text-sm uppercase tracking-widest text-[var(--text-primary)] mb-4">Admin Actions</h3>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => setConfirmDialog({ isOpen: true, action: 'Confirm Registration', status: 'confirmed' })}
                  variant="primary" 
                  className="w-full text-xs uppercase tracking-widest h-10"
                  disabled={data.registration.status === 'confirmed'}
                >
                  Confirm Registration
                </Button>
                
                <Button 
                  onClick={() => setConfirmDialog({ isOpen: true, action: 'Cancel Registration', status: 'cancelled' })}
                  variant="secondary" 
                  className="w-full text-xs uppercase tracking-widest h-10 text-orange-600 dark:text-orange-400 hover:text-orange-700"
                  disabled={data.registration.status === 'cancelled'}
                >
                  Cancel Registration
                </Button>
                
                <Button 
                  onClick={() => setConfirmDialog({ isOpen: true, action: 'Reject Registration', status: 'rejected' })}
                  variant="secondary" 
                  className="w-full text-xs uppercase tracking-widest h-10 text-red-600 dark:text-red-400 hover:text-red-700 border-red-200 dark:border-red-900"
                  disabled={data.registration.status === 'rejected'}
                >
                  Reject Athlete
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-800 dark:text-blue-300">
                <ShieldAlert size={14} className="mb-2 inline-block" />
                <br/>
                Payment status is controlled strictly by Razorpay webhooks. Admins cannot manually force a payment state to 'Captured'.
              </div>
            </div>
          </div>

        </div>
      ) : null}

      {/* CONFIRMATION DIALOG */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border-color)] max-w-md w-full p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-display text-xl uppercase tracking-widest text-[var(--text-primary)] mb-4">{confirmDialog.action}</h3>
            
            <p className="text-sm text-[var(--text-body)] mb-6">
              You are about to change the registration status of <strong className="text-[var(--text-primary)]">{data?.registration?.athlete_name}</strong> to <strong className="uppercase">{confirmDialog.status}</strong>.
            </p>
            
            <div className="flex justify-end gap-3">
              <Button 
                onClick={() => setConfirmDialog(null)}
                variant="secondary"
                disabled={updating}
                className="text-xs uppercase tracking-widest h-10 px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => updateStatus(confirmDialog.status)}
                variant={confirmDialog.status === 'rejected' ? 'secondary' : 'primary'}
                disabled={updating}
                className={`text-xs uppercase tracking-widest h-10 px-6 ${confirmDialog.status === 'rejected' ? 'text-red-600 border-red-500' : ''}`}
              >
                {updating ? 'Saving...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
