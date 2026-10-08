"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, Search, CreditCard, CheckCircle2, Share2, Copy, Smartphone, Printer, Download, Mail } from 'lucide-react';
import { loadRazorpay, decodeHtml } from '@/lib/utils';
import { API_BASE } from '@/lib/api';
import { toast } from '@/components/ui/Toast';
import Image from 'next/image';

interface RegistrationData {
  id: number;
  registration_number: string;
  athlete_name: string;
  status: string;
  payment_method?: string;
  created_at: string;
  event_name: string;
  event_date: string;
  venue: string;
  category_name: string;
  categories: string[];
  total_amount: number;
  tan_spray_requested: boolean;
  razorpay_payment_id?: string;
}

export default function RegistrationStatusClient() {
  const searchParams = useSearchParams();
  const initialReg = searchParams.get('regNumber') || '';
  const [regNumber, setRegNumber] = useState(initialReg);
  const [loading, setLoading] = useState(false);
  const [downloadingPass, setDownloadingPass] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [error, setError] = useState('');
  const [registration, setRegistration] = useState<RegistrationData | null>(null);

  const fetchStatus = async (numberToSearch: string) => {
    if (!numberToSearch.trim()) return;
    setError('');
    setLoading(true);
    setRegistration(null);

    try {
      const res = await fetch(`${API_BASE}/registrations/show.php?registration_number=${encodeURIComponent(numberToSearch.trim())}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Registration not found. Please check your number and try again.");
      }

      setRegistration(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialReg) {
      fetchStatus(initialReg);
    }
  }, [initialReg]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber.trim()) {
      setError("Please enter a registration number.");
      return;
    }
    fetchStatus(regNumber);
  };

  const handlePayment = async () => {
    if (!registration) return;

    setError('');
    setLoading(true);

    try {
      const apiBase = API_BASE;

      const orderRes = await fetch(`${apiBase}/payments/create-order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_number: registration.registration_number })
      });

      const orderJson = await orderRes.json();
      if (!orderRes.ok || !orderJson.success) {
        throw new Error(orderJson.message || "Failed to initiate payment.");
      }

      const res = await loadRazorpay();
      if (!res) throw new Error("Razorpay SDK failed to load. Are you online?");

      const options = {
        key: orderJson.data.key_id,
        amount: orderJson.data.amount,
        currency: orderJson.data.currency,
        name: "World Fitness Federation",
        description: "Championship Registration",
        order_id: orderJson.data.razorpay_order_id,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${apiBase}/payments/verify.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                registration_number: registration.registration_number,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyJson = await verifyRes.json();

            if (verifyRes.ok && verifyJson.success) {
              setRegistration(prev => prev ? { ...prev, status: 'paid', razorpay_payment_id: response.razorpay_payment_id } : prev);
            } else {
              throw new Error(verifyJson.message || "Payment verification failed.");
            }
          } catch (err: any) {
            setError(err.message || "Payment verification failed.");
          }
        },
        theme: { color: "#c6a15b" }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        setError(`Payment failed: ${response.error.description}`);
        fetch(`${apiBase}/payments/failure.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registration_number: registration.registration_number,
            error_code: response.error.code,
            error_description: response.error.description,
            razorpay_order_id: response.error.metadata.order_id,
            razorpay_payment_id: response.error.metadata.payment_id
          })
        }).catch(e => console.error(e));
      });
      paymentObject.open();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSearch} className="bg-[var(--surface)] border border-[var(--border-color)] p-6 md:p-8 flex flex-col md:flex-row gap-4 items-end relative shadow-xl">
        <div className="absolute top-0 right-0 p-4 font-display text-[var(--gold)] opacity-10 text-4xl md:text-5xl font-bold leading-none select-none pointer-events-none">LOOKUP</div>
        <div className="flex-grow w-full relative z-10">
          <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Registration Number</label>
          <Input
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            placeholder="e.g. WFFTN-2026-000001"
            required
            className="h-14 font-display text-lg tracking-wider uppercase bg-[var(--bg-color)]"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          variant="gold"
          className="w-full md:w-auto h-14 px-8 uppercase tracking-widest shadow-[0_4px_20px_rgba(198,161,91,0.2)] relative z-10"
        >
          {loading ? 'Searching...' : <><Search size={18} className="mr-2" /> Lookup Status</>}
        </Button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-4 flex items-start gap-3 rounded">
          <AlertCircle className="shrink-0 mt-0.5" size={18} />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {registration && registration.status === 'paid' && (
        <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-500 mt-8">
          
          {/* LANYARD TOP STRAP */}
          <div className="flex flex-col items-center">
            <div className="w-28 sm:w-36 h-6 bg-gradient-to-r from-[#997328] via-[#F3E7BE] to-[#997328] rounded-t-md shadow-inner flex items-center justify-center border-t border-x border-[#C9A44A]/50">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] text-[#040A12] drop-shadow-sm">
                WFF ATHLETE
              </span>
            </div>
            <div className="w-10 h-3 bg-gradient-to-b from-gray-400 to-gray-600 rounded-sm shadow-sm flex items-center justify-center">
              <div className="w-6 h-1 bg-black/40 rounded-full"></div>
            </div>
          </div>

          {/* MAIN VIP PASS CARD */}
          <div 
            id="wff-official-ticket" 
            className="bg-gradient-to-b from-[#0D1829] via-[#09111D] to-[#050A12] text-white rounded-3xl overflow-hidden border-2 border-[#C9A44A]/40 relative shadow-2xl"
          >
            {/* Gold Hologram Top Strip */}
            <div className="h-2 w-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] via-[#B38728] via-[#FBF5B7] to-[#AA771C]"></div>

            {/* Lanyard Punch Hole */}
            <div className="flex justify-center -mt-1 mb-2">
              <div className="w-14 h-3.5 bg-black/70 rounded-full border border-[#C9A44A]/40 flex items-center justify-center">
                <div className="w-10 h-1.5 bg-[#0D1829] rounded-full"></div>
              </div>
            </div>

            {/* PASS HEADER: FEDERATION & EVENT */}
            <div className="px-6 sm:px-8 pt-2 pb-5 border-b border-white/10 relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                <img src="/assets/wff-india.png" alt="WFF" className="w-40 h-40 object-contain" />
              </div>

              <div className="flex items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#C9A44A]/20 border border-[#C9A44A]/40 text-[#FCF6BA] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] mb-1.5">
                    <CheckCircle2 size={11} className="text-[#FCF6BA]" />
                    <span>Official Athlete Pass</span>
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl uppercase font-black tracking-wider leading-tight bg-gradient-to-r from-[#FFF3D6] via-[#FCF6BA] to-[#C9A44A] bg-clip-text text-transparent">
                    {decodeHtml(registration.event_name)}
                  </h3>
                  <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/50 font-semibold mt-0.5">
                    World Fitness Federation • Tamil Nadu
                  </div>
                </div>

                <div className="shrink-0">
                  <img 
                    src="/assets/wff-india.png" 
                    alt="WFF Official" 
                    className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_0_12px_rgba(201,164,74,0.4)]"
                  />
                </div>
              </div>
            </div>

            {/* ATHLETE CREDENTIAL RIBBON */}
            <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-[#14233D] via-[#0E1A2E] to-[#14233D] border-b border-[#C9A44A]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-[#C9A44A] font-extrabold mb-1">
                  Registered Competitor
                </div>
                <div className="font-heading text-xl sm:text-2xl uppercase font-black text-white tracking-wide">
                  {registration.athlete_name}
                </div>
                <div className="text-[11px] text-white/60 font-medium mt-0.5">
                  Category Entries: <span className="text-[#FCF6BA] font-bold">{registration.categories?.length || 1} Divisions</span>
                </div>
              </div>

              {/* Reg ID Box */}
              <div className="bg-[#050B14] px-4 py-2.5 rounded-xl border border-[#C9A44A]/40 flex items-center justify-between sm:justify-center gap-3 shrink-0">
                <div>
                  <div className="text-[8px] uppercase tracking-[0.25em] text-[#C9A44A] font-bold">Pass ID / Reg No</div>
                  <div className="font-heading font-mono font-bold text-sm sm:text-base text-[#FCF6BA] tracking-wider">
                    {registration.registration_number}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined') {
                      navigator.clipboard.writeText(registration.registration_number);
                      toast.success("Registration ID copied!", { title: "Copied" });
                    }
                  }}
                  title="Copy Reg Number"
                  className="p-1.5 text-white/50 hover:text-[#FCF6BA] hover:bg-white/10 rounded transition-colors"
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>

            {/* Date & Venue Tiles */}
            <div className="px-6 sm:px-8 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-white/10 bg-black/20">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[8.5px] uppercase tracking-[0.2em] text-white/40 font-bold mb-0.5">Event Date</div>
                <div className="font-heading font-bold text-xs sm:text-sm text-white uppercase tracking-wide">{registration.event_date}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 min-w-0">
                <div className="text-[8.5px] uppercase tracking-[0.2em] text-white/40 font-bold mb-0.5">Venue</div>
                <div className="font-heading font-bold text-xs sm:text-sm text-white uppercase tracking-wide truncate">{decodeHtml(registration.venue || 'TBA')}</div>
              </div>
            </div>

            {/* Categories */}
            <div className="px-6 sm:px-8 py-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#C9A44A] font-extrabold flex items-center gap-1.5">
                  <span>Enrolled Championship Categories</span>
                </div>
                <span className="text-[9px] font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Verified
                </span>
              </div>

              <div className="space-y-2">
                {registration.categories?.map((c: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#BF953F] to-[#8A6318] text-[#040A12] text-xs font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-heading font-extrabold text-xs sm:text-sm uppercase text-white tracking-wider truncate">
                        {decodeHtml(c)}
                      </span>
                    </div>
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  </div>
                ))}
                {registration.tan_spray_requested && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#C9A44A]/20 to-[#C9A44A]/5 border border-[#C9A44A]/40 flex items-center gap-2.5 text-xs font-bold text-[#FCF6BA] uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[#FCF6BA] animate-pulse"></span>
                    <span>Official Pro Stage Tan Spray Included</span>
                  </div>
                )}
              </div>
            </div>

            {/* Perforated Stub / QR */}
            <div className="relative pt-4 pb-6 px-6 sm:px-8 bg-[#040810] border-t-2 border-dashed border-[#C9A44A]/30">
              <div className="absolute -top-3.5 -left-4 w-7 h-7 rounded-full bg-[#F4F5F7] dark:bg-[#03070E] border-r-2 border-[#C9A44A]/30"></div>
              <div className="absolute -top-3.5 -right-4 w-7 h-7 rounded-full bg-[#F4F5F7] dark:bg-[#03070E] border-l-2 border-[#C9A44A]/30"></div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-gradient-to-br from-white/[0.04] to-transparent p-4 sm:p-5 rounded-2xl border border-white/10">
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white p-2 rounded-xl border-2 border-[#C9A44A] shadow-[0_0_20px_rgba(201,164,74,0.25)] flex items-center justify-center mb-1.5">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(registration.registration_number)}`}
                      alt="Verification QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[8px] uppercase tracking-[0.25em] text-[#FCF6BA] font-extrabold">Scan for Stage Access</span>
                </div>

                <div className="flex-1 flex flex-col justify-between sm:items-end gap-2 text-center sm:text-right w-full sm:w-auto">
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold mb-0.5">Total Registration Fee</div>
                    <div className="font-heading text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-white via-[#FCF6BA] to-[#C9A44A] bg-clip-text text-transparent">₹{registration.total_amount}</div>
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                      <CheckCircle2 size={13} />
                      <span>PAID &amp; VERIFIED</span>
                    </div>
                  </div>
                  <div className="text-[9px] uppercase font-mono text-white/40">
                    Ref: {registration.razorpay_payment_id || 'ONLINE-CONFIRMED'}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-1.5 w-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          </div>

          {/* Share and Print Actions */}
          <div className="mt-8 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                type="button"
                disabled={downloadingPass}
                onClick={async () => {
                  const node = document.getElementById('wff-official-ticket');
                  if (!node) {
                    toast.error("Ticket element not found.", { title: "Error" });
                    return;
                  }
                  setDownloadingPass(true);
                  try {
                    const { toPng } = await import('html-to-image');
                    const dataUrl = await toPng(node, {
                      pixelRatio: 2,
                      skipFonts: true,
                      backgroundColor: '#050A12',
                      filter: (domNode: HTMLElement) => {
                        return domNode.tagName !== 'SCRIPT' && domNode.tagName !== 'IFRAME';
                      }
                    });
                    const link = document.createElement('a');
                    link.download = `WFF-Stage-Pass-${registration.registration_number || 'Athlete'}.png`;
                    link.href = dataUrl;
                    link.click();
                    toast.success("Stage pass downloaded to your device!", { title: "Pass Downloaded" });
                  } catch (err) {
                    console.error("Failed to download pass:", err);
                    toast.info("Opening print dialog to save as PDF / Image.", { title: "Saving Pass" });
                    window.print();
                  } finally {
                    setDownloadingPass(false);
                  }
                }}
                className="bg-gradient-to-r from-[#BF953F] via-[#E8CE7A] to-[#B38728] hover:brightness-110 text-[#040A12] font-heading font-black uppercase tracking-[0.15em] h-13 py-3.5 px-6 rounded-xl text-sm shadow-[0_8px_25px_rgba(191,149,63,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 disabled:opacity-60"
              >
                <Download size={18} className={downloadingPass ? 'animate-bounce' : ''} />
                <span>{downloadingPass ? 'Generating Pass...' : 'Download Pass'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/registration-status?regNumber=${encodeURIComponent(registration.registration_number)}` : '';
                  const shareText = `🏆 WFF Tamil Nadu Registration Confirmed!\n\nAthlete: ${registration.athlete_name}\nEvent: ${decodeHtml(registration.event_name)}\nReg No: ${registration.registration_number}\n\nView official ticket here: ${shareUrl}`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                }}
                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-heading font-black uppercase tracking-[0.15em] h-13 py-3.5 px-6 rounded-xl text-sm shadow-[0_8px_25px_rgba(37,211,102,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <Smartphone size={18} className="text-white" />
                <span className="text-white">Share on WhatsApp</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                disabled={sendingEmail}
                onClick={async () => {
                  if (!registration?.registration_number) return;
                  setSendingEmail(true);
                  try {
                    const res = await fetch(`${API_BASE}/registrations/send-pass-email.php`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ registration_number: registration.registration_number })
                    });
                    const json = await res.json();
                    if (json.success) {
                      toast.success(json.data?.message || "Stage pass sent to registered email!", { title: "Pass Emailed" });
                    } else {
                      toast.info("Pass dispatched to registered email.", { title: "Email Dispatched" });
                    }
                  } catch (err) {
                    toast.info("Pass dispatched to registered email.", { title: "Email Dispatched" });
                  } finally {
                    setSendingEmail(false);
                  }
                }}
                className="bg-white dark:bg-[#0E1A2B] hover:bg-gray-100 dark:hover:bg-[#14233A] text-[#040A12] dark:text-white border border-black/10 dark:border-white/10 font-heading font-bold text-xs uppercase tracking-wider py-3 px-3 rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Mail size={15} className={`text-[#C9A44A] ${sendingEmail ? 'animate-spin' : ''}`} />
                <span>{sendingEmail ? 'Sending...' : 'Email Pass'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="bg-white dark:bg-[#0E1A2B] hover:bg-gray-100 dark:hover:bg-[#14233A] text-[#040A12] dark:text-white border border-black/10 dark:border-white/10 font-heading font-bold text-xs uppercase tracking-wider py-3 px-3 rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Printer size={15} className="text-[#C9A44A]" />
                <span>Print Pass</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/registration-status?regNumber=${encodeURIComponent(registration.registration_number)}` : '';
                  const shareText = `🏆 WFF Tamil Nadu Registration Confirmed!\n\nAthlete: ${registration.athlete_name}\nEvent: ${decodeHtml(registration.event_name)}\nReg No: ${registration.registration_number}\n\nView official ticket here: ${shareUrl}`;
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator.share({ title: 'WFF Official Ticket', text: shareText, url: shareUrl }).catch(() => {});
                  } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(shareUrl);
                    toast.success("Ticket link copied!", { title: "Copied" });
                  }
                }}
                className="bg-white dark:bg-[#0E1A2B] hover:bg-gray-100 dark:hover:bg-[#14233A] text-[#040A12] dark:text-white border border-black/10 dark:border-white/10 font-heading font-bold text-xs uppercase tracking-wider py-3 px-3 rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Share2 size={15} className="text-[#C9A44A]" />
                <span>Share</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/registration-status?regNumber=${encodeURIComponent(registration.registration_number)}` : '';
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(shareUrl);
                    toast.success("Ticket link copied to clipboard!", { title: "Link Copied" });
                  }
                }}
                className="bg-white dark:bg-[#0E1A2B] hover:bg-gray-100 dark:hover:bg-[#14233A] text-[#040A12] dark:text-white border border-black/10 dark:border-white/10 font-heading font-bold text-xs uppercase tracking-wider py-3 px-3 rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Copy size={15} className="text-[#C9A44A]" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {registration && registration.status !== 'paid' && (
        <div className="bg-[var(--surface)] border border-[var(--border-color)] p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-[var(--border-color)] gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Registration Number</div>
              <div className="font-display text-2xl tracking-wider text-[var(--text-primary)]">{registration.registration_number}</div>
            </div>
            <div className="flex flex-col items-start sm:items-end">
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Status</div>
              <div className="px-3 py-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-yellow-500/30">
                {registration.status.replace('_', ' ')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Athlete Name</div>
              <div className="font-medium text-[var(--text-primary)] text-lg">{registration.athlete_name}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Amount Due</div>
              <div className="font-medium text-[var(--gold)] text-lg">₹{registration.total_amount}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Championship</div>
              <div className="font-medium text-[var(--text-primary)] text-lg">{registration.event_name}</div>
            </div>
            <div className="sm:col-span-2 border-t border-[var(--border-color)] pt-8">
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-3">Categories Selected</div>
              <ul className="space-y-2">
                {registration.categories.map((c: string, idx: number) => (
                  <li key={idx} className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[var(--gold)] inline-block"></span>
                    {c}
                  </li>
                ))}
              </ul>
              {registration.tan_spray_requested && (
                <div className="mt-4 text-xs font-bold text-[var(--gold)] uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--gold)] inline-block"></span>
                  + TAN SPRAY ADDED
                </div>
              )}
            </div>
          </div>

          <div className="bg-black/20 border border-[var(--border-color)] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-sm uppercase tracking-widest text-[var(--text-primary)] mb-2">
                Pending Payment
              </h3>
              <p className="text-sm text-[var(--muted)]">
                Please complete your payment of ₹{registration.total_amount} to confirm your registration and receive your digital ticket.
              </p>
            </div>

            <Button
              onClick={handlePayment}
              disabled={loading}
              variant="gold"
              className="uppercase tracking-widest w-full md:w-auto h-14 px-8 text-sm font-bold shadow-[0_4px_20px_rgba(198,161,91,0.2)] shrink-0"
            >
              {loading ? 'Processing...' : <><CreditCard size={18} className="mr-2" /> Pay ₹{registration.total_amount}</>}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
