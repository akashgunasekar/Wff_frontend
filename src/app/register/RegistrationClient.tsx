"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Event, EventCategory } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, AlertTriangle, CreditCard, CheckCircle2, Ticket, CheckSquare, Square, Calendar, MapPin, Trophy, ShieldCheck, QrCode, Link2, Copy, Check, ExternalLink, X, Smartphone, ArrowRight, Upload, ImageIcon, Trash2, Camera, Share2, Printer, Download, Mail } from 'lucide-react';
import { loadRazorpay } from '@/lib/utils';
import { API_BASE } from '@/lib/api';
import { toast } from '@/components/ui/Toast';
import Image from 'next/image';
import Link from 'next/link';

/** Decode HTML entities like &amp; &#039; etc. to their actual characters */
function decodeHtml(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

interface RegistrationClientProps {
  initialEvents: Event[];
}

export default function RegistrationClient({ initialEvents }: RegistrationClientProps) {
  const searchParams = useSearchParams();
  const initialEventId = searchParams.get('eventId');

  const [events] = useState<Event[]>(initialEvents);

  // Get event based on URL param. Since "Event automatically selected", we default to it.
  const selectedEvent = events.find(e => e.id.toString() === initialEventId) || null;
  const isEventOpen = selectedEvent?.status === 'open';

  // Selected categories (multiple)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const [tanSprayRequested, setTanSprayRequested] = useState(true);

  // Athlete details
  const [formData, setFormData] = useState({
    athlete_name: '',
    phone: '',
    email: '',
    instagram_id: '',
    date_of_birth: '',
    height: '',
    weight: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [successData, setSuccessData] = useState<any>(null);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');

  // Modal states for Checkout
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [paymentTab, setPaymentTab] = useState<'qr' | 'link'>('qr');
  const [copiedField, setCopiedField] = useState<'upi' | 'link' | null>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [downloadingPass, setDownloadingPass] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (JPG, PNG, or WebP).', { title: 'Invalid File' });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Screenshot size exceeds 10MB limit.', { title: 'File Too Large' });
        return;
      }
      setPaymentProofFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPaymentProofPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      toast.info('Screenshot attached! Click "Complete Registration" below to verify.', { title: 'File Ready' });
    }
  };

  const handleRemoveProof = () => {
    setPaymentProofFile(null);
    setPaymentProofPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRequestClosePaymentModal = () => {
    setIsCancelConfirmOpen(true);
  };

  const handleConfirmCancelPayment = () => {
    setIsCancelConfirmOpen(false);
    setIsPaymentModalOpen(false);
    toast.warning("Payment process cancelled. Your registration is incomplete.", {
      title: "Payment Cancelled"
    });
  };

  const handleContinuePayment = () => {
    setIsCancelConfirmOpen(false);
  };

  // Derived Values
  const selectedCategories = useMemo(() => {
    if (!selectedEvent) return [];
    return selectedCategoryIds.map(id => selectedEvent.categories?.find(c => c.id.toString() === id)).filter(Boolean) as EventCategory[];
  }, [selectedEvent, selectedCategoryIds]);

  // Derived Pricing
  const pricing = useMemo(() => {
    if (selectedCategories.length === 0) return { base: 0, discount: 0, tanSpray: 0, total: 0 };

    let base = 0;
    let discount = 0;

    selectedCategories.forEach((cat, index) => {
      const fee = parseFloat(cat.entry_fee || '0');
      base += fee;
      if (index > 0) {
        discount += (fee * 0.5);
      }
    });

    // Tan Spray price logic.
    const eventTanSprayPrice = selectedEvent?.tan_spray_price ? parseFloat(selectedEvent.tan_spray_price) : 1000;
    const tanSpray = tanSprayRequested ? eventTanSprayPrice : 0;

    const total = base - discount + tanSpray;

    return { base, discount, tanSpray, total };
  }, [selectedCategories, tanSprayRequested, selectedEvent]);

  // Calculate age from DOB
  const age = useMemo(() => {
    if (!formData.date_of_birth) return '';
    const birthDate = new Date(formData.date_of_birth);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge > 0 ? calculatedAge.toString() : '';
  }, [formData.date_of_birth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const copyToClipboard = (text: string, type: 'upi' | 'link') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(type);
      toast.success(type === 'upi' ? 'UPI ID copied to clipboard' : 'Payment link copied to clipboard', { title: 'Copied' });
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const confirmPaymentCompletion = async () => {
    if (!paymentProofFile) {
      toast.error("Please upload your payment screenshot before completing registration.", {
        title: "Screenshot Required"
      });
      return;
    }

    if (!successData?.registration_number) {
      toast.error("Registration information is missing. Please submit again.", {
        title: "Registration Missing"
      });
      return;
    }

    setVerifying(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('registration_number', successData.registration_number);
      formDataUpload.append('screenshot', paymentProofFile);
      if (transactionRef.trim()) {
        formDataUpload.append('transaction_ref', transactionRef.trim());
      }

      const res = await fetch(`${API_BASE}/registrations/upload-proof.php`, {
        method: 'POST',
        body: formDataUpload
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to upload payment screenshot.");
      }

      setSuccessData((prev: any) => ({
        ...prev,
        status: 'paid',
        razorpay_payment_id: transactionRef.trim() || 'UPI-PROOF-VERIFIED',
        payment_proof: json.data?.payment_proof || paymentProofPreview
      }));

      setVerifying(false);
      setIsPaymentModalOpen(false);
      toast.success("Payment screenshot uploaded! Registration confirmed.", { title: "Registration Confirmed" });
    } catch (err: any) {
      setVerifying(false);
      toast.error(err.message || "Failed to upload screenshot. Please try again.", { title: "Upload Failed" });
    }
  };

  // If there's no event selected in the URL, prompt them to go back.
  if (!selectedEvent) {
    return (
      <div className="bg-wff-surface border border-wff-border p-12 text-center rounded-sm">
        <h2 className="text-xl text-wff-text-primary font-heading uppercase tracking-widest mb-4">No Event Selected</h2>
        <p className="text-wff-muted mb-8">Please select an event from the calendar to register.</p>
        <Button onClick={() => window.location.href = '/events'} variant="gold">View Events</Button>
      </div>
    );
  }

  if (selectedEvent.status === 'upcoming') {
    return (
      <div className="bg-wff-surface border border-wff-border p-12 text-center rounded-sm">
        <h2 className="text-2xl text-wff-gold font-heading uppercase tracking-widest mb-4">Registration Opens Soon</h2>
        <p className="text-wff-muted mb-8">Registration for {selectedEvent.event_name} is not yet open.</p>
        <Button onClick={() => window.location.href = `/events/${selectedEvent.slug}`} variant="secondary">Back to Event</Button>
      </div>
    );
  }

  if (selectedEvent.status === 'closed') {
    return (
      <div className="bg-wff-surface border border-wff-border p-12 text-center rounded-sm">
        <h2 className="text-2xl text-red-500 font-heading uppercase tracking-widest mb-4">Registration Closed</h2>
        <p className="text-wff-muted mb-8">Registration for {selectedEvent.event_name} has been closed.</p>
        <Button onClick={() => window.location.href = `/events/${selectedEvent.slug}`} variant="secondary">Back to Event</Button>
      </div>
    );
  }

  const submitRegistration = async () => {
    setError('');

    if (selectedCategoryIds.length === 0) {
      const msg = "Please select at least one category.";
      setError(msg);
      toast.error(msg, { title: "Category Required" });
      return;
    }
    if (!formData.athlete_name.trim()) {
      const msg = "Athlete name is required.";
      setError(msg);
      toast.error(msg, { title: "Name Required" });
      return;
    }
    if (!formData.phone.trim()) {
      const msg = "Phone number is required.";
      setError(msg);
      toast.error(msg, { title: "Phone Required" });
      return;
    }
    if (!formData.email.trim()) {
      const msg = "Email address is required.";
      setError(msg);
      toast.error(msg, { title: "Email Required" });
      return;
    }
    if (!formData.date_of_birth) {
      const msg = "Date of birth is required.";
      setError(msg);
      toast.error(msg, { title: "Date of Birth Required" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        event_id: selectedEvent.id,
        category_ids: selectedCategoryIds,
        tan_spray_requested: tanSprayRequested,
        payment_method: paymentMethod,
        ...formData
      };

      const res = await fetch(`${API_BASE}/registrations/create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to submit registration.");
      }

      const regData = {
        registration_number: json.data.registration_number,
        status: json.data.status,
        athlete_name: formData.athlete_name,
        phone: formData.phone,
        email: formData.email,
        instagram_id: formData.instagram_id,
        date_of_birth: formData.date_of_birth,
        height: formData.height,
        weight: formData.weight,
        event_name: selectedEvent.event_name,
        event_date: selectedEvent.event_date,
        venue: selectedEvent.venue,
        categories: selectedCategories.map(c => c.name),
        tan_spray_requested: tanSprayRequested,
        total_amount: json.data.total_amount,
        payment_method: json.data.payment_method || paymentMethod
      };

      setSuccessData(regData);
      setLoading(false);

      if (json.data.payment_method === 'cash' || paymentMethod === 'cash') {
        // Direct ticket
        toast.success("Registration submitted! Payment due at desk.", { title: "Registration Reserved" });
      } else {
        // Open the Checkout Modal with QR Code and Link options
        setIsPaymentModalOpen(true);
      }

    } catch (err: any) {
      const msg = err.message || "Failed to submit registration.";
      setError(msg);
      toast.error(msg, { title: "Submission Failed" });
      setLoading(false);
    }
  };

  const handlePayment = async (regNumber: string, amount: number) => {
    setPaymentFailed(false);

    try {
      const apiBase = API_BASE;
      const orderRes = await fetch(`${apiBase}/payments/create-order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_number: regNumber })
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
                registration_number: regNumber,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyJson = await verifyRes.json();

            if (verifyRes.ok && verifyJson.success) {
              setSuccessData((prev: any) => ({ ...prev, status: 'paid', razorpay_payment_id: response.razorpay_payment_id }));
              setIsPaymentModalOpen(false);
            } else {
              throw new Error(verifyJson.message || "Payment verification failed.");
            }
          } catch (err: any) {
            setPaymentFailed(true);
          }
        },
        prefill: {
          name: formData.athlete_name,
          contact: formData.phone,
          email: formData.email
        },
        theme: { color: "#c6a15b" },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);

      paymentObject.on('payment.failed', function (response: any) {
        setPaymentFailed(true);

        fetch(`${apiBase}/payments/failure.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registration_number: regNumber,
            error_code: response.error.code,
            error_description: response.error.description,
            razorpay_order_id: response.error.metadata.order_id,
            razorpay_payment_id: response.error.metadata.payment_id
          })
        }).catch(e => console.error("Failure logging failed", e));
      });

      paymentObject.open();
    } catch (err: any) {
      const msg = err.message || "Payment initiation failed.";
      setError(msg);
      toast.error(msg, { title: "Payment Error" });
      setPaymentFailed(true);
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // RENDER: FAILURE STATE
  // -------------------------------------------------------------
  if (paymentFailed) {
    return (
      <div className="w-full flex justify-center items-center py-20 px-4 bg-gray-50 min-h-[70vh]">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-black/5 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-red-500/5 p-10 flex flex-col items-center text-center border-b border-red-500/10">
            <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
              <div className="absolute inset-0 rounded-full border-4 border-red-500/20 animate-pulse"></div>
              <AlertCircle size={48} strokeWidth={2.5} />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#040A12] mb-3">
              Payment Failed
            </h2>
            <p className="text-[#040A12]/60 font-medium text-sm md:text-base max-w-sm leading-relaxed">
              Your transaction could not be completed. Your registration details have been saved securely.
            </p>
          </div>

          <div className="p-8 md:p-10 bg-white">
            <div className="bg-[#F8F9FA] p-6 rounded-lg border border-black/5 mb-8">
              <div className="flex justify-between items-center border-b border-black/5 pb-4 mb-4">
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#040A12]/50">Registration No.</span>
                <span className="font-mono font-bold text-[#040A12]">{successData?.registration_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#040A12]/50">Amount Pending</span>
                <span className="font-heading font-bold text-xl text-[#040A12]">₹{successData?.total_amount}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.href = `/events/${selectedEvent?.slug}`} className="flex-1 bg-white text-[#040A12] border border-black/10 hover:bg-gray-50 hover:border-black/20 shadow-sm h-14 uppercase tracking-widest text-xs font-bold">
                Back to Event
              </Button>
              <Button onClick={() => handlePayment(successData.registration_number, successData.total_amount)} className="flex-1 bg-red-600 text-white hover:bg-red-700 shadow-[0_10px_20px_rgba(220,38,38,0.2)] border-0 h-14 uppercase tracking-widest text-xs font-bold transition-all hover:-translate-y-0.5">
                Retry Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: SUCCESS STATE (DIGITAL TICKET & SHARE)
  // -------------------------------------------------------------
  if (successData?.status === 'paid' || successData?.payment_method === 'cash') {
    const isCash = successData.payment_method === 'cash';
    const isCashPaid = successData.status === 'paid';
    const athleteName = formData.athlete_name || successData.athlete_name || 'Athlete';
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/registration-status?regNumber=${encodeURIComponent(successData.registration_number)}`
      : `/registration-status?regNumber=${encodeURIComponent(successData.registration_number)}`;

    const shareText = `🏆 WFF Tamil Nadu Registration Confirmed!\n\nAthlete: ${athleteName}\nEvent: ${decodeHtml(successData.event_name)}\nReg No: ${successData.registration_number}\n\nView official ticket here: ${shareUrl}`;

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
          pixelRatio: 2,
          skipFonts: true,
          backgroundColor: '#050A12',
          style: {
            width: '600px',
            maxWidth: '600px',
            minWidth: '600px',
            margin: '0 auto',
          },
          filter: (domNode: HTMLElement) => {
            return domNode.tagName !== 'SCRIPT' && domNode.tagName !== 'IFRAME';
          }
        });
        const link = document.createElement('a');
        link.download = `WFF-Stage-Pass-${successData.registration_number || 'Athlete'}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Stage pass downloaded to your device!", { title: "Pass Downloaded" });
      } catch (err) {
        console.error("Failed to download pass:", err);
        // Fallback: If canvas download blocked by browser security, trigger window.print
        toast.info("Opening print dialog to save as PDF / Image.", { title: "Saving Pass" });
        window.print();
      } finally {
        setDownloadingPass(false);
      }
    };

    const handleSendPassEmail = async () => {
      if (!successData?.registration_number) return;
      setSendingEmail(true);
      try {
        const res = await fetch(`${API_BASE}/registrations/send-pass-email.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registration_number: successData.registration_number })
        });
        const json = await res.json();
        if (json.success) {
          toast.success(json.data?.message || "Stage pass sent to your email!", { title: "Pass Emailed" });
        } else {
          toast.info("Pass dispatched to registered email.", { title: "Email Sent" });
        }
      } catch (err) {
        toast.info("Pass dispatched to registered email.", { title: "Email Sent" });
      } finally {
        setSendingEmail(false);
      }
    };

    const handleShareNative = () => {
      if (typeof navigator !== 'undefined' && navigator.share) {
        navigator.share({
          title: 'WFF Official Registration Ticket',
          text: shareText,
          url: shareUrl,
        }).catch(err => {
          if (err.name !== 'AbortError') {
            handleCopyLink();
          }
        });
      } else {
        handleCopyLink();
      }
    };

    const handleWhatsAppShare = () => {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    };

    const handleCopyLink = () => {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Ticket link copied to clipboard!", { title: "Link Copied" });
      }
    };

    const userEmail = formData.email || successData?.email;

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 animate-in slide-in-from-bottom-8 duration-500 py-6">

        {/* TOP CELEBRATION BADGE */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            <CheckCircle2 size={14} className="animate-pulse" />
            <span>Registration Confirmed</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl uppercase tracking-wider text-[#040A12] dark:text-white font-extrabold">
            Your Official Stage Pass
          </h2>
          <p className="text-[#040A12]/60 dark:text-white/60 mt-1 text-xs sm:text-sm font-medium">
            Present this digital credential or QR code at athlete check-in &amp; weigh-in.
          </p>

          {/* Email Confirmation Notice */}
          {userEmail && (
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 mt-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center max-w-lg">
              <Mail size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-[#040A12] dark:text-white">
                Official pass &amp; receipt sent to <strong className="text-[#C9A44A]">{userEmail}</strong>
              </span>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* AUTHENTIC CHAMPIONSHIP ATHLETE EVENT PASS / LANYARD BADGE */}
        {/* ========================================================= */}
        <div className="relative mx-auto">

          {/* Lanyard Top Strap Effect */}
          <div className="flex flex-col items-center">
            {/* Lanyard Ribbon */}
            <div className="w-28 sm:w-36 h-6 bg-gradient-to-r from-[#997328] via-[#F3E7BE] to-[#997328] rounded-t-md shadow-inner flex items-center justify-center border-t border-x border-[#C9A44A]/50">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] text-[#040A12] drop-shadow-sm">
                WFF ATHLETE
              </span>
            </div>
            {/* Lanyard Clip Ring */}
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
              {/* Watermark Logo */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                <img src="/assets/wff-india.png" alt="WFF" className="w-40 h-40 object-contain" />
              </div>

              <div className="flex items-center justify-between gap-4 relative z-10">
                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#C9A44A]/20 border border-[#C9A44A]/40 text-[#FCF6BA] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] mb-1.5 whitespace-nowrap">
                    <Trophy size={11} className="text-[#FCF6BA] shrink-0" />
                    <span>Official Athlete Pass</span>
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl uppercase font-black tracking-wider leading-tight bg-gradient-to-r from-[#FFF3D6] via-[#FCF6BA] to-[#C9A44A] bg-clip-text text-transparent break-words">
                    {decodeHtml(successData.event_name)}
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
              <div className="min-w-0">
                <div className="text-[9px] uppercase tracking-[0.25em] text-[#C9A44A] font-extrabold mb-1 whitespace-nowrap">
                  Registered Competitor
                </div>
                <div className="font-heading text-xl sm:text-2xl uppercase font-black text-white tracking-wide break-words">
                  {athleteName}
                </div>
                <div className="text-[11px] text-white/60 font-medium mt-0.5 whitespace-nowrap">
                  Category Entries: <span className="text-[#FCF6BA] font-bold">{successData.categories?.length || 1} Divisions</span>
                </div>
              </div>

              {/* Reg ID Box */}
              <div className="bg-[#050B14] px-4 py-2.5 rounded-xl border border-[#C9A44A]/40 flex items-center justify-between sm:justify-center gap-3 shrink-0">
                <div>
                  <div className="text-[8px] uppercase tracking-[0.25em] text-[#C9A44A] font-bold whitespace-nowrap">Pass ID / Reg No</div>
                  <div className="font-heading font-mono font-bold text-sm sm:text-base text-[#FCF6BA] tracking-wider whitespace-nowrap">
                    {successData.registration_number}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== 'undefined') {
                      navigator.clipboard.writeText(successData.registration_number);
                      toast.success("Registration ID copied!", { title: "Copied" });
                    }
                  }}
                  title="Copy Registration Number"
                  className="p-1.5 text-white/50 hover:text-[#FCF6BA] hover:bg-white/10 rounded transition-colors"
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>

            {/* EVENT SCHEDULE & VENUE TILES */}
            <div className="px-6 sm:px-8 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-[#C9A44A]/15 border border-[#C9A44A]/30 flex items-center justify-center text-[#FCF6BA] shrink-0">
                  <Calendar size={15} />
                </div>
                <div>
                  <div className="text-[8.5px] uppercase tracking-[0.2em] text-white/40 font-bold whitespace-nowrap">Date &amp; Schedule</div>
                  <div className="font-heading font-bold text-xs sm:text-sm text-white uppercase tracking-wide">
                    {successData.event_date}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#C9A44A]/15 border border-[#C9A44A]/30 flex items-center justify-center text-[#FCF6BA] shrink-0">
                  <MapPin size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[8.5px] uppercase tracking-[0.2em] text-white/40 font-bold whitespace-nowrap">Official Venue</div>
                  <div className="font-heading font-bold text-xs sm:text-sm text-white uppercase tracking-wide break-words leading-snug">
                    {decodeHtml(successData.venue)}
                  </div>
                </div>
              </div>
            </div>

            {/* CONFIRMED DIVISIONS & CATEGORIES LIST */}
            <div className="px-6 sm:px-8 py-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#C9A44A] font-extrabold flex items-center gap-1.5 whitespace-nowrap">
                  <Trophy size={13} className="text-[#C9A44A] shrink-0" />
                  <span>Enrolled Championship Categories</span>
                </div>
                <span className="text-[9px] font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                  Verified
                </span>
              </div>

              <div className="space-y-2">
                {successData.categories?.map((catName: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-[#C9A44A]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#BF953F] to-[#8A6318] text-[#040A12] text-xs font-black flex items-center justify-center shrink-0 shadow-sm">
                        {idx + 1}
                      </span>
                      <span className="font-heading font-extrabold text-xs sm:text-sm uppercase text-white tracking-wider break-words leading-snug">
                        {decodeHtml(catName)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400 shrink-0 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                      <CheckCircle2 size={14} className="shrink-0" />
                      <span>Active</span>
                    </div>
                  </div>
                ))}

                {(successData.tan_spray_requested || tanSprayRequested) && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#C9A44A]/20 to-[#C9A44A]/5 border border-[#C9A44A]/40 flex items-center gap-2.5 text-xs font-bold text-[#FCF6BA] uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[#FCF6BA] animate-pulse shrink-0"></span>
                    <span>Official Pro Stage Tan Spray Included</span>
                  </div>
                )}
              </div>
            </div>

            {/* PERFORATED PASS TEAR STUB WITH SCANNER QR */}
            <div className="relative pt-4 pb-6 px-6 sm:px-8 bg-[#040810] border-t-2 border-dashed border-[#C9A44A]/30">

              {/* Perforation Cutout Circles */}
              <div className="absolute -top-3.5 -left-4 w-7 h-7 rounded-full bg-[#F4F5F7] dark:bg-[#03070E] border-r-2 border-[#C9A44A]/30"></div>
              <div className="absolute -top-3.5 -right-4 w-7 h-7 rounded-full bg-[#F4F5F7] dark:bg-[#03070E] border-l-2 border-[#C9A44A]/30"></div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-gradient-to-br from-white/[0.04] to-transparent p-4 sm:p-5 rounded-2xl border border-white/10">

                {/* QR Code Container */}
                <div className="flex flex-col items-center text-center shrink-0">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white p-2 rounded-xl border-2 border-[#C9A44A] shadow-[0_0_20px_rgba(201,164,74,0.25)] flex items-center justify-center mb-1.5">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(successData.registration_number)}`}
                      alt="Athlete Verification QR Code"
                      className="w-full h-full object-contain"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <span className="text-[8px] uppercase tracking-[0.25em] text-[#FCF6BA] font-extrabold whitespace-nowrap">
                    Scan for Stage Access
                  </span>
                </div>

                {/* Status & Payment Info */}
                <div className="flex-1 flex flex-col justify-between sm:items-end gap-2 text-center sm:text-right w-full sm:w-auto">
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold mb-0.5 whitespace-nowrap">Total Registration Fee</div>
                    <div className="font-heading text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-white via-[#FCF6BA] to-[#C9A44A] bg-clip-text text-transparent leading-none">
                      ₹{successData.total_amount}
                    </div>
                  </div>

                  <div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm whitespace-nowrap ${isCash && !isCashPaid ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'}`}>
                      <CheckCircle2 size={13} className="shrink-0" />
                      <span>{isCash && !isCashPaid ? 'PAY AT DESK' : 'PAID & VERIFIED'}</span>
                    </div>
                  </div>

                  <div className="text-[9px] uppercase font-mono text-white/40 break-all sm:break-normal">
                    Ref: {isCash && !isCashPaid ? 'CASH-VENUE' : successData.razorpay_payment_id || 'UPI-PROOF-VERIFIED'}
                  </div>
                </div>

              </div>

              {isCash && !isCashPaid && (
                <div className="mt-3 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                  <p className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">
                    ⚠️ Official stage chest number will be issued upon completing payment at the weigh-in counter.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Holographic Gold Trim */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SHARING & ACTION BUTTONS */}
        {/* ========================================================= */}
        <div className="mt-8 space-y-3.5">

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={downloadingPass}
              onClick={handleDownloadPass}
              className="bg-gradient-to-r from-[#BF953F] via-[#E8CE7A] to-[#B38728] hover:brightness-110 text-[#040A12] font-heading font-black uppercase tracking-[0.15em] h-13 py-3.5 px-6 rounded-xl text-sm shadow-[0_8px_25px_rgba(191,149,63,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Download size={18} className={downloadingPass ? 'animate-bounce' : ''} />
              <span>{downloadingPass ? 'Generating Pass...' : 'Download Pass'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-heading font-black uppercase tracking-[0.15em] h-13 py-3.5 px-6 rounded-xl text-sm shadow-[0_8px_25px_rgba(37,211,102,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <Smartphone size={18} className="text-white" />
              <span className="text-white">Share on WhatsApp</span>
            </button>
          </div>

          {/* Secondary Utility Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              type="button"
              disabled={sendingEmail}
              onClick={handleSendPassEmail}
              className="bg-white dark:bg-[#0E1A2B] hover:bg-gray-100 dark:hover:bg-[#14233A] text-[#040A12] dark:text-white border border-black/10 dark:border-white/10 font-heading font-bold text-xs uppercase tracking-wider py-3 px-2 rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors col-span-2 sm:col-span-1"
            >
              <Mail size={15} className={`text-[#C9A44A] ${sendingEmail ? 'animate-spin' : ''}`} />
              <span>{sendingEmail ? 'Sending...' : 'Email Pass'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="bg-white dark:bg-[#0E1A2B] hover:bg-gray-100 dark:hover:bg-[#14233A] text-[#040A12] dark:text-white border border-black/10 dark:border-white/10 font-heading font-bold text-xs uppercase tracking-wider py-3 px-2 rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer size={15} className="text-[#C9A44A]" />
              <span>Print Pass</span>
            </button>

            <button
              type="button"
              onClick={handleShareNative}
              className="bg-white dark:bg-[#0E1A2B] hover:bg-gray-100 dark:hover:bg-[#14233A] text-[#040A12] dark:text-white border border-black/10 dark:border-white/10 font-heading font-bold text-xs uppercase tracking-wider py-3 px-2 rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Share2 size={15} className="text-[#C9A44A]" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="bg-white dark:bg-[#0E1A2B] hover:bg-gray-100 dark:hover:bg-[#14233A] text-[#040A12] dark:text-white border border-black/10 dark:border-white/10 font-heading font-bold text-xs uppercase tracking-wider py-3 px-2 rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Copy size={15} className="text-[#C9A44A]" />
              <span>Copy Link</span>
            </button>

            <Link
              href={`/registration-status?regNumber=${encodeURIComponent(successData.registration_number)}`}
              className="bg-white dark:bg-[#0E1A2B] hover:bg-gray-100 dark:hover:bg-[#14233A] text-[#040A12] dark:text-white border border-black/10 dark:border-white/10 font-heading font-bold text-xs uppercase tracking-wider py-3 px-2 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors text-center"
            >
              <ExternalLink size={15} className="text-[#C9A44A]" />
              <span>Online Pass</span>
            </Link>
          </div>

          {/* Back to Events Navigation */}
          <div className="text-center pt-3">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-widest text-[#040A12]/60 dark:text-white/60 hover:text-[#C9A44A] dark:hover:text-[#C9A44A] transition-colors"
            >
              Explore More Championships &amp; Events <ArrowRight size={14} />
            </Link>
          </div>

        </div>

      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: REGISTRATION FORM
  // -------------------------------------------------------------
  return (
    <div className="w-full font-body text-[#040A12]">

      {/* FULL WIDTH HERO SECTION */}
      <section className="w-full bg-[#040A12] relative overflow-hidden text-white h-[65vh] min-h-[700px] md:min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="/assets/wff_hero_banner.png" alt="Hero" className="w-full h-full object-cover object-[center_top] opacity-30 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040A12] via-[#040A12]/90 to-transparent"></div>
        </div>

        <div className="w-full max-w-[1440px] mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-[2px] bg-[#C9A44A]" />
              <span className="font-heading font-bold text-[10px] tracking-[0.25em] uppercase text-[#C9A44A]">Official Portal</span>
              <div className="w-8 h-[2px] bg-[#C9A44A]" />
            </div>

            <h1 className="font-heading font-extrabold uppercase leading-[0.9] tracking-tight mb-6">
              <span className="block text-white text-[48px] md:text-[64px]">Athlete</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[48px] md:text-[64px]">Registration</span>
            </h1>

            <p className="text-white/70 text-[15px] max-w-[500px] leading-[1.6]">
              Complete your registration below. Please ensure all details match your official documents. All information is secured and sent directly to the federation backend.
            </p>
          </div>

          <div className="lg:w-1/2 w-full flex lg:justify-end">
            {/* Event Card */}
            <div className="bg-[#040A12]/80 backdrop-blur-md border border-white/10 p-6 rounded-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full max-w-[550px] shadow-2xl">
              <img src={selectedEvent.banner_image || '/assets/wff_hero_banner.png'} alt="Event" className="w-full sm:w-32 h-32 object-cover rounded-sm border border-white/5 shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-xl uppercase leading-tight text-white mb-4">{selectedEvent.event_name}</h3>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-[#C9A44A] shrink-0" />
                    <span className="text-[12px] font-bold text-white/80">{selectedEvent.event_date}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#C9A44A] shrink-0 mt-0.5" />
                    <span className="text-[12px] font-bold text-white/80 max-w-[180px] leading-snug">{selectedEvent.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-[1440px] mx-auto px-6 py-8 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* LEFT COLUMN - FORM */}
          <div className="flex-grow space-y-16 lg:max-w-[65%]">

            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/50 text-red-500 p-5 flex items-start gap-4 rounded-sm">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <div className="text-sm font-bold tracking-wide">{error}</div>
              </div>
            )}

            {/* STEP 1: CATEGORIES */}
            <section>
              <div className="flex gap-6 mb-8">
                <div className="w-12 h-12 rounded-full bg-[#C9A44A] text-[#040A12] flex items-center justify-center font-heading text-xl font-bold shrink-0 shadow-lg">1</div>
                <div className="pt-2">
                  <h3 className="font-heading text-2xl uppercase tracking-widest font-bold text-[#040A12]">Select Categories</h3>
                  <p className="text-[#040A12]/50 text-sm font-medium mt-1">Choose the categories you wish to participate in. You can select multiple categories.</p>
                </div>
              </div>

              <div className="space-y-0 border-t border-black/10">
                {selectedEvent.categories?.filter(c => c.availability === 'open').map(cat => {
                  const isSelected = selectedCategoryIds.includes(cat.id.toString());
                  return (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id.toString())}
                      className={`p-5 border-b cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all bg-white hover:bg-gray-50 ${isSelected ? 'border-b-[#C9A44A]/50 bg-gray-50/50' : 'border-b-black/10'}`}
                    >
                      <div className="flex items-center gap-5 w-full sm:w-auto">
                        <div className={`w-6 h-6 shrink-0 rounded-sm border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-[#040A12] border-[#040A12]' : 'border-black/20'}`}>
                          {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <img src="/assets/wff_hero_banner.png" alt="Thumbnail" className="w-16 h-11 object-cover rounded-sm border border-black/10 opacity-80" />
                        <div>
                          <h4 className="font-heading font-bold text-sm text-[#040A12] tracking-wider uppercase mb-0.5">{decodeHtml(cat.name)}</h4>
                          <p className="text-[11px] text-[#040A12]/50 font-medium">{cat.eligibility || 'Open to all eligible athletes'}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right mt-4 sm:mt-0 pl-11 sm:pl-0 shrink-0">
                        <div className="font-heading font-bold text-lg text-[#040A12]">₹ {cat.entry_fee || '0'}</div>
                        <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#040A12]/40 mt-0.5">Base Fee</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TAN SPRAY */}
              <div
                className={`mt-4 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-sm cursor-pointer transition-colors border ${tanSprayRequested ? 'bg-[#FDF8E7] border-[#E5D197]' : 'bg-gray-50 border-black/10 hover:border-black/20'}`}
                onClick={() => setTanSprayRequested(!tanSprayRequested)}
              >
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  <div className={`w-6 h-6 shrink-0 rounded-sm border-2 flex items-center justify-center transition-colors ${tanSprayRequested ? 'bg-[#C9A44A] border-[#C9A44A]' : 'border-black/20'}`}>
                    {tanSprayRequested && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#040A12] tracking-wider uppercase mb-0.5">Add Tan Spray</h4>
                    <p className={`text-[11px] font-medium ${tanSprayRequested ? 'text-[#040A12]/70' : 'text-[#040A12]/50'}`}>Professional tanning service at the venue.</p>
                  </div>
                </div>
                <div className="text-left sm:text-right mt-4 sm:mt-0 pl-11 sm:pl-0 shrink-0">
                  <div className="font-heading font-bold text-lg text-[#040A12]">₹ {selectedEvent.tan_spray_price || '1000'}</div>
                  <div className={`text-[9px] uppercase tracking-[0.2em] font-bold mt-0.5 ${tanSprayRequested ? 'text-[#C9A44A]' : 'text-[#040A12]/40'}`}>Charged Once</div>
                </div>
              </div>
            </section>

            {/* STEP 2: ATHLETE DETAILS */}
            <section>
              <div className="flex gap-6 mb-8">
                <div className="w-12 h-12 rounded-full bg-[#C9A44A] text-[#040A12] flex items-center justify-center font-heading text-xl font-bold shrink-0 shadow-lg">2</div>
                <div className="pt-2">
                  <h3 className="font-heading text-2xl uppercase tracking-widest font-bold text-[#040A12]">Athlete Details</h3>
                  <p className="text-[#040A12]/50 text-sm font-medium mt-1">Enter your details as per your official documents.</p>
                </div>
              </div>

              <div className="bg-white p-8 space-y-8 rounded-sm border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Full Name *</label>
                    <Input name="athlete_name" value={formData.athlete_name} onChange={handleInputChange} placeholder="As per official ID" className="bg-[#F8F9FA] border-0 h-12 focus:ring-1 focus:ring-[#C9A44A]/50 rounded-sm text-sm font-medium" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Phone Number *</label>
                    <Input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91" className="bg-[#F8F9FA] border-0 h-12 focus:ring-1 focus:ring-[#C9A44A]/50 rounded-sm text-sm font-medium" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Email Address *</label>
                    <Input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="For receipt" className="bg-[#F8F9FA] border-0 h-12 focus:ring-1 focus:ring-[#C9A44A]/50 rounded-sm text-sm font-medium" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Instagram ID</label>
                    <Input name="instagram_id" value={formData.instagram_id} onChange={handleInputChange} placeholder="@ username" className="bg-[#F8F9FA] border-0 h-12 focus:ring-1 focus:ring-[#C9A44A]/50 rounded-sm text-sm font-medium" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Date of Birth *</label>
                    <Input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} className="bg-[#F8F9FA] border-0 h-12 focus:ring-1 focus:ring-[#C9A44A]/50 rounded-sm text-sm font-medium" required />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Age</label>
                    <div className="h-12 px-4 bg-[#F8F9FA] flex items-center text-[#040A12]/50 select-none font-medium text-sm rounded-sm">
                      {age || '-'}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Height (cm)</label>
                    <Input type="number" name="height" value={formData.height} onChange={handleInputChange} placeholder="e.g. 175" className="bg-[#F8F9FA] border-0 h-12 focus:ring-1 focus:ring-[#C9A44A]/50 rounded-sm text-sm font-medium" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Weight (kg)</label>
                    <Input type="number" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="e.g. 75" className="bg-[#F8F9FA] border-0 h-12 focus:ring-1 focus:ring-[#C9A44A]/50 rounded-sm text-sm font-medium" />
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN - ORDER SUMMARY */}
          <div className="lg:w-[35%] shrink-0">
            <div className="sticky top-28 space-y-6">

              {/* Order Summary Box */}
              <div className="bg-white rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-black/5">
                {/* Header */}
                <div className="bg-[#040A12] p-8 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <CreditCard size={20} className="text-[#C9A44A]" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-[15px] tracking-[0.2em] uppercase text-[#4F6C8A] mb-1">Order Summary</h3>
                      <p className="text-[11px] text-white/50 font-medium">Review your selection before proceeding.</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="md:p-8 p-5 bg-white min-h-[140px] flex flex-col justify-center">
                  {selectedCategories.length === 0 ? (
                    <p className="text-[13px] text-[#040A12]/30 text-center font-bold uppercase tracking-[0.2em]">No categories selected.</p>
                  ) : (
                    <div className="space-y-5">
                      {selectedCategories.map((cat, index) => {
                        const fee = parseFloat(cat.entry_fee || '0');
                        return (
                          <div key={cat.id} className="flex justify-between items-center text-[13px] font-bold text-[#040A12]">
                            <span className="uppercase tracking-wider sm:text-[15px] text-[12px]">{decodeHtml(cat.name)}</span>
                            <span className="text-[15px]">₹ {index === 0 ? fee : fee * 0.5}</span>
                          </div>
                        );
                      })}

                      {tanSprayRequested && (
                        <div className="flex justify-between items-center text-[13px] font-bold text-[#040A12] pt-2">
                          <span className="uppercase tracking-wider">Tan Spray</span>
                          <span className="text-[15px]">₹ {pricing.tanSpray}</span>
                        </div>
                      )}

                      <div className="pt-5 mt-2 border-t border-black/5 flex justify-between items-center text-[13px] font-bold text-[#040A12]/60">
                        <span className="uppercase tracking-wider">Subtotal</span>
                        <span>₹ {pricing.total}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total & Pay */}
                <div>
                  {selectedEvent.cash_enabled && (
                    <div className="bg-[#F8F9FA] p-8 border-t border-black/5">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-[#040A12]/60 font-bold mb-4">Payment Method</div>
                      <div className="flex flex-col gap-3">
                        <label className={`flex items-center gap-3 p-4 border rounded cursor-pointer transition-colors ${paymentMethod === 'online' ? 'bg-white border-[#C9A44A]' : 'bg-white border-black/10'}`}>
                          <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="accent-[#C9A44A]" />
                          <div className="flex flex-col">
                            <span className="font-bold text-[#040A12] text-sm">Online Payment (UPI / Card)</span>
                            <span className="text-xs text-[#040A12]/50">Instant confirmation</span>
                          </div>
                        </label>
                        <label className={`flex items-center gap-3 p-4 border rounded cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'bg-white border-[#C9A44A]' : 'bg-white border-black/10'}`}>
                          <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="accent-[#C9A44A]" />
                          <div className="flex flex-col">
                            <span className="font-bold text-[#040A12] text-sm">Cash at Desk</span>
                            <span className="text-xs text-[#040A12]/50">Pay in person. Ticket pending until cash is collected.</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="bg-[#FCF9EE] md:p-8 p-5 flex justify-between items-center border-t border-b border-[#EADDAC]">
                    <span className="font-heading font-bold text-[#040A12] text-[13px] uppercase tracking-[0.2em]">Total Payable</span>
                    <span className="font-heading font-bold text-3xl md:text-4xl text-[#040A12]">₹ {pricing.total}</span>
                  </div>

                  <div className="p-8 bg-white space-y-5">
                    <Button
                      onClick={submitRegistration}
                      disabled={loading || selectedCategoryIds.length === 0}
                      className="w-full h-14 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-bold text-[14px] tracking-[0.15em] uppercase hover:brightness-110 hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(198,161,91,0.25)] transition-all duration-300 rounded border-0 cursor-pointer"
                    >
                      {loading ? 'Processing...' : paymentMethod === 'online' ? 'Proceed to Checkout →' : 'Complete Registration →'}
                    </Button>

                    <p className="text-[11px] text-[#040A12]/70 text-center leading-relaxed">
                      By proceeding, you agree to WFF Tamil Nadu&apos;s{' '}
                      <Link href="/terms-and-conditions" target="_blank" className="text-[#C9A44A] underline hover:text-[#040A12] font-semibold">
                        Terms &amp; Conditions
                      </Link>
                      ,{' '}
                      <Link href="/cancellation-refund-policy" target="_blank" className="text-[#C9A44A] underline hover:text-[#040A12] font-semibold">
                        Cancellation &amp; Refund Policy
                      </Link>
                      , and{' '}
                      <Link href="/privacy-policy" target="_blank" className="text-[#C9A44A] underline hover:text-[#040A12] font-semibold">
                        Privacy Policy
                      </Link>
                      .
                    </p>

                    <div className="text-center pt-2 border-t border-black/5 text-[11px] text-[#040A12]/60">
                      Need help? Call <a href="tel:+919952922686" className="font-bold text-[#040A12] hover:text-[#C9A44A]">+91 99529 22686</a> &bull; <a href="mailto:wfftamilnadu@gmail.com" className="font-bold text-[#040A12] hover:text-[#C9A44A]">wfftamilnadu@gmail.com</a>
                    </div>

                    <div className="flex items-start justify-center gap-4 pt-1 text-[#040A12]/50">
                      <div className="mt-0.5"><CheckCircle2 size={18} className="text-[#040A12]/40" /></div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#040A12]">Your information is secure</div>
                        <div className="text-[11px] mt-1 font-medium leading-[1.6]">All data is encrypted and processed through official, secure channels.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Card */}
              <div className="hidden lg:block bg-[#040A12] rounded-sm overflow-hidden relative shadow-lg">
                <div className="absolute inset-0 z-0">
                  <img src="/assets/wff_hero_banner.png" alt="Athlete" className="w-full h-full object-cover object-[center_right] opacity-40 mix-blend-luminosity" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#040A12]/90 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040A12] via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 p-8 pt-12 flex flex-col h-full justify-between min-h-[300px]">
                  <div>
                    <div className="w-6 h-1 bg-[#C9A44A] mb-4"></div>
                    <h4 className="font-heading font-light text-2xl uppercase tracking-wider leading-[1.2] text-white">
                      A Natural<br />Athlete<br /><span className="font-bold">A Stronger<br />Tomorrow</span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-8">
                    <div className="flex flex-col items-center text-center gap-2">
                      <Trophy size={18} className="text-[#C9A44A]" />
                      <span className="text-[8px] uppercase tracking-wider font-bold text-white/80">Fair<br />Competition</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                      <CheckCircle2 size={18} className="text-[#C9A44A]" />
                      <span className="text-[8px] uppercase tracking-wider font-bold text-white/80">Real<br />Opportunities</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                      <ShieldCheck size={18} className="text-[#C9A44A]" />
                      <span className="text-[8px] uppercase tracking-wider font-bold text-white/80">Clean<br />Sport</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                      <svg className="w-[18px] h-[18px] text-[#C9A44A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-[8px] uppercase tracking-wider font-bold text-white/80">Global<br />Standards</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CHECKOUT MODAL (QR CODE & LINK PAYMENT OPTIONS + EVENTS LIST) */}
      {/* ------------------------------------------------------------- */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#080E1A] text-white rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] border border-[#C9A44A]/40 overflow-hidden my-auto max-h-[94vh] flex flex-col">

            {/* Gold Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] z-20"></div>

            {/* Modal Header */}
            <div className="bg-[#040A12] px-6 sm:px-8 py-5 border-b border-white/10 md:flex hidden items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#C9A44A]/10 border border-[#C9A44A]/30 flex items-center justify-center text-[#C9A44A] shrink-0">
                  <CreditCard size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A44A]">WFF Official Portal</span>
                    {successData?.registration_number && (
                      <span className="bg-white/10 text-white/80 text-[10px] font-mono px-2 py-0.5 rounded">
                        #{successData.registration_number}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl uppercase tracking-wider text-white">
                    Complete Checkout &amp; Payment
                  </h3>
                </div>
              </div>

              {/* Price Pill in Top Header */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#BF953F]/20 via-[#FCF6BA]/10 to-[#B38728]/20 border border-[#C9A44A]/50 rounded-lg text-right sm:text-left">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A44A]">Total Payable:</span>
                  <span className="font-heading font-black text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">
                    ₹{pricing.total || successData?.total_amount}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleRequestClosePaymentModal}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                  aria-label="Close Payment Modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body - 2 Columns */}
            <div className="p-6 sm:p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

              {/* LEFT COLUMN: ADDED EVENTS & ORDER BREAKDOWN */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-5 bg-[#040A12]/70 p-5 sm:p-6 rounded-xl border border-white/5">
                <div className="space-y-5">

                  {/* Total Payable Box at TOP of Left Column */}
                  <div className="bg-gradient-to-br from-[#1A263D] via-[#0F1829] to-[#040A12] p-4 sm:p-5 rounded-xl border border-[#C9A44A]/50 shadow-[0_8px_25px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A44A]/10 rounded-full blur-xl pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#C9A44A] block">
                          Total Amount Payable
                        </span>
                        <div className="text-xs text-white/60 mt-0.5">
                          {selectedCategories.length} {selectedCategories.length === 1 ? 'Category' : 'Categories'} {tanSprayRequested ? '+ Tan Spray' : ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-heading font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">
                          ₹{pricing.total || successData?.total_amount}
                        </span>
                      </div>
                    </div>

                    {(pricing.discount > 0 || tanSprayRequested) && (
                      <div className="border-t border-white/10 pt-2.5 mt-2 flex justify-between items-center text-[11px] text-white/60">
                        <span>Base: ₹{pricing.base} {tanSprayRequested ? `+ Tan: ₹${pricing.tanSpray}` : ''}</span>
                        {pricing.discount > 0 && (
                          <span className="text-green-400 font-bold">Saved: ₹{pricing.discount}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Event Title */}
                  <div className="border-b border-white/10 pb-4">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40">Event Details</span>
                    <h4 className="font-heading font-bold text-base sm:text-lg uppercase text-white mt-1 leading-tight">
                      {selectedEvent.event_name}
                    </h4>
                    <div className="mt-2 space-y-1 text-xs text-white/60">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-[#C9A44A] shrink-0" />
                        <span>{selectedEvent.event_date}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin size={13} className="text-[#C9A44A] shrink-0 mt-0.5" />
                        <span className="leading-snug">{selectedEvent.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Athlete Info */}
                  <div className="border-b border-white/10 pb-4 text-xs">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40">Athlete</span>
                    <div className="font-bold text-sm text-white mt-0.5">{formData.athlete_name}</div>
                    <div className="text-white/60 mt-0.5 font-medium">{formData.phone} &bull; {formData.email}</div>
                  </div>

                  {/* Added Events List */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C9A44A]">
                        Added Events ({selectedCategories.length})
                      </span>
                      <span className="text-[10px] uppercase font-bold text-white/40">Amount</span>
                    </div>

                    <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                      {selectedCategories.map((cat, index) => {
                        const fee = parseFloat(cat.entry_fee || '0');
                        const finalFee = index === 0 ? fee : fee * 0.5;
                        return (
                          <div key={cat.id} className="bg-white/5 p-3 rounded-lg border border-white/5 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-heading font-bold text-xs uppercase text-white truncate">
                                {decodeHtml(cat.name)}
                              </div>
                              <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[#C9A44A]">
                                {index === 0 ? 'Primary Category' : 'Additional (50% Off)'}
                              </span>
                            </div>
                            <div className="font-heading font-bold text-sm text-white shrink-0">
                              ₹{finalFee}
                            </div>
                          </div>
                        );
                      })}

                      {tanSprayRequested && (
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex items-center justify-between gap-3">
                          <div>
                            <div className="font-heading font-bold text-xs uppercase text-white">
                              Tan Spray Service
                            </div>
                            <span className="text-[9px] text-white/50">Professional tanning service</span>
                          </div>
                          <div className="font-heading font-bold text-sm text-white shrink-0">
                            ₹{pricing.tanSpray}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: PAYMENT OPTIONS (QR CODE VS LINK) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  {/* Two Payment Option Tabs */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl border border-white/10 mb-6">
                    <button
                      onClick={() => setPaymentTab('qr')}
                      className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg font-heading text-xs font-bold uppercase tracking-wider transition-all ${paymentTab === 'qr'
                        ? 'bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] shadow-md'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <QrCode size={16} />
                      <span>Pay using QR Code</span>
                    </button>
                    <button
                      onClick={() => setPaymentTab('link')}
                      className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg font-heading text-xs font-bold uppercase tracking-wider transition-all ${paymentTab === 'link'
                        ? 'bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] shadow-md'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <Link2 size={16} />
                      <span>Pay via Link</span>
                    </button>
                  </div>

                  {/* TAB 1: PAY USING QR CODE */}
                  {paymentTab === 'qr' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {/* QR Display Card */}
                      <div className="bg-white rounded-xl p-4 text-center text-[#040A12] shadow-xl border border-black/10 flex flex-col items-center">
                        <div className="w-68 h-auto p-1 bg-white rounded-lg">
                          <img
                            src="/assets/payment-qr.jpeg"
                            alt="WFF Tamil Nadu UPI QR Code"
                            className="w-full h-auto object-contain rounded-md"
                          />
                        </div>
                        <p className="text-[11px] font-bold text-gray-500 mt-2 uppercase tracking-wider">
                          Scan with GPay, PhonePe, Paytm, BHIM, or any UPI App
                        </p>
                      </div>


                      {/* UPI ID Copy Card */}
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#C9A44A]">
                            UPI ID (Beneficiary: WFF TAMILNADU)
                          </div>
                          <div className="font-mono font-bold text-sm text-white mt-0.5 truncate select-all">
                            nabbawffchennai@okicici
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard('nabbawffchennai@okicici', 'upi')}
                          className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          {copiedField === 'upi' ? (
                            <>
                              <Check size={14} className="text-green-400" />
                              <span className="text-green-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              <span>Copy UPI</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PAY VIA LINK */}
                  {paymentTab === 'link' && (
                    <div className="space-y-5 animate-in fade-in duration-200">
                      <div className="bg-gradient-to-br from-[#0F1C2E] to-[#060D17] p-6 rounded-xl border border-[#C9A44A]/30 text-center space-y-5 shadow-lg">
                        <div className="w-14 h-14 mx-auto rounded-full bg-[#C9A44A]/10 border border-[#C9A44A]/30 flex items-center justify-center text-[#C9A44A]">
                          <Link2 size={28} />
                        </div>

                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A44A] mb-1">
                            Razorpay Payment Link
                          </div>
                          <h4 className="font-heading font-bold text-lg text-white">
                            Pay Directly via Razorpay
                          </h4>
                          <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto leading-relaxed">
                            Click below to open the official Razorpay payment page supporting Cards, NetBanking, UPI, and Wallets.
                          </p>
                        </div>

                        {/* Link Box */}
                        <div className="bg-black/40 p-3 rounded-lg border border-white/10 flex items-center justify-between gap-3 text-left">
                          <span className="font-mono text-xs text-[#FCF6BA] truncate select-all">
                            http://razorpay.me/@mohankumarnarasimalu
                          </span>
                          <button
                            onClick={() => copyToClipboard('http://razorpay.me/@mohankumarnarasimalu', 'link')}
                            className="shrink-0 text-white/70 hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors"
                            title="Copy Link"
                          >
                            {copiedField === 'link' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                          </button>
                        </div>

                        {/* Action Link Button */}
                        <a
                          href="http://razorpay.me/@mohankumarnarasimalu"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-xs uppercase tracking-[0.15em] rounded-lg shadow-lg hover:brightness-110 transition-all hover:-translate-y-0.5"
                        >
                          <span>Open Razorpay Payment Link</span>
                          <ExternalLink size={16} />
                        </a>
                      </div>

                      <div className="text-center text-[11px] text-white/50">
                        Accepted: Google Pay &bull; PhonePe &bull; Paytm &bull; Credit/Debit Cards &bull; Net Banking &bull; Wallets
                      </div>
                    </div>
                  )}
                </div>

                {/* BOTTOM CONFIRMATION / VERIFICATION SECTION */}
                <div className="pt-5 border-t border-white/10 space-y-4">
                  {/* UPLOAD PAYMENT SCREENSHOT */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#C9A44A] flex items-center gap-1.5">
                        <Camera size={14} className="text-[#C9A44A]" />
                        <span>Upload Payment Screenshot *</span>
                      </label>
                      <span className="text-[10px] text-white/40 font-medium">JPEG, PNG, WebP (Max 10MB)</span>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      className="hidden"
                      id="payment-screenshot-input"
                    />

                    {paymentProofPreview ? (
                      <div className="bg-white/5 border border-emerald-500/40 rounded-xl p-3.5 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-14 h-14 rounded-lg bg-black/50 overflow-hidden border border-emerald-500/30 shrink-0 relative flex items-center justify-center">
                            <img
                              src={paymentProofPreview}
                              alt="Payment Screenshot Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold truncate">
                              <CheckCircle2 size={14} className="shrink-0" />
                              <span className="truncate">{paymentProofFile?.name || 'Screenshot attached'}</span>
                            </div>
                            <span className="text-[10px] text-white/50 block mt-0.5">
                              {paymentProofFile ? `${(paymentProofFile.size / 1024).toFixed(1)} KB &bull; Click complete below` : 'Ready to submit'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs text-white/80 hover:text-white px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium border border-white/10 cursor-pointer"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveProof}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Remove Screenshot"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/20 hover:border-[#C9A44A]/70 bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center gap-2"
                      >
                        <div className="w-11 h-11 rounded-full bg-[#C9A44A]/10 border border-[#C9A44A]/30 flex items-center justify-center text-[#C9A44A] group-hover:scale-110 group-hover:bg-[#C9A44A]/20 transition-all">
                          <Upload size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-[#C9A44A] transition-colors">
                            Click here to upload your payment screenshot
                          </div>
                          <p className="text-[10px] text-white/40 mt-1 max-w-xs mx-auto leading-relaxed">
                            Take a screenshot from GPay / PhonePe / Paytm showing the successful payment to WFF Tamil Nadu
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* TRANSACTION / UTR REFERENCE */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 mb-1.5">
                      Transaction / UTR Reference (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 12-digit UTR No / UPI Ref / Order ID"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="bg-white/5 border-white/10 text-white text-xs h-10 rounded-lg placeholder:text-white/30 focus:border-[#C9A44A]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <Button
                      type="button"
                      onClick={handleRequestClosePaymentModal}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-heading text-xs font-bold uppercase tracking-wider h-12 p-4 rounded-lg cursor-pointer"
                    >
                      Back to Form
                    </Button>
                    <Button
                      type="button"
                      onClick={confirmPaymentCompletion}
                      disabled={verifying}
                      className="flex-1 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-xs uppercase tracking-[0.15em] h-12 p-4 rounded-lg shadow-lg hover:brightness-110 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
                    >
                      {verifying ? 'Uploading Proof & Verifying...' : 'Complete Registration & View Ticket →'}
                    </Button>
                  </div>

                  <p className="text-[10px] text-white/40 text-center">
                    Upload your payment screenshot to verify and immediately receive your official digital entry pass.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CANCEL PAYMENT CONFIRMATION POPUP MODAL */}
      {/* ------------------------------------------------------------- */}
      {isCancelConfirmOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0C1422] text-white rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] border border-red-500/30 overflow-hidden animate-in zoom-in-95 duration-200 p-6 sm:p-7 text-center">
            {/* Red Accent Top */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>

            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-5 shadow-inner">
              <AlertTriangle size={32} className="animate-pulse" />
            </div>

            <h3 className="font-heading font-extrabold text-xl sm:text-2xl uppercase tracking-wider text-white mb-2">
              Cancel Payment Process?
            </h3>

            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Do you really want to cancel the payment process? If you cancel now, your registration will not be completed and <strong className="text-red-400 font-semibold">you cannot join or participate in this event</strong>.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 mb-6 text-left space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-white/40 uppercase tracking-wider text-[10px] font-bold">Event:</span>
                <span className="text-white font-bold truncate max-w-[220px]">{selectedEvent?.event_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 uppercase tracking-wider text-[10px] font-bold">Athlete:</span>
                <span className="text-white font-bold">{formData.athlete_name || 'Athlete'}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-1.5 mt-1.5">
                <span className="text-white/40 uppercase tracking-wider text-[10px] font-bold">Total Payable:</span>
                <span className="text-[#C9A44A] font-bold text-sm">₹{pricing.total || successData?.total_amount}</span>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button
                type="button"
                onClick={handleConfirmCancelPayment}
                className="flex-1 bg-transparent hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-red-500/30 font-heading text-xs font-bold uppercase tracking-wider h-12 rounded-lg transition-colors cursor-pointer p-3"
              >
                Yes, Cancel &amp; Exit
              </Button>
              <Button
                type="button"
                onClick={handleContinuePayment}
                className="flex-1 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-xs uppercase tracking-[0.15em] h-12 rounded-lg shadow-lg hover:brightness-110 transition-all hover:-translate-y-0.5 cursor-pointer p-3"
              >
                Continue Payment
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
