"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  AlertCircle, 
  Search, 
  CreditCard, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Printer, 
  Download, 
  Mail, 
  Calendar, 
  MapPin, 
  Trophy, 
  Clock, 
  ShieldAlert, 
  Upload, 
  Camera, 
  ExternalLink,
  X,
  FileText
} from 'lucide-react';
import { decodeHtml } from '@/lib/utils';
import { API_BASE } from '@/lib/api';
import { toast } from '@/components/ui/Toast';
import Link from 'next/link';

interface RegistrationData {
  id: number;
  registration_number: string;
  athlete_name: string;
  phone: string;
  email: string;
  date_of_birth?: string;
  age?: number;
  height?: number;
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
  payment_proof?: string;
  transaction_ref?: string;
  rejection_reason?: string;
  proof_uploaded_at?: string;
  approved_at?: string;
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

  // Resubmission state for rejected registrations
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [replacementPreview, setReplacementPreview] = useState<string | null>(null);
  const [replacementUtr, setReplacementUtr] = useState('');
  const [resubmitting, setResubmitting] = useState(false);
  const replacementInputRef = useRef<HTMLInputElement | null>(null);

  const fetchStatus = async (numberToSearch: string) => {
    if (!numberToSearch.trim()) return;
    setError('');
    setLoading(true);
    setRegistration(null);

    try {
      const res = await fetch(`${API_BASE}/registrations/show.php?registration_number=${encodeURIComponent(numberToSearch.trim())}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Registration not found. Please verify your registration number.");
      }

      setRegistration(json.data);
    } catch (err: any) {
      setError(err.message || "Failed to load registration.");
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
      setError("Please enter your registration number.");
      return;
    }
    fetchStatus(regNumber);
  };

  const handleReplacementFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file (JPG, PNG, WEBP).", { title: "Invalid File" });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Screenshot file size cannot exceed 10MB.", { title: "File Too Large" });
        return;
      }
      setReplacementFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setReplacementPreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleResubmitProof = async () => {
    if (!replacementFile || !registration) {
      toast.error("Please attach a replacement payment screenshot.", { title: "Screenshot Required" });
      return;
    }

    setResubmitting(true);
    try {
      const formData = new FormData();
      formData.append('registration_number', registration.registration_number);
      formData.append('screenshot', replacementFile);
      if (replacementUtr.trim()) {
        formData.append('transaction_ref', replacementUtr.trim());
      }

      const res = await fetch(`${API_BASE}/registrations/upload-proof.php`, {
        method: 'POST',
        body: formData
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to upload replacement screenshot.");
      }

      toast.success("Replacement screenshot submitted! Under admin review.", { title: "Resubmitted" });
      setReplacementFile(null);
      setReplacementPreview(null);
      setReplacementUtr('');
      await fetchStatus(registration.registration_number);

    } catch (err: any) {
      toast.error(err.message || "Failed to upload screenshot.", { title: "Upload Failed" });
    } finally {
      setResubmitting(false);
    }
  };

  const handleDownloadPass = async () => {
    const node = document.getElementById('wff-official-ticket');
    if (!node) {
      toast.error("Ticket element not found.", { title: "Error" });
      return;
    }
    setDownloadingPass(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(node, {
        pixelRatio: 2.5,
        skipFonts: true,
        backgroundColor: '#050A12',
        cacheBust: true,
        filter: (domNode: HTMLElement) => domNode.tagName !== 'SCRIPT' && domNode.tagName !== 'IFRAME'
      });
      const link = document.createElement('a');
      link.download = `WFF-Official-Pass-${(registration?.registration_number || 'Athlete').replace(/[^a-zA-Z0-9-_]/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Official stage pass downloaded!", { title: "Downloaded" });
    } catch (err) {
      console.error("Pass export error:", err);
      toast.info("Opening print dialog to save as PDF.", { title: "Print Pass" });
      window.print();
    } finally {
      setDownloadingPass(false);
    }
  };

  const handleEmailPass = async () => {
    if (!registration) return;
    setSendingEmail(true);
    try {
      const res = await fetch(`${API_BASE}/registrations/send-pass-email.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_number: registration.registration_number })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to dispatch email.");
      }
      toast.success(json.data?.message || `Official Stage Pass emailed to ${registration.email}!`, { title: "Pass Emailed" });
    } catch (err: any) {
      toast.error(err.message || "Could not send email pass right now.", { title: "Email Failed" });
    } finally {
      setSendingEmail(false);
    }
  };

  const isApproved = registration && (registration.status === 'paid' || registration.status === 'confirmed');
  const isRejected = registration && registration.status === 'rejected';
  const isPending = registration && !isApproved && !isRejected;

  return (
    <div className="space-y-8">
      {/* SEARCH FORM */}
      <form onSubmit={handleSearch} className="bg-[var(--surface)] border border-[var(--border-color)] p-6 md:p-8 flex flex-col md:flex-row gap-4 items-end relative shadow-xl rounded-2xl">
        <div className="absolute top-0 right-0 p-4 font-heading text-[var(--gold)] opacity-10 text-4xl md:text-5xl font-black leading-none select-none pointer-events-none">LOOKUP</div>
        <div className="flex-grow w-full relative z-10">
          <label htmlFor="reg-number-input" className="block font-body text-sm font-semibold tracking-label text-[var(--text-primary)] mb-1.5">Registration Number</label>
          <Input
            id="reg-number-input"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            placeholder="e.g. WFFTN-2026-000001"
            required
            className="h-14 font-mono text-base uppercase bg-[var(--bg)] rounded-xl tracking-normal"
          />
          <p className="mt-2 text-xs text-[var(--muted)] flex items-center gap-1.5 font-body">
            <span>💡 Enter the 16-character code sent to your registered email or phone number after booking.</span>
          </p>
        </div>
        <Button
          type="submit"
          disabled={loading}
          variant="gold"
          className="w-full md:w-auto h-14 px-8 font-heading font-extrabold text-sm uppercase tracking-btn shadow-md relative z-10 rounded-xl cursor-pointer"
        >
          {loading ? 'Searching...' : <><Search size={18} className="mr-2" /> Lookup Status</>}
        </Button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-4 flex items-start gap-3 rounded-xl">
          <AlertCircle className="shrink-0 mt-0.5" size={18} />
          <div className="font-body text-sm font-medium">{error}</div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. PAYMENT VERIFICATION PENDING STATE (SAMPLE TICKET PREVIEW) */}
      {/* ------------------------------------------------------------- */}
      {isPending && registration && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500 mt-8">
          
          {/* Status Alert Banner */}
          <div className="bg-amber-500/10 border border-amber-500/40 p-5 rounded-2xl flex items-start gap-4 text-amber-700 dark:text-amber-300">
            <Clock size={24} className="shrink-0 mt-0.5 text-amber-500" />
            <div>
              <div className="font-heading font-extrabold text-base uppercase tracking-tight-heading">
                Payment Verification Pending
              </div>
              <p className="font-body text-sm mt-1 leading-relaxed text-[var(--text-primary)]">
                Your registration and payment screenshot are currently under review by the WFF Tamil Nadu federation administration team. <strong>Once verified and approved, your official championship ticket will be activated and emailed to {registration.email}.</strong>
              </p>
            </div>
          </div>

          {/* Sample Ticket Preview (With Watermark) */}
          <div className="relative mx-auto max-w-2xl">
            {/* Warning Banner */}
            <div className="bg-red-600 text-white py-2 px-4 rounded-t-2xl font-heading font-black text-xs uppercase tracking-wide text-center flex items-center justify-center gap-2 shadow-md">
              <ShieldAlert size={16} />
              <span>SAMPLE TICKET — NOT VALID FOR ENTRY</span>
            </div>

            {/* Ticket Card Body with Watermark */}
            <div className="bg-gradient-to-b from-[#0D1829] via-[#09111D] to-[#050A12] text-white rounded-b-3xl overflow-hidden border-2 border-red-500/40 relative shadow-2xl p-6 sm:p-8 space-y-6">

              {/* Diagonal Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 opacity-20 overflow-hidden">
                <span className="font-heading font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-wider text-red-500 -rotate-20 border-4 border-red-500 p-3 sm:p-4 text-center">
                  SAMPLE TICKET — NOT VALID FOR ENTRY
                </span>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-20">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-body text-[11px] font-semibold tracking-wide mb-1.5 uppercase">
                    Payment Status: PENDING VERIFICATION
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl uppercase font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3D6] via-[#FCF6BA] to-[#C9A44A]">
                    {registration.event_name}
                  </h3>
                  <div className="font-heading font-bold text-xs uppercase tracking-wide text-white/70">
                    World Fitness Federation • Tamil Nadu
                  </div>
                </div>
                <img src="/assets/wff-india.png" alt="WFF" className="h-12 w-auto object-contain shrink-0" />
              </div>

              {/* Athlete Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-20 text-xs">
                <div>
                  <span className="font-body text-[11px] font-semibold uppercase tracking-label text-white/50 block">Athlete Name</span>
                  <span className="font-heading font-extrabold text-base text-white mt-0.5 block">{registration.athlete_name}</span>
                </div>
                <div>
                  <span className="font-body text-[11px] font-semibold uppercase tracking-label text-white/50 block">Registration Number</span>
                  <span className="font-mono font-bold text-xs text-[#FCF6BA] mt-0.5 block tracking-normal">{registration.registration_number}</span>
                </div>
                <div>
                  <span className="font-body text-[11px] font-semibold uppercase tracking-label text-white/50 block">Age / Height</span>
                  <span className="font-body font-medium text-xs sm:text-sm text-white mt-0.5 block">
                    {registration.age ? `${registration.age} Yrs` : 'N/A'} &bull; {registration.height ? `${registration.height} cm` : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="font-body text-[11px] font-semibold uppercase tracking-label text-white/50 block">Event Date &amp; Location</span>
                  <span className="font-body font-medium text-xs sm:text-sm text-white mt-0.5 block">{registration.event_date} &bull; {registration.venue}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="relative z-20">
                <span className="font-body text-[11px] font-semibold uppercase tracking-label text-[#C9A44A] block mb-1.5">
                  Selected Categories ({registration.categories.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {registration.categories.map((c: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-white/5 rounded-md border border-white/10 text-xs font-heading font-bold uppercase tracking-wide text-white">
                      {c}
                    </span>
                  ))}
                  {registration.tan_spray_requested && (
                    <span className="px-3 py-1 bg-[#C9A44A]/20 rounded-md border border-[#C9A44A]/40 text-xs font-heading font-bold uppercase tracking-wide text-[#FCF6BA]">
                      + Tan Spray
                    </span>
                  )}
                </div>
              </div>

              {/* Official Fee Breakdown */}
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs relative z-20">
                {registration.event_name?.toLowerCase().includes('south india') || registration.event_name?.toLowerCase().includes('india natural') ? (
                  <>
                    <div className="flex justify-between items-center text-white/70">
                      <span>Category Registration Fee ({registration.categories.length} {registration.categories.length === 1 ? 'Category' : 'Categories'}):</span>
                      <span className="font-mono font-bold text-white">
                        ₹{registration.categories.length === 1 ? '3,000' : registration.categories.length === 2 ? '5,000' : '6,000'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[#FCF6BA]">
                      <span>Mandatory Clinical Testing Charge:</span>
                      <span className="font-mono font-bold">₹2,000</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center text-white/70">
                    <span>Registration Fee:</span>
                    <span className="font-mono font-bold text-white">₹{registration.total_amount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-white/15 flex justify-between items-center text-sm font-bold text-white">
                  <span className="uppercase font-heading">Total Submitted Amount:</span>
                  <span className="font-heading font-black text-base text-[#FCF6BA]">₹{registration.total_amount}</span>
                </div>
              </div>

              {/* Notice */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-20 text-xs text-white/60 font-body">
                <span className="text-amber-400 font-bold uppercase text-[11px] font-heading tracking-wide">
                  Payment Status: PENDING VERIFICATION
                </span>
                <span className="text-white/60 text-xs">Official approved ticket issued only after admin review</span>
              </div>

            </div>
          </div>

          <div className="p-4 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl text-center text-xs text-[var(--muted)] font-body leading-relaxed">
            Official ticket downloads and print passes become accessible here automatically as soon as an administrator verifies the submitted payment screenshot.
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. PAYMENT REJECTED STATE — RESUBMISSION DROPZONE             */}
      {/* ------------------------------------------------------------- */}
      {isRejected && registration && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500 mt-8">
          
          <div className="bg-red-500/10 border-2 border-red-500/40 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <ShieldAlert size={24} />
              <h2 className="font-heading font-black text-xl uppercase tracking-tight-heading">
                Payment Verification Rejected — Action Required
              </h2>
            </div>
            
            <p className="font-body text-sm text-[var(--text-primary)] leading-relaxed">
              Your payment proof for registration <strong className="font-mono text-red-600 dark:text-red-400">#{registration.registration_number}</strong> was reviewed and could not be verified by the admin team.
            </p>

            <div className="p-4 bg-[var(--surface)] border border-red-500/30 rounded-xl text-xs space-y-1">
              <span className="font-body text-[11px] uppercase font-semibold text-red-600 dark:text-red-400 tracking-label">
                Reason for Rejection:
              </span>
              <p className="font-body text-sm font-semibold text-[var(--text-primary)]">
                {registration.rejection_reason || "Payment screenshot was unreadable, missing transaction reference, or amount was mismatched."}
              </p>
            </div>
          </div>

          {/* Replacement Screenshot Resubmission Card */}
          <div className="p-6 sm:p-8 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl shadow-sm space-y-5">
            <h3 className="font-heading font-extrabold text-base uppercase tracking-tight-heading text-[var(--text-primary)] flex items-center gap-2">
              <Camera size={18} className="text-[var(--gold)]" />
              <span>Upload Replacement Payment Screenshot</span>
            </h3>
            <p className="font-body text-sm text-[var(--muted)] leading-relaxed">
              Please take a clear screenshot from your UPI app (Google Pay, PhonePe, Paytm) showing the successful payment of ₹{registration.total_amount} to WFF TAMILNADU and attach it below.
            </p>

            <input
              type="file"
              ref={replacementInputRef}
              onChange={handleReplacementFileChange}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
              id="replacement-screenshot-input"
            />

            {replacementPreview ? (
              <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={replacementPreview} alt="Replacement Preview" className="w-14 h-14 object-cover rounded-lg border border-emerald-500/30 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-body text-sm font-bold text-[var(--text-primary)] truncate">{replacementFile?.name}</div>
                    <span className="font-body text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Ready to resubmit</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => replacementInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] font-heading font-bold text-xs uppercase tracking-btn hover:border-[var(--gold)] cursor-pointer"
                >
                  Change
                </button>
              </div>
            ) : (
              <div
                onClick={() => replacementInputRef.current?.click()}
                className="border-2 border-dashed border-[var(--border-color)] hover:border-[var(--gold)] rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
              >
                <Upload size={22} className="text-[var(--gold)]" />
                <span className="font-body text-sm font-bold text-[var(--text-primary)]">Click to attach new payment screenshot</span>
                <span className="font-body text-xs text-[var(--muted)]">JPEG, PNG, WEBP (Max 10MB)</span>
              </div>
            )}

            <div>
              <label htmlFor="resubmit-utr" className="block font-body text-xs sm:text-sm font-semibold tracking-label text-[var(--muted)] mb-1.5">
                Transaction / UTR Reference (Optional)
              </label>
              <Input
                id="resubmit-utr"
                type="text"
                value={replacementUtr}
                onChange={(e) => setReplacementUtr(e.target.value)}
                placeholder="e.g. 12-digit UTR No"
                className="h-11 bg-[var(--bg)] text-sm rounded-xl"
              />
            </div>

            <Button
              onClick={handleResubmitProof}
              disabled={resubmitting || !replacementFile}
              className="w-full h-12 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-sm uppercase tracking-btn rounded-xl shadow-md cursor-pointer disabled:opacity-50"
            >
              {resubmitting ? 'Submitting for Re-verification...' : 'Resubmit Payment Proof for Admin Verification →'}
            </Button>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. PAYMENT APPROVED & OFFICIAL TICKET ISSUED                  */}
      {/* ------------------------------------------------------------- */}
      {isApproved && registration && (
        <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-500 mt-8">
          
          {/* LANYARD TOP STRAP */}
          <div className="flex flex-col items-center">
            <div className="w-28 sm:w-36 h-6 bg-gradient-to-r from-[#997328] via-[#F3E7BE] to-[#997328] rounded-t-md shadow-inner flex items-center justify-center border-t border-x border-[#C9A44A]/50">
              <span className="text-[10px] sm:text-[11px] font-heading font-black uppercase tracking-tight text-[#040A12] drop-shadow-sm">
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
                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#C9A44A]/20 border border-[#C9A44A]/40 text-[#FCF6BA] font-body text-xs font-bold uppercase tracking-wide mb-2 whitespace-nowrap">
                    <CheckCircle2 size={13} className="text-[#FCF6BA] shrink-0" />
                    <span>Official Approved Athlete Pass</span>
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl uppercase font-black tracking-tight leading-tight bg-gradient-to-r from-[#FFF3D6] via-[#FCF6BA] to-[#C9A44A] bg-clip-text text-transparent break-words">
                    {decodeHtml(registration.event_name)}
                  </h3>
                  <div className="font-heading font-bold text-xs uppercase tracking-wide text-white/70 mt-1">
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
            <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-[#14233D] via-[#0E1A2E] to-[#14233D] border-b border-[#C9A44A]/20">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-body text-[11px] uppercase tracking-label text-[#C9A44A] font-bold whitespace-nowrap">
                  Registered Competitor (APPROVED)
                </span>
                <div className="bg-[#050B14] px-3 py-1 rounded-md border border-[#C9A44A]/40 flex items-center gap-2 shrink-0 whitespace-nowrap flex-nowrap">
                  <span className="font-body text-[11px] uppercase tracking-label text-[#C9A44A] font-bold whitespace-nowrap">Pass ID:</span>
                  <span className="font-mono font-bold text-xs sm:text-sm text-[#FCF6BA] tracking-normal whitespace-nowrap">
                    {registration.registration_number}
                  </span>
                </div>
              </div>

              <div className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight-heading text-white">
                {registration.athlete_name}
              </div>
              <div className="font-body text-xs sm:text-sm text-white/70 font-medium mt-1">
                {registration.phone} &bull; {registration.email}
              </div>
            </div>

            {/* EVENT DETAILS & DIVISIONS */}
            <div className="px-6 sm:px-8 py-5 border-b border-white/10 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-body text-[11px] font-semibold uppercase tracking-label text-white/50 block">Championship Date</span>
                  <span className="font-body font-semibold text-xs sm:text-sm text-white mt-0.5 block">{registration.event_date}</span>
                </div>
                <div>
                  <span className="font-body text-[11px] font-semibold uppercase tracking-label text-white/50 block">Venue</span>
                  <span className="font-body font-semibold text-xs sm:text-sm text-white mt-0.5 block truncate">{registration.venue}</span>
                </div>
                {registration.age && (
                  <div>
                    <span className="font-body text-[11px] font-semibold uppercase tracking-label text-white/50 block">Age</span>
                    <span className="font-body font-semibold text-xs sm:text-sm text-white mt-0.5 block">{registration.age} Years</span>
                  </div>
                )}
                {registration.height && (
                  <div>
                    <span className="font-body text-[11px] font-semibold uppercase tracking-label text-white/50 block">Height</span>
                    <span className="font-body font-semibold text-xs sm:text-sm text-white mt-0.5 block">{registration.height} cm</span>
                  </div>
                )}
              </div>

              <div>
                <span className="font-body text-[11px] font-semibold uppercase tracking-label text-[#C9A44A] block mb-2">
                  Enrolled Divisions ({registration.categories.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {registration.categories.map((c: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-white/5 rounded-md border border-white/10 text-xs font-heading font-bold uppercase tracking-wide text-white">
                      {c}
                    </span>
                  ))}
                  {registration.tan_spray_requested && (
                    <span className="px-3 py-1 bg-[#C9A44A]/20 rounded-md border border-[#C9A44A]/40 text-xs font-heading font-bold uppercase tracking-wide text-[#FCF6BA]">
                      + Tan Spray
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* QR CODE & APPROVAL BADGE */}
            <div className="px-6 sm:px-8 py-6 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white p-1 rounded-xl shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(registration.registration_number)}`}
                    alt="Ticket QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-body text-xs font-bold uppercase tracking-wide mb-1">
                    <CheckCircle2 size={13} />
                    <span>APPROVED &bull; VALID FOR ENTRY</span>
                  </div>
                  <div className="font-body text-xs text-white/60">
                    Scan at athlete weigh-in &amp; registration desk
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-body text-[11px] font-semibold uppercase tracking-label text-white/50 block">Fee Paid</span>
                <span className="font-heading font-black text-2xl text-[var(--gold)]">₹{registration.total_amount}</span>
              </div>
            </div>

          </div>

          {/* OFFICIAL PASS ACTIONS */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={handleDownloadPass}
              disabled={downloadingPass}
              className="h-12 px-6 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-sm uppercase tracking-btn rounded-xl shadow-md cursor-pointer hover:brightness-110 transition-all"
            >
              <Download size={16} className="mr-2" />
              {downloadingPass ? 'Exporting...' : 'Download Pass Image (PNG)'}
            </Button>
            <Button
              onClick={handleEmailPass}
              disabled={sendingEmail}
              className="h-12 px-5 bg-[var(--surface)] border border-[var(--gold)]/50 text-[var(--gold)] hover:bg-[var(--gold)]/10 font-heading font-bold text-sm uppercase tracking-btn rounded-xl cursor-pointer transition-all"
            >
              <Mail size={16} className="mr-2" />
              {sendingEmail ? 'Sending Pass...' : 'Email Pass to Me'}
            </Button>
            <Button
              onClick={() => window.print()}
              variant="secondary"
              className="h-12 px-5 border border-[var(--border-color)] font-heading font-bold text-sm uppercase tracking-btn rounded-xl cursor-pointer"
            >
              <Printer size={16} className="mr-2" /> Print Official Pass
            </Button>
            <Link
              href="/"
              className="inline-flex items-center justify-center h-12 px-5 bg-[var(--surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--gold)] font-heading font-bold text-sm uppercase tracking-btn rounded-xl transition-all"
            >
              Return Home
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
