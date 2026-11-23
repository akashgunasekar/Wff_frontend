"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Check,
  X,
  ExternalLink,
  Eye,
  ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Mail,
  ShieldCheck,
  FileCheck,
  Calendar,
  Phone,
  Ruler,
  User,
  CreditCard
} from 'lucide-react';
import { resolveImageUrl, API_BASE } from '@/lib/api';

export default function AdminRegistrationDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modals
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  useEffect(() => {
    fetchDetail();
  }, [resolvedParams.id]);

  // Handle ESC key for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomOpen(false);
        setIsApproveOpen(false);
        setIsRejectOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/registrations/show.php?id=${resolvedParams.id}`, {
        credentials: 'include'
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch registration');
      setData(json.data);
    } catch (err: any) {
      setError(err.message || 'Error loading registration details');
    } finally {
      setLoading(false);
    }
  };

  // APPROVE PAYMENT & ISSUE TICKET
  const handleApprove = async () => {
    setActionLoading(true);
    setActionSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/admin/registrations/approve.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: resolvedParams.id })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to approve registration');
      }

      setIsApproveOpen(false);
      setActionSuccess(json.data?.email_sent 
        ? `Payment approved! Official stage pass generated and dispatched to ${data?.registration?.email || 'athlete'}.`
        : `Payment approved and stage pass generated. Note: ${json.data?.debug || 'Saved to uploads/emails'}`
      );
      await fetchDetail();
    } catch (err: any) {
      alert(err.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  // REJECT PAYMENT
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setRejectionError('Please provide a reason for rejecting the payment screenshot.');
      return;
    }
    setRejectionError('');
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/registrations/reject.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: resolvedParams.id,
          rejection_reason: rejectionReason.trim()
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to reject registration');
      }

      setIsRejectOpen(false);
      setRejectionReason('');
      setActionSuccess('Payment proof rejected. Status updated and athlete can now re-upload proof via the status portal.');
      await fetchDetail();
    } catch (err: any) {
      alert(err.message || 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  // RESEND OFFICIAL TICKET EMAIL
  const handleResendEmail = async () => {
    if (!window.confirm(`Resend the official ticket email to ${data?.registration?.email}?`)) return;
    setActionLoading(true);
    setActionSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/admin/registrations/resend-email.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: resolvedParams.id })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to resend ticket email');
      }
      setActionSuccess(json.data?.message || 'Official ticket email sent successfully!');
      alert(json.data?.message || 'Official ticket email sent successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to send email');
    } finally {
      setActionLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    payment_pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border border-yellow-500/30',
    paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-500/30',
    confirmed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/30',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
    rejected: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-500/30',
  };

  const paymentColors: Record<string, string> = {
    created: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    authorized: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400',
    captured: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
    refunded: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400',
  };

  const reg = data?.registration;
  const isApproved = reg?.status === 'confirmed' || reg?.status === 'paid';
  const isPending = reg?.status === 'payment_pending' || reg?.status === 'pending';
  const isRejected = reg?.status === 'rejected';

  const proofUrl = reg?.payment_proof ? (resolveImageUrl(reg.payment_proof) || reg.payment_proof) : null;

  return (
    <AdminShell title={`Registration ${reg?.registration_number || ''}`}>
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link
          href="/admin/registrations"
          className="inline-flex items-center text-xs font-heading font-bold uppercase tracking-btn text-[var(--muted)] hover:text-[var(--gold)] transition-colors"
        >
          <ArrowLeft size={14} className="mr-2" /> Back to Registrations
        </Link>

        {reg && (
          <div className="flex items-center gap-2">
            <Link
              href={`/registration-status?reg=${reg.registration_number}`}
              target="_blank"
              className="text-xs font-heading font-bold uppercase tracking-btn text-[var(--gold)] hover:underline inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--gold)]/40 hover:bg-[var(--gold)]/10"
            >
              <ExternalLink size={13} /> Public Status View
            </Link>
          </div>
        )}
      </div>

      {actionSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 p-4 mb-6 rounded-xl flex items-start gap-3 font-body">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
          <div className="text-sm font-medium">{actionSuccess}</div>
        </div>
      )}

      {loading ? (
        <div className="bg-[var(--surface)] border border-[var(--border-color)] p-16 rounded-2xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
          <p className="font-body text-xs font-semibold uppercase tracking-label text-[var(--muted)]">Loading Athlete Record...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-6 rounded-2xl flex items-start gap-4">
          <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-heading font-extrabold uppercase tracking-tight-heading text-lg mb-1">Error Loading Registration</h3>
            <p className="font-body text-sm">{error}</p>
          </div>
        </div>
      ) : reg ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main 2-Column Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. PAYMENT PROOF REVIEW CARD */}
            <section className="bg-[var(--surface)] border-2 border-[var(--gold)]/40 p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[var(--border-color)] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[var(--gold)]" />
                    <h2 className="font-heading text-xl uppercase tracking-tight-heading text-[var(--text-primary)] font-extrabold">
                      Payment Verification &amp; Proof
                    </h2>
                  </div>
                  <p className="font-body text-xs text-[var(--muted)] mt-1">
                    Carefully verify the athlete&apos;s UPI screenshot against the payable amount before issuing ticket.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {proofUrl ? (
                    <span className="px-3 py-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-body text-xs font-semibold uppercase tracking-label rounded-md flex items-center gap-1.5">
                      <Check size={13} /> Screenshot Available
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 font-body text-xs font-semibold uppercase tracking-label rounded-md">
                      No Proof Uploaded
                    </span>
                  )}
                </div>
              </div>

              {proofUrl ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Screenshot Thumbnail & Zoom Trigger */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div 
                      onClick={() => { setZoomScale(1); setIsZoomOpen(true); }}
                      className="group relative cursor-pointer rounded-xl overflow-hidden border-2 border-[var(--gold)]/50 bg-black/40 aspect-[3/4] w-full max-w-[280px] shadow-xl flex items-center justify-center transition-all hover:border-[var(--gold)]"
                    >
                      <img
                        src={proofUrl}
                        alt="Payment Proof"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 text-white transition-opacity">
                        <div className="p-3 rounded-full bg-[var(--gold)] text-black font-bold">
                          <ZoomIn size={22} />
                        </div>
                        <span className="font-heading font-extrabold text-xs uppercase tracking-btn">Click to Zoom Proof</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => { setZoomScale(1); setIsZoomOpen(true); }}
                      className="mt-3 w-full max-w-[280px] font-heading font-bold text-xs uppercase tracking-btn h-9 border-[var(--gold)] text-[var(--gold)]"
                    >
                      <ZoomIn size={14} className="mr-1.5" /> Inspect Large Preview
                    </Button>
                  </div>

                  {/* Verification Info & Controls */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--border-color)] space-y-3 font-body text-sm">
                      <div className="flex justify-between items-baseline border-b border-[var(--border-color)]/60 pb-2">
                        <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)]">Payable Amount</span>
                        <span className="font-heading font-black text-2xl text-[var(--gold)]">
                          ₹{reg.total_amount || reg.entry_fee || '0'}
                        </span>
                      </div>

                      <div className="flex justify-between items-baseline border-b border-[var(--border-color)]/60 pb-2">
                        <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)]">Payment Mode</span>
                        <span className="font-heading font-bold text-xs uppercase tracking-wide text-[var(--text-primary)]">
                          {reg.payment_method === 'upi' ? 'Direct UPI (QR / Link)' : reg.payment_method || 'UPI'}
                        </span>
                      </div>

                      {reg.transaction_ref && (
                        <div className="flex justify-between items-baseline border-b border-[var(--border-color)]/60 pb-2">
                          <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)]">Provided UTR / Ref</span>
                          <span className="font-mono font-bold text-xs text-[var(--text-primary)] bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded tracking-normal">
                            {reg.transaction_ref}
                          </span>
                        </div>
                      )}

                      {reg.proof_uploaded_at && (
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)]">Uploaded At</span>
                          <span className="text-xs text-[var(--muted)] font-mono">
                            {new Date(reg.proof_uploaded_at).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Rejection notice if previously rejected */}
                    {isRejected && reg.rejection_reason && (
                      <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl font-body text-xs text-rose-600 dark:text-rose-400">
                        <div className="font-semibold uppercase tracking-label mb-1 flex items-center gap-1.5">
                          <XCircle size={14} /> Rejection Reason Given:
                        </div>
                        <p>{reg.rejection_reason}</p>
                      </div>
                    )}

                    {/* Direct Quick Actions inside Proof Box */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      {!isApproved && (
                        <Button
                          type="button"
                          variant="primary"
                          onClick={() => setIsApproveOpen(true)}
                          disabled={actionLoading}
                          className="flex-1 uppercase tracking-btn font-heading font-extrabold text-xs h-11 bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                          <CheckCircle2 size={16} className="mr-2" /> Approve &amp; Issue Ticket
                        </Button>
                      )}

                      {!isRejected && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setIsRejectOpen(true)}
                          disabled={actionLoading}
                          className="uppercase tracking-btn font-heading font-bold text-xs h-11 border-rose-500/50 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                        >
                          <XCircle size={16} className="mr-2" /> Reject Screenshot
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-black/5 dark:bg-white/5 rounded-xl border border-dashed border-[var(--border-color)]">
                  <ImageIcon className="w-12 h-12 text-[var(--muted)] mx-auto mb-3 opacity-40" />
                  <p className="font-body text-sm font-semibold text-[var(--text-primary)]">No Payment Proof Uploaded</p>
                  <p className="font-body text-xs text-[var(--muted)] mt-1">
                    The athlete has submitted details but has not uploaded the UPI payment screenshot yet.
                  </p>
                </div>
              )}
            </section>

            {/* 2. ATHLETE INFORMATION (6 Required Details) */}
            <section className="bg-[var(--surface)] border border-[var(--border-color)] p-6 md:p-8 rounded-2xl">
              <div className="flex items-center gap-2 mb-6 border-b border-[var(--border-color)] pb-4">
                <User className="w-5 h-5 text-[var(--gold)]" />
                <h2 className="font-heading text-lg uppercase tracking-tight-heading text-[var(--text-primary)] font-extrabold">
                  Athlete Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 font-body">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)] block mb-1">Full Name</span>
                  <span className="font-semibold text-base text-[var(--text-primary)]">{reg.athlete_name}</span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)] block mb-1">Mobile Number</span>
                  <span className="font-semibold text-sm text-[var(--text-primary)] font-mono">{reg.phone}</span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)] block mb-1">Email Address</span>
                  <span className="font-medium text-sm text-[var(--text-primary)] break-all">{reg.email || '—'}</span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)] block mb-1">Date of Birth</span>
                  <span className="font-medium text-sm text-[var(--text-primary)]">{reg.date_of_birth || '—'}</span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)] block mb-1">Calculated Age</span>
                  <span className="font-semibold text-sm text-[var(--gold)]">
                    {reg.age ? `${reg.age} years old` : '—'}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)] block mb-1">Height</span>
                  <span className="font-semibold text-sm text-[var(--text-primary)]">
                    {reg.height ? `${reg.height} cm` : '—'}
                  </span>
                </div>
              </div>
            </section>

            {/* 3. EVENT & CATEGORIES */}
            <section className="bg-[var(--surface)] border border-[var(--border-color)] p-6 md:p-8 rounded-2xl">
              <div className="flex items-center gap-2 mb-6 border-b border-[var(--border-color)] pb-4">
                <Calendar className="w-5 h-5 text-[var(--gold)]" />
                <h2 className="font-heading text-lg uppercase tracking-tight-heading text-[var(--text-primary)] font-extrabold">
                  Championship &amp; Categories
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)] block mb-1">Championship</span>
                  <span className="font-semibold text-base text-[var(--text-primary)]">{reg.event_name}</span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)] block mb-1">Event Date &amp; Venue</span>
                  <span className="font-medium text-sm text-[var(--text-primary)]">
                    {reg.event_date} • {reg.venue || 'Venue TBA'}
                  </span>
                </div>
              </div>

              <div className="border-t border-[var(--border-color)] pt-5">
                <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)] block mb-3">
                  Selected Divisions ({reg.categories?.length || 1})
                </span>
                <div className="space-y-2">
                  {(reg.categories || [reg.category_name]).map((cat: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded bg-black/5 dark:bg-white/5 border border-[var(--border-color)]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[var(--gold)]"></span>
                        <span className="font-medium text-sm text-[var(--text-primary)]">{cat}</span>
                      </div>
                      <span className="text-xs font-medium uppercase tracking-label text-[var(--muted)]">
                        {idx === 0 ? 'Primary Division' : 'Additional (50% Off)'}
                      </span>
                    </div>
                  ))}
                </div>

                {reg.tan_spray_requested && (
                  <div className="mt-3 p-3 rounded bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-xs font-bold text-[var(--gold)] uppercase tracking-label flex items-center gap-2">
                    <Check size={14} /> Official Pro Tan Spray Tanning Service Included (+₹1,500)
                  </div>
                )}

                {/* Official Fee Breakdown */}
                <div className="mt-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-2 text-xs">
                  <span className="font-heading font-extrabold uppercase text-[var(--text-primary)] tracking-wide block border-b border-[var(--border-color)] pb-1.5">
                    Admin Fee Breakdown
                  </span>
                  
                  {reg.pricing?.category_fee || reg.event_name?.toLowerCase().includes('south india') ? (
                    <>
                      <div className="flex justify-between items-center text-[var(--muted)]">
                        <span>Category Registration Fee ({reg.categories?.length || 1} Categories):</span>
                        <span className="font-mono font-bold text-[var(--text-primary)]">
                          ₹{reg.pricing?.category_fee || ((reg.categories?.length || 1) === 1 ? 3000 : (reg.categories?.length || 1) === 2 ? 5000 : 6000)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-amber-600 dark:text-amber-400 font-medium">
                        <span>Mandatory Clinical Testing Charge:</span>
                        <span className="font-mono font-bold">
                          ₹{reg.pricing?.clinical_charge || 2000}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center text-[var(--muted)]">
                      <span>Base Category Fee:</span>
                      <span className="font-mono font-bold text-[var(--text-primary)]">
                        ₹{reg.total_amount || reg.entry_fee}
                      </span>
                    </div>
                  )}

                  {reg.tan_spray_requested && (
                    <div className="flex justify-between items-center text-[var(--muted)]">
                      <span>Pro Tan Spray Application:</span>
                      <span className="font-mono font-bold text-[var(--text-primary)]">+ Included</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[var(--border-color)] flex justify-between items-center text-sm font-bold">
                    <span className="font-heading uppercase text-[var(--text-primary)]">Total Verified Amount:</span>
                    <span className="font-mono font-black text-base text-[var(--gold)]">
                      ₹{reg.total_amount || reg.entry_fee}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Status & Admin Controls */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Status Card */}
            <div className="bg-[var(--surface)] border border-[var(--border-color)] p-6 rounded-lg">
              <h3 className="font-heading text-sm uppercase tracking-label text-[var(--text-primary)] mb-4 font-bold border-b border-[var(--border-color)] pb-3">
                Registration Status
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)] block mb-1.5">
                    Approval State
                  </span>
                  <span className={`inline-block px-3 py-1.5 text-xs font-semibold uppercase tracking-label rounded-md ${statusColors[reg.status] || 'bg-gray-100'}`}>
                    {reg.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)] block mb-1">Registration #</span>
                  <span className="font-mono font-bold text-lg text-[var(--gold)] tracking-label">{reg.registration_number}</span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)] block mb-1">Submitted On</span>
                  <span className="text-xs text-[var(--text-primary)] font-mono">
                    {new Date(reg.created_at).toLocaleString()}
                  </span>
                </div>

                {reg.approved_at && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-label text-[var(--muted)] block mb-1">Approved At</span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                      {new Date(reg.approved_at).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Verification Actions */}
            <div className="bg-[var(--surface)] border border-[var(--border-color)] p-6 rounded-lg space-y-4">
              <h3 className="font-heading text-sm uppercase tracking-label text-[var(--text-primary)] mb-4 font-bold border-b border-[var(--border-color)] pb-3">
                Administrative Actions
              </h3>

              {!isApproved ? (
                <>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setIsApproveOpen(true)}
                    disabled={actionLoading}
                    className="w-full font-heading text-sm font-bold uppercase tracking-btn h-12 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg"
                  >
                    <CheckCircle2 size={16} className="mr-2" /> Approve &amp; Issue Ticket
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsRejectOpen(true)}
                    disabled={actionLoading}
                    className="w-full font-heading text-sm font-bold uppercase tracking-btn h-11 border-rose-500/50 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                  >
                    <XCircle size={16} className="mr-2" /> Reject Payment Proof
                  </Button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    <ShieldCheck size={16} className="inline mr-1 text-emerald-500" /> Official Ticket Pass is Active &amp; Approved.
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleResendEmail}
                    disabled={actionLoading}
                    className="w-full font-heading text-sm font-bold uppercase tracking-btn h-11"
                  >
                    <Mail size={15} className="mr-2" /> Resend Official Ticket Email
                  </Button>

                  <Link
                    href={`/registration-status?reg=${reg.registration_number}`}
                    target="_blank"
                    className="w-full block"
                  >
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full font-heading text-sm font-bold uppercase tracking-btn h-11 border-[var(--gold)] text-[var(--gold)]"
                    >
                      <FileCheck size={15} className="mr-2" /> View / Download Stage Pass
                    </Button>
                  </Link>
                </div>
              )}

              <div className="pt-2 text-xs text-[var(--muted)] leading-relaxed border-t border-[var(--border-color)]">
                <strong className="text-[var(--text-primary)]">Policy:</strong> Official passes are issued only after payment verification. Approving sends an official ticket confirmation to the athlete&apos;s email automatically.
              </div>
            </div>

          </div>

        </div>
      ) : null}

      {/* LIGHTBOX / ZOOM MODAL */}
      {isZoomOpen && proofUrl && (
        <div className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4">
          {/* Header Controls */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white py-2 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="font-heading font-bold uppercase tracking-wider text-base">
                Payment Proof — {reg?.athlete_name} ({reg?.registration_number})
              </span>
              <span className="text-xs text-[var(--gold)] font-mono">
                Amount: ₹{reg?.total_amount || reg?.entry_fee}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setZoomScale((s) => Math.min(s + 0.5, 3))}
                className="h-8 px-2 text-white border-white/20 hover:bg-white/10"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setZoomScale((s) => Math.max(s - 0.5, 0.75))}
                className="h-8 px-2 text-white border-white/20 hover:bg-white/10"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setZoomScale(1)}
                className="h-8 px-2 text-white border-white/20 hover:bg-white/10"
                title="Reset Zoom"
              >
                <RotateCcw size={16} />
              </Button>
              <a
                href={proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-3 rounded text-xs font-heading font-bold uppercase tracking-btn inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white"
              >
                <ExternalLink size={14} /> Full Tab
              </a>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white ml-2"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Zoomable Image Container */}
          <div className="flex-1 w-full max-w-5xl overflow-auto flex items-center justify-center p-4">
            <div
              style={{ transform: `scale(${zoomScale})`, transition: 'transform 0.2s ease-out' }}
              className="max-h-[80vh] flex items-center justify-center"
            >
              <img
                src={proofUrl}
                alt="Payment proof full preview"
                className="max-h-[75vh] max-w-full object-contain rounded shadow-2xl border border-white/20 select-none"
              />
            </div>
          </div>

          {/* Footer instruction */}
          <div className="text-white/70 text-xs py-2">
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">ESC</kbd> to close • Current Zoom: {Math.round(zoomScale * 100)}%
          </div>
        </div>
      )}

      {/* APPROVE CONFIRMATION MODAL */}
      {isApproveOpen && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border-2 border-emerald-500/60 max-w-lg w-full p-6 md:p-8 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 font-body">
            <div className="flex items-center gap-3 mb-4 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-7 h-7 shrink-0" />
              <h3 className="font-heading text-xl uppercase tracking-tight-heading text-[var(--text-primary)] font-bold">
                Approve Payment &amp; Issue Ticket?
              </h3>
            </div>

            <p className="text-sm text-[var(--text-body)] leading-relaxed mb-6">
              Confirm that you have reviewed the payment proof for <strong className="text-[var(--text-primary)]">{reg?.athlete_name}</strong>.
              <br /><br />
              This action will:
              <br />• Update payment status to <strong>Captured / Verified</strong>
              <br />• Set registration to <strong>Confirmed / Approved</strong>
              <br />• Generate the official WFF Tamil Nadu Stage Pass
              <br />• Automatically dispatch Email 2 with the official ticket to <strong className="text-[var(--gold)]">{reg?.email}</strong>
            </p>

            <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border-color)]">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsApproveOpen(false)}
                disabled={actionLoading}
                className="font-heading text-sm font-bold uppercase tracking-btn h-10 px-5"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleApprove}
                disabled={actionLoading}
                className="font-heading text-sm font-bold uppercase tracking-btn h-10 px-6 bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check size={16} className="mr-2" />}
                Confirm &amp; Issue Ticket
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {isRejectOpen && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border-2 border-rose-500/60 max-w-lg w-full p-6 md:p-8 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 font-body">
            <div className="flex items-center gap-3 mb-4 text-rose-600 dark:text-rose-400">
              <XCircle className="w-7 h-7 shrink-0" />
              <h3 className="font-heading text-xl uppercase tracking-tight-heading text-[var(--text-primary)] font-bold">
                Reject Payment Screenshot
              </h3>
            </div>

            <p className="text-sm text-[var(--text-body)] mb-4">
              Enter the reason why this payment screenshot is being rejected. This explanation will be displayed directly to <strong>{reg?.athlete_name}</strong> on their registration status page so they can upload a valid replacement screenshot.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-label text-[var(--muted)] mb-2">
                Rejection Reason (Required)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Screenshot is blurry / UTR reference not visible / Amount paid does not match payable amount / Duplicate transaction proof."
                rows={3}
                className="w-full p-3 rounded bg-black/5 dark:bg-black/30 border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-rose-500 font-body"
              />
              {rejectionError && (
                <p className="text-xs text-rose-500 font-medium mt-1.5">{rejectionError}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border-color)]">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsRejectOpen(false)}
                disabled={actionLoading}
                className="font-heading text-sm font-bold uppercase tracking-btn h-10 px-5"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReject}
                disabled={actionLoading}
                className="font-heading text-sm font-bold uppercase tracking-btn h-10 px-6 bg-rose-600 hover:bg-rose-500 text-white border-rose-600"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <X size={16} className="mr-2" />}
                Reject Screenshot
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
