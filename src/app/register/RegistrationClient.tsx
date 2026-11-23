"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Event, EventCategory } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Trophy, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  ArrowLeft,
  Upload, 
  Camera, 
  Clock, 
  ShieldAlert, 
  Smartphone, 
  Trash2,
  Receipt
} from 'lucide-react';
import { API_BASE } from '@/lib/api';
import { toast } from '@/components/ui/Toast';
import { formatEventDateRange } from '@/lib/utils';
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

  // Pre-selected event from URL parameter, or South India Natural League 2027 (ID 11), or first available
  const selectedEvent = events.find(e => e.id.toString() === initialEventId || e.slug === initialEventId) 
    || events.find(e => e.id === 11 || e.slug === 'south-india-natural-league-2027') 
    || events[0] || null;

  // Check if current event is South India Natural League 2027 or India Natural 2027
  const isSouthIndiaLeague = Boolean(
    selectedEvent && (
      selectedEvent.id === 11 || 
      selectedEvent.slug === 'south-india-natural-league-2027' || 
      selectedEvent.event_name?.toLowerCase().includes('south india')
    )
  );

  const isIndiaNatural = Boolean(
    selectedEvent && (
      selectedEvent.id === 12 || 
      selectedEvent.slug === 'india-natural-2027' || 
      selectedEvent.event_name?.toLowerCase().includes('india natural')
    )
  );

  const isTieredLeague = isSouthIndiaLeague || isIndiaNatural;

  // Active Step: 1 = Athlete Details, 2 = Category Selection & Fee, 3 = UPI Payment & Proof Upload
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Step 1: Athlete basic details only (no ID documents, no address, no gym)
  const [formData, setFormData] = useState({
    athlete_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    height: ''
  });

  // Step 2: Selected categories & filter
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [tanSprayRequested, setTanSprayRequested] = useState(false);

  // Step 3: Payment Screenshot & UTR
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const paymentProofInputRef = useRef<HTMLInputElement | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Loading & Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState<any>(null);

  // Scroll to top when activeStep changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStep]);

  // Automatically calculate age from Date of Birth
  const calculatedAge = useMemo(() => {
    if (!formData.date_of_birth) return '';
    const birthDate = new Date(formData.date_of_birth);
    if (isNaN(birthDate.getTime())) return '';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age.toString() : '';
  }, [formData.date_of_birth]);

  // Derived selected category objects
  const selectedCategories = useMemo(() => {
    if (!selectedEvent?.categories) return [];
    return selectedCategoryIds
      .map(id => selectedEvent.categories?.find(c => c.id.toString() === id))
      .filter(Boolean) as EventCategory[];
  }, [selectedEvent, selectedCategoryIds]);

  // Derived Pricing Calculations
  // South India Natural League 2027: Official Tiered Pricing (Single: ₹3k, Double: ₹5k, Triple: ₹6k) + Mandatory Clinical Testing Charge (₹2,000 per athlete)
  // Other events: Legacy 50% discount on additional divisions
  const pricing = useMemo(() => {
    if (selectedCategories.length === 0) {
      return { 
        base: 0, 
        discount: 0, 
        categoryFee: 0, 
        clinicalCharge: isTieredLeague ? 2000 : 0, 
        tanSpray: 0, 
        total: 0, 
        firstCategoryFee: 0, 
        additionalFee: 0,
        tierLabel: ''
      };
    }

    if (isTieredLeague) {
      const count = selectedCategories.length;
      let categoryFee = 3000;
      let tierLabel = 'Single Category';
      if (count === 1) {
        categoryFee = 3000;
        tierLabel = 'Single Category';
      } else if (count === 2) {
        categoryFee = 5000;
        tierLabel = 'Double Category';
      } else if (count >= 3) {
        categoryFee = 6000;
        tierLabel = 'Triple Category';
      }

      const clinicalCharge = 2000; // Mandatory clinical testing charge per athlete
      const eventTanSprayPrice = selectedEvent?.tan_spray_price ? parseFloat(selectedEvent.tan_spray_price) : 1500;
      const tanSpray = tanSprayRequested ? eventTanSprayPrice : 0;
      const total = categoryFee + clinicalCharge + tanSpray;

      return {
        base: categoryFee,
        discount: 0,
        categoryFee,
        clinicalCharge,
        tanSpray,
        total,
        firstCategoryFee: categoryFee,
        additionalFee: 0,
        tierLabel
      };
    }

    // Standard / Legacy calculation for other events
    let base = 0;
    let discount = 0;
    let firstCategoryFee = 0;
    let additionalFee = 0;

    selectedCategories.forEach((cat, index) => {
      const fee = parseFloat(cat.entry_fee || '0');
      base += fee;
      if (index === 0) {
        firstCategoryFee = fee;
      } else {
        const discounted = fee * 0.5;
        additionalFee += discounted;
        discount += (fee * 0.5);
      }
    });

    const eventTanSprayPrice = selectedEvent?.tan_spray_price ? parseFloat(selectedEvent.tan_spray_price) : 1500;
    const tanSpray = tanSprayRequested ? eventTanSprayPrice : 0;
    const categoryFee = base - discount;
    const total = categoryFee + tanSpray;

    return { 
      base, 
      discount, 
      categoryFee, 
      clinicalCharge: 0, 
      tanSpray, 
      total, 
      firstCategoryFee, 
      additionalFee,
      tierLabel: '' 
    };
  }, [selectedCategories, tanSprayRequested, selectedEvent, isTieredLeague]);

  // Eligibility checking helper
  const checkEligibility = (catName: string, eligibilityDesc: string = '') => {
    const ageNum = calculatedAge ? parseInt(calculatedAge, 10) : null;
    const heightNum = formData.height ? parseFloat(formData.height) : null;
    const fullText = (catName + ' ' + eligibilityDesc).toLowerCase();

    // Check Teenager (Up to 18)
    if (fullText.includes('teenager') || fullText.includes('up to 18')) {
      if (ageNum !== null) {
        if (ageNum <= 18) return { status: 'eligible', text: `Eligible (Age ${ageNum} ≤ 18)` };
        return { status: 'warning', text: `Age Notice: Up to 18 yrs (Your age: ${ageNum})` };
      }
    }
    // Check Sub Junior (Up to 20)
    if (fullText.includes('sub junior') || fullText.includes('up to 20')) {
      if (ageNum !== null) {
        if (ageNum <= 20) return { status: 'eligible', text: `Eligible (Age ${ageNum} ≤ 20)` };
        return { status: 'warning', text: `Age Notice: Up to 20 yrs (Your age: ${ageNum})` };
      }
    }
    // Check Junior (Up to 23)
    if (fullText.includes('junior') || fullText.includes('up to 23')) {
      if (ageNum !== null) {
        if (ageNum <= 23) return { status: 'eligible', text: `Eligible (Age ${ageNum} ≤ 23)` };
        return { status: 'warning', text: `Age Notice: Up to 23 yrs (Your age: ${ageNum})` };
      }
    }
    // Check Masters (Above 40)
    if (fullText.includes('masters') && fullText.includes('above 40')) {
      if (ageNum !== null) {
        if (ageNum > 40) return { status: 'eligible', text: `Eligible (Age ${ageNum} > 40)` };
        return { status: 'warning', text: `Age Notice: Above 40 yrs (Your age: ${ageNum})` };
      }
    }
    // Check Master's (Above 50)
    if (fullText.includes("master's") || (fullText.includes('masters') && fullText.includes('above 50'))) {
      if (ageNum !== null) {
        if (ageNum > 50) return { status: 'eligible', text: `Eligible (Age ${ageNum} > 50)` };
        return { status: 'warning', text: `Age Notice: Above 50 yrs (Your age: ${ageNum})` };
      }
    }
    // Check Senior Short (Up to 1.65 metres / 165 cm)
    if (fullText.includes('senior short') || fullText.includes('up to 1.65')) {
      if (heightNum !== null) {
        if (heightNum <= 165) return { status: 'eligible', text: `Eligible (Height ${heightNum}cm ≤ 165cm)` };
        return { status: 'warning', text: `Height Notice: Up to 1.65m (Your height: ${heightNum}cm)` };
      }
    }
    // Check Senior Tall (Above 1.65 metres / 165 cm)
    if (fullText.includes('senior tall') || fullText.includes('above 1.65')) {
      if (heightNum !== null) {
        if (heightNum > 165) return { status: 'eligible', text: `Eligible (Height ${heightNum}cm > 165cm)` };
        return { status: 'warning', text: `Height Notice: Above 1.65m (Your height: ${heightNum}cm)` };
      }
    }
    return null;
  };

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategoryIds(prev => {
      const alreadySelected = prev.includes(catId);
      if (alreadySelected) {
        return prev.filter(id => id !== catId);
      }
      // If Tiered League, restrict to maximum 3 categories
      if (isTieredLeague && prev.length >= 3) {
        toast.warning(`${selectedEvent?.event_name || 'This championship'} allows a maximum of 3 competition categories (Triple Category entry).`, {
          title: "Maximum Categories Reached"
        });
        return prev;
      }
      return [...prev, catId];
    });
  };

  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (JPG, PNG, or WebP).');
      toast.error('Invalid file format. Please upload JPG, PNG, or WebP.');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Payment screenshot must be under 10MB.');
      toast.error('File too large (max 10MB).');
      return;
    }

    setError('');
    setPaymentProofFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentProofPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    toast.success('Screenshot attached successfully');
  };

  const copyUpiToClipboard = () => {
    const upiId = "nabbawffchennai@okicici";
    navigator.clipboard.writeText(upiId).then(() => {
      setCopiedUpi(true);
      toast.success("UPI ID copied to clipboard: " + upiId);
      setTimeout(() => setCopiedUpi(false), 2500);
    });
  };

  // STEP 1 VALIDATION
  const validateStep1 = (): boolean => {
    setError('');
    if (!formData.athlete_name.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    const phoneClean = formData.phone.replace(/\D/g, '');
    if (!phoneClean || phoneClean.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address for ticket delivery.');
      return false;
    }
    if (!formData.date_of_birth) {
      setError('Please select your date of birth.');
      return false;
    }
    const heightNum = parseFloat(formData.height);
    if (isNaN(heightNum) || heightNum <= 50 || heightNum >= 250) {
      setError('Please enter a valid height in centimetres (e.g. 175).');
      return false;
    }
    return true;
  };

  const goToStep2 = () => {
    if (validateStep1()) {
      setActiveStep(2);
    }
  };

  const goToStep3 = () => {
    setError('');
    if (selectedCategoryIds.length === 0) {
      setError('Please select at least one competition division to proceed.');
      return;
    }
    setActiveStep(3);
  };

  // FINAL SUBMISSION HANDLER
  const handleSubmitRegistration = async () => {
    if (!validateStep1()) {
      setActiveStep(1);
      return;
    }
    if (selectedCategoryIds.length === 0) {
      setError('Please select at least one division.');
      setActiveStep(2);
      return;
    }
    if (!paymentProofFile) {
      setError('Please upload your UPI payment screenshot to complete registration.');
      toast.warning('Payment screenshot is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create registration record
      const regPayload = {
        event_id: selectedEvent.id,
        category_ids: selectedCategoryIds.map(id => parseInt(id, 10)),
        athlete_name: formData.athlete_name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        date_of_birth: formData.date_of_birth,
        height: parseFloat(formData.height),
        tan_spray_requested: tanSprayRequested,
        payment_method: 'upi'
      };

      const res = await fetch(`${API_BASE}/registrations/create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regPayload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Registration creation failed.');
      }

      const regNumber = json.data.registration_number;

      // 2. Upload payment proof screenshot
      const formDataUpload = new FormData();
      formDataUpload.append('registration_number', regNumber);
      formDataUpload.append('screenshot', paymentProofFile);
      if (transactionRef.trim()) {
        formDataUpload.append('transaction_ref', transactionRef.trim());
      }

      const uploadRes = await fetch(`${API_BASE}/registrations/upload-proof.php`, {
        method: 'POST',
        body: formDataUpload
      });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok || !uploadJson.success) {
        console.warn("Screenshot upload warning:", uploadJson.message);
      }

      // 3. Set submitted data to render Sample Ticket Preview & Confirmation
      setSubmittedData({
        registration_number: regNumber,
        athlete_name: formData.athlete_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        event_name: selectedEvent.event_name,
        event_date: formatEventDateRange(selectedEvent.event_date, selectedEvent.event_end_date, selectedEvent.date_type),
        venue: selectedEvent.venue,
        categories: selectedCategories.map(c => decodeHtml(c.name)),
        category_fee: pricing.categoryFee,
        clinical_charge: pricing.clinicalCharge,
        total_amount: pricing.total,
        date_of_birth: formData.date_of_birth,
        age: calculatedAge,
        height: formData.height,
        tan_spray_requested: tanSprayRequested,
        isSouthIndiaLeague: isTieredLeague
      });

      toast.success("Registration submitted! Pending admin verification.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong submitting your registration.');
      toast.error(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // GUARD: NO EVENT OR CLOSED EVENT
  // -------------------------------------------------------------
  if (!selectedEvent) {
    return (
      <div className="w-full max-w-xl mx-auto my-12 sm:my-20 p-6 sm:p-8 bg-[var(--surface)] border border-[var(--border-color)] text-center rounded-2xl shadow-lg box-border">
        <h2 className="text-xl sm:text-2xl text-[var(--text-primary)] font-heading font-extrabold uppercase tracking-tight-heading mb-3">No Event Selected</h2>
        <p className="font-body text-[var(--muted)] text-sm sm:text-base leading-relaxed mb-6">Please select an upcoming championship from the official events calendar.</p>
        <Link href="/events" className="inline-flex items-center justify-center h-12 px-8 bg-gradient-to-r from-[#BF953F] to-[#B38728] text-[#040A12] font-heading font-extrabold text-sm uppercase tracking-btn rounded-xl shadow-md hover:brightness-110 transition-all">
          Browse Championships
        </Link>
      </div>
    );
  }

  if (selectedEvent.status !== 'open') {
    return (
      <div className="w-full max-w-xl mx-auto my-12 sm:my-20 p-6 sm:p-8 bg-[var(--surface)] border border-[var(--border-color)] text-center rounded-2xl shadow-lg box-border">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mb-4">
          <Clock size={28} />
        </div>
        <h2 className="text-xl sm:text-2xl text-[var(--text-primary)] font-heading font-extrabold uppercase tracking-tight-heading mb-2">
          Registration Not Open
        </h2>
        <p className="font-heading font-extrabold text-base text-[var(--gold)] uppercase tracking-wider mb-3">
          {selectedEvent.event_name}
        </p>
        <p className="font-body text-[var(--muted)] text-sm sm:text-base leading-relaxed mb-6">
          Online athlete registration for this upcoming championship is not open yet. Please check back soon or explore the official championship details.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href={`/events/${selectedEvent.slug}`} className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-sm uppercase tracking-btn rounded-xl shadow-md hover:brightness-110 transition-all">
            Championship Details
          </Link>
          <Link href="/events" className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 border border-[var(--border-color)] text-[var(--text-primary)] font-heading font-bold text-sm uppercase rounded-xl hover:border-[var(--gold)] transition-colors">
            All Championships
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: SUBMISSION SUCCESS & SAMPLE TICKET PREVIEW
  // -------------------------------------------------------------
  if (submittedData) {
    return (
      <div className="w-full min-h-[85vh] bg-[var(--bg)] py-8 sm:py-12 px-4 sm:px-6 transition-colors overflow-x-clip box-border">
        <div className="w-full max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-400 min-w-0">

          {/* Submission Success Notice */}
          <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-5 sm:p-8 text-center mb-8 box-border">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Clock size={30} />
            </div>

            <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight-heading text-[var(--text-primary)] mb-2 break-words">
              Registration Submitted Successfully!
            </h1>
            <p className="font-body text-sm sm:text-base text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
              Your payment screenshot has been submitted for verification. Our administration team will verify your payment. <strong>Once approved, your official WFF Tamil Nadu championship ticket will be sent to your registered email address.</strong>
            </p>

            {/* Registration Key Summary Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 max-w-xl mx-auto mt-6 text-left">
              <div className="p-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl">
                <span className="font-body text-[11px] font-semibold text-[var(--muted)] block tracking-label">Registration No.</span>
                <span className="font-mono font-bold text-xs sm:text-sm text-[var(--gold)] break-all tracking-normal">{submittedData.registration_number}</span>
              </div>
              <div className="p-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl">
                <span className="font-body text-[11px] font-semibold text-[var(--muted)] block tracking-label">Athlete Name</span>
                <span className="font-body font-bold text-sm text-[var(--text-primary)] truncate block">{submittedData.athlete_name}</span>
              </div>
              <div className="p-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl sm:col-span-2 md:col-span-1">
                <span className="font-body text-[11px] font-semibold text-[var(--muted)] block tracking-label">Amount Submitted</span>
                <span className="font-heading font-black text-base sm:text-lg text-[var(--text-primary)]">₹{submittedData.total_amount}</span>
              </div>
              <div className="p-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl sm:col-span-2">
                <span className="font-body text-[11px] font-semibold text-[var(--muted)] block tracking-label">Registered Email Address</span>
                <span className="font-body font-medium text-xs sm:text-sm text-[var(--text-primary)] truncate block">{submittedData.email}</span>
              </div>
              <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl sm:col-span-2 md:col-span-1">
                <span className="font-body text-[11px] font-semibold text-amber-700 dark:text-amber-400 block tracking-label">Payment Status</span>
                <span className="font-body font-bold text-xs sm:text-sm text-amber-600 dark:text-amber-300">PENDING VERIFICATION</span>
              </div>
            </div>
          </div>

          {/* SAMPLE TICKET PREVIEW (NOT VALID FOR ENTRY) */}
          <div className="relative mx-auto max-w-2xl w-full min-w-0 box-border">

            {/* Sample Warning Ribbon Header */}
            <div className="bg-red-600 text-white py-2.5 px-3 sm:px-4 rounded-t-2xl font-heading font-black text-xs sm:text-sm uppercase tracking-wide text-center flex items-center justify-center gap-2 shadow-md leading-tight">
              <ShieldAlert size={16} className="shrink-0" />
              <span>SAMPLE TICKET — NOT VALID FOR ENTRY</span>
            </div>

            {/* Main Ticket Card with Watermark */}
            <div className="bg-gradient-to-b from-[#0D1829] via-[#09111D] to-[#050A12] text-white rounded-b-3xl overflow-hidden border-2 border-red-500/40 relative shadow-2xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 box-border">

              {/* Diagonal Watermark Across Ticket */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 opacity-20 overflow-hidden">
                <span className="font-heading font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-wider text-red-500 -rotate-20 border-4 border-red-500 p-3 sm:p-4 text-center">
                  SAMPLE TICKET — NOT VALID FOR ENTRY
                </span>
              </div>

              {/* Ticket Header */}
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10 relative z-20">
                <div className="min-w-0">
                  <div className="inline-block px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-body text-[11px] font-semibold tracking-wide mb-1.5">
                    PENDING VERIFICATION
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl uppercase font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3D6] via-[#FCF6BA] to-[#C9A44A] truncate">
                    {submittedData.event_name}
                  </h3>
                  <div className="font-heading font-bold text-xs uppercase tracking-wide text-white/70 truncate">
                    World Fitness Federation • Tamil Nadu
                  </div>
                </div>
                <img src="/assets/wff-india.png" alt="WFF" className="h-10 sm:h-12 w-auto object-contain shrink-0" />
              </div>

              {/* Athlete Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 relative z-20 text-xs">
                <div>
                  <span className="font-body text-[11px] font-semibold uppercase tracking-label text-white/50 block">Athlete Name</span>
                  <span className="font-heading font-extrabold text-sm sm:text-base text-white mt-0.5 block truncate">{submittedData.athlete_name}</span>
                </div>
                <div>
                  <span className="font-body text-[11px] font-semibold uppercase tracking-label text-white/50 block">Registration Number</span>
                  <span className="font-mono font-bold text-xs text-[#FCF6BA] mt-0.5 block truncate tracking-normal">{submittedData.registration_number}</span>
                </div>
                <div>
                  <span className="font-body text-[11px] font-semibold uppercase tracking-label text-white/50 block">Age / Height</span>
                  <span className="font-body font-medium text-xs sm:text-sm text-white mt-0.5 block">{submittedData.age} Yrs &bull; {submittedData.height} cm</span>
                </div>
                <div>
                  <span className="font-body text-[11px] font-semibold uppercase tracking-label text-white/50 block">Event Date &amp; Location</span>
                  <span className="font-body font-medium text-xs sm:text-sm text-white mt-0.5 block">{submittedData.event_date} &bull; {submittedData.venue}</span>
                </div>
              </div>

              {/* Selected Categories */}
              <div className="relative z-20">
                <span className="font-body text-[11px] font-semibold uppercase tracking-label text-[#C9A44A] block mb-1.5">
                  Selected Categories ({submittedData.categories.length})
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {submittedData.categories.map((c: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 bg-white/5 rounded-md border border-white/10 text-xs font-heading font-bold uppercase tracking-wide text-white">
                      {c}
                    </span>
                  ))}
                  {submittedData.tan_spray_requested && (
                    <span className="px-2.5 py-1 bg-[#C9A44A]/20 rounded-md border border-[#C9A44A]/40 text-xs font-heading font-bold uppercase tracking-wide text-[#FCF6BA]">
                      + Tan Spray
                    </span>
                  )}
                </div>
              </div>

              {/* Official Fee Breakdown Inside Sample Ticket */}
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-2 text-xs relative z-20">
                <div className="flex justify-between items-center text-white/80">
                  <span>Category Registration Fee ({submittedData.categories.length} {submittedData.categories.length === 1 ? 'Category' : 'Categories'}):</span>
                  <span className="font-mono font-bold text-white text-sm">₹{submittedData.category_fee}</span>
                </div>
                {submittedData.clinical_charge > 0 && (
                  <div className="flex justify-between items-center text-[#FCF6BA]">
                    <span>Mandatory Clinical Testing Charge:</span>
                    <span className="font-mono font-bold text-sm">₹{submittedData.clinical_charge}</span>
                  </div>
                )}
                {submittedData.tan_spray_requested && (
                  <div className="flex justify-between items-center text-white/80">
                    <span>Pro Tan Spray Service:</span>
                    <span className="font-mono font-bold text-sm">+ Applied</span>
                  </div>
                )}
                <div className="pt-2 border-t border-white/15 flex justify-between items-center text-sm font-bold text-white">
                  <span className="uppercase font-heading font-extrabold tracking-wide">Total Submitted Amount:</span>
                  <span className="font-heading font-black text-lg text-[#FCF6BA]">₹{submittedData.total_amount}</span>
                </div>
              </div>

              {/* Ticket Footer Status Bar */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 relative z-20 text-xs">
                <div className="flex items-center gap-2 text-amber-400">
                  <Clock size={15} className="shrink-0" />
                  <span className="font-body font-bold text-xs uppercase tracking-wide">Payment Status: PENDING VERIFICATION</span>
                </div>
                <div className="font-body text-white/60 text-xs">
                  Official ticket sent only upon admin payment approval
                </div>
              </div>

            </div>
          </div>

          {/* Action Links */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link
              href={`/registration-status?regNumber=${encodeURIComponent(submittedData.registration_number)}`}
              className="inline-flex items-center justify-center h-12 px-6 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-sm uppercase tracking-btn rounded-xl shadow-md text-center hover:brightness-110 transition-all"
            >
              <ExternalLink size={15} className="mr-2 shrink-0" /> Check Live Status
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center h-12 px-6 bg-[var(--surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--gold)] font-heading font-bold text-sm uppercase tracking-btn rounded-xl transition-all text-center"
            >
              Return to Homepage
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: MAIN REGISTRATION FLOW (STEP 1, STEP 2, STEP 3)
  // -------------------------------------------------------------
  return (
    <div className="w-full bg-[var(--bg)] min-h-[90vh] py-6 sm:py-8 md:py-12 font-body text-[var(--text-primary)] transition-colors overflow-x-clip box-border">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 box-border min-w-0">

        {/* ========================================================= */}
        {/* RESPONSIVE REGISTRATION STEPPER                           */}
        {/* ========================================================= */}

        {/* 1. Mobile Stepper (Viewport < 768px) */}
        <div className="block md:hidden mb-6">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-heading font-bold uppercase tracking-tight-heading text-[var(--gold)]">
              STEP {activeStep} OF 3
            </span>
            <span className="font-body text-xs font-medium text-[var(--muted)]">
              {activeStep === 1 ? 'Competitor Info' : activeStep === 2 ? 'Division Entry' : 'UPI Payment'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] shadow-xs">
            {/* Step 1 Button */}
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-center transition-all cursor-pointer min-w-0 ${
                activeStep === 1
                  ? 'bg-[var(--gold)] text-black font-extrabold shadow-xs'
                  : formData.athlete_name && formData.phone
                  ? 'bg-[var(--gold-surface)] text-[var(--gold)] font-bold'
                  : 'text-[var(--muted)] opacity-70'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-heading font-black shrink-0 ${
                activeStep === 1 
                  ? 'bg-black text-[var(--gold)]' 
                  : formData.athlete_name && formData.phone 
                  ? 'bg-[var(--gold)] text-black' 
                  : 'border border-[var(--border-color)] text-[var(--text-primary)]'
              }`}>
                {formData.athlete_name && formData.phone ? '✓' : '1'}
              </span>
              <span className="font-heading font-bold text-xs uppercase tracking-tight truncate">
                Details
              </span>
            </button>

            {/* Step 2 Button */}
            <button
              type="button"
              onClick={() => {
                if (formData.athlete_name && formData.phone) setActiveStep(2);
                else toast.warning("Complete athlete details first.", { title: "Step 1 Incomplete" });
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-center transition-all cursor-pointer min-w-0 ${
                activeStep === 2
                  ? 'bg-[var(--gold)] text-black font-extrabold shadow-xs'
                  : selectedCategoryIds.length > 0
                  ? 'bg-[var(--gold-surface)] text-[var(--gold)] font-bold'
                  : 'text-[var(--muted)] opacity-70'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-heading font-black shrink-0 ${
                activeStep === 2 
                  ? 'bg-black text-[var(--gold)]' 
                  : selectedCategoryIds.length > 0 
                  ? 'bg-[var(--gold)] text-black' 
                  : 'border border-[var(--border-color)] text-[var(--text-primary)]'
              }`}>
                {selectedCategoryIds.length > 0 ? '✓' : '2'}
              </span>
              <span className="font-heading font-bold text-xs uppercase tracking-tight truncate">
                Categories
              </span>
            </button>

            {/* Step 3 Button */}
            <button
              type="button"
              onClick={() => {
                if (formData.athlete_name && selectedCategoryIds.length > 0) setActiveStep(3);
                else toast.warning("Choose categories before moving to payment.", { title: "Step Locked" });
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-center transition-all cursor-pointer min-w-0 ${
                activeStep === 3
                  ? 'bg-[var(--gold)] text-black font-extrabold shadow-xs'
                  : 'text-[var(--muted)] opacity-70'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-heading font-black shrink-0 ${
                activeStep === 3 ? 'bg-black text-[var(--gold)]' : 'border border-[var(--border-color)] text-[var(--text-primary)]'
              }`}>
                3
              </span>
              <span className="font-heading font-bold text-xs uppercase tracking-tight truncate">
                Payment
              </span>
            </button>
          </div>
        </div>

        {/* 2. Tablet & Desktop Stepper (Viewport >= 768px) */}
        <div className="hidden md:block mb-8 lg:mb-10">
          <div className="bg-[var(--surface)] p-3 lg:p-4 rounded-2xl border border-[var(--border-color)] shadow-xs flex items-center justify-between gap-3 lg:gap-4 transition-colors">
            
            {/* Step 1 Pill */}
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className={`flex-1 flex items-center gap-3 p-2.5 lg:p-3 rounded-xl transition-all text-left cursor-pointer min-w-0 ${
                activeStep === 1 
                  ? 'bg-[var(--gold-surface)] border border-[var(--gold)]/50 text-[var(--gold)] shadow-xs' 
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-[var(--muted)]'
              }`}
            >
              <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center font-heading font-black text-xs shrink-0 ${
                activeStep === 1 ? 'bg-[var(--gold)] text-[#040A12]' : 'bg-[var(--bg)] border border-[var(--border-color)] text-[var(--text-primary)]'
              }`}>
                {formData.athlete_name && formData.phone ? '✓' : '1'}
              </div>
              <div className="min-w-0">
                <span className="font-body text-[11px] font-semibold text-[var(--muted)] block tracking-label">Step 1</span>
                <div className="font-heading font-bold text-xs lg:text-sm uppercase tracking-tight-heading text-[var(--text-primary)] truncate">
                  Athlete Details
                </div>
              </div>
            </button>

            <div className="w-4 lg:w-8 h-[1px] bg-[var(--border-color)] shrink-0" />

            {/* Step 2 Pill */}
            <button
              type="button"
              onClick={() => {
                if (formData.athlete_name && formData.phone) setActiveStep(2);
                else toast.warning("Complete athlete details first.", { title: "Step 1 Incomplete" });
              }}
              className={`flex-1 flex items-center gap-3 p-2.5 lg:p-3 rounded-xl transition-all text-left cursor-pointer min-w-0 ${
                activeStep === 2 
                  ? 'bg-[var(--gold-surface)] border border-[var(--gold)]/50 text-[var(--gold)] shadow-xs' 
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-[var(--muted)]'
              }`}
            >
              <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center font-heading font-black text-xs shrink-0 ${
                activeStep === 2 ? 'bg-[var(--gold)] text-[#040A12]' : 'bg-[var(--bg)] border border-[var(--border-color)] text-[var(--text-primary)]'
              }`}>
                {selectedCategoryIds.length > 0 ? '✓' : '2'}
              </div>
              <div className="min-w-0">
                <span className="font-body text-[11px] font-semibold text-[var(--muted)] block tracking-label">Step 2</span>
                <div className="font-heading font-bold text-xs lg:text-sm uppercase tracking-tight-heading text-[var(--text-primary)] truncate">
                  Categories ({selectedCategoryIds.length})
                </div>
              </div>
            </button>

            <div className="w-4 lg:w-8 h-[1px] bg-[var(--border-color)] shrink-0" />

            {/* Step 3 Pill */}
            <button
              type="button"
              onClick={() => {
                if (formData.athlete_name && selectedCategoryIds.length > 0) setActiveStep(3);
                else toast.warning("Choose categories before moving to payment.", { title: "Step Locked" });
              }}
              className={`flex-1 flex items-center gap-3 p-2.5 lg:p-3 rounded-xl transition-all text-left cursor-pointer min-w-0 ${
                activeStep === 3 
                  ? 'bg-[var(--gold-surface)] border border-[var(--gold)]/50 text-[var(--gold)] shadow-xs' 
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-[var(--muted)]'
              }`}
            >
              <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center font-heading font-black text-xs shrink-0 ${
                activeStep === 3 ? 'bg-[var(--gold)] text-[#040A12]' : 'bg-[var(--bg)] border border-[var(--border-color)] text-[var(--text-primary)]'
              }`}>
                3
              </div>
              <div className="min-w-0">
                <span className="font-body text-[11px] font-semibold text-[var(--muted)] block tracking-label">Step 3</span>
                <div className="font-heading font-bold text-xs lg:text-sm uppercase tracking-tight-heading text-[var(--text-primary)] truncate">
                  UPI Payment &amp; Proof
                </div>
              </div>
            </button>

          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-600 dark:text-red-400 flex items-start gap-3 box-border">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div className="font-body text-sm font-semibold break-words min-w-0">{error}</div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 1: ATHLETE DETAILS (ONLY 6 REQUIRED FIELDS)          */}
        {/* ========================================================= */}
        {activeStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300 w-full min-w-0 box-border">
            {/* Header */}
            <div className="border-b border-[var(--border-color)] pb-4 sm:pb-5">
              <span className="font-heading font-bold text-xs uppercase tracking-tight-heading text-[var(--gold)]">Step 1 of 3</span>
              <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight-heading text-[var(--text-primary)] mt-1 break-words">
                ENTER ATHLETE DETAILS
              </h1>
              <p className="font-body text-sm sm:text-base text-[var(--muted)] mt-1 leading-relaxed">
                Provide your basic competitor details. No identity proofs or sensitive documents required.
              </p>
            </div>

            {/* Selected Championship Info */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 box-border">
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[var(--gold-surface)] border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shrink-0">
                  <Trophy size={20} />
                </div>
                <div className="min-w-0">
                  <span className="font-heading font-bold text-xs uppercase tracking-tight text-[var(--gold)] block">Championship Event</span>
                  <h2 className="font-heading font-extrabold text-base sm:text-lg uppercase text-[var(--text-primary)] leading-tight truncate">
                    {selectedEvent.event_name}
                  </h2>
                  <div className="font-body text-xs sm:text-sm text-[var(--muted)] mt-0.5 break-words">
                    {formatEventDateRange(selectedEvent.event_date, selectedEvent.event_end_date, selectedEvent.date_type)} &bull; {selectedEvent.venue}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                {selectedEvent.date_type === 'multi' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wide bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30">
                    Multi-Day
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Registration Open
                </span>
              </div>
            </div>

            {/* The 6 Required Athlete Details Form (2-Column Desktop, 1-Column Mobile) */}
            <div className="p-5 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] shadow-xs space-y-5 sm:space-y-6 box-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                {/* 1. Full Name */}
                <div>
                  <label htmlFor="athlete_name" className="block font-body text-sm font-semibold tracking-label text-[var(--text-primary)] mb-1.5">
                    1. Full Name *
                  </label>
                  <Input
                    id="athlete_name"
                    name="athlete_name"
                    value={formData.athlete_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full official name"
                    autoComplete="name"
                    required
                    className="h-12 bg-[var(--bg)] border-[var(--border-color)] text-base font-body rounded-xl w-full"
                  />
                </div>

                {/* 2. Mobile Number */}
                <div>
                  <label htmlFor="phone" className="block font-body text-sm font-semibold tracking-label text-[var(--text-primary)] mb-1.5">
                    2. Mobile Number (10 Digits) *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    autoComplete="tel"
                    maxLength={10}
                    required
                    className="h-12 bg-[var(--bg)] border-[var(--border-color)] text-base font-body rounded-xl font-mono w-full"
                  />
                </div>

                {/* 3. Email Address */}
                <div>
                  <label htmlFor="email" className="block font-body text-sm font-semibold tracking-label text-[var(--text-primary)] mb-1.5">
                    3. Email Address (For Ticket Delivery) *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className="h-12 bg-[var(--bg)] border-[var(--border-color)] text-base font-body rounded-xl w-full"
                  />
                </div>

                {/* 4. Date of Birth */}
                <div>
                  <label htmlFor="date_of_birth" className="block font-body text-sm font-semibold tracking-label text-[var(--text-primary)] mb-1.5">
                    4. Date of Birth *
                  </label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    required
                    className="h-12 bg-[var(--bg)] border-[var(--border-color)] text-base font-body rounded-xl w-full"
                  />
                </div>

                {/* 5. Age (Auto-calculated, strictly readonly) */}
                <div>
                  <label htmlFor="calculated_age" className="block font-body text-sm font-semibold tracking-label text-[var(--text-primary)] mb-1.5">
                    5. Age (Auto-Calculated from DOB)
                  </label>
                  <div className="h-12 bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl px-4 flex items-center justify-between text-base font-body">
                    {calculatedAge ? (
                      <>
                        <span className="font-heading font-bold text-base text-[var(--gold)]">
                          {calculatedAge} Years Old
                        </span>
                        <span className="font-body text-xs text-emerald-600 dark:text-emerald-400 font-semibold tracking-label">
                          Auto Calculated
                        </span>
                      </>
                    ) : (
                      <span className="font-body text-sm text-[var(--muted)] font-normal">
                        Select DOB above to calculate
                      </span>
                    )}
                  </div>
                </div>

                {/* 6. Height (in cm) */}
                <div>
                  <label htmlFor="height" className="block font-body text-sm font-semibold tracking-label text-[var(--text-primary)] mb-1.5">
                    6. Height (in cm) *
                  </label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    step="0.5"
                    min="50"
                    max="250"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="e.g. 175"
                    required
                    className="h-12 bg-[var(--bg)] border-[var(--border-color)] text-base font-body rounded-xl font-mono w-full"
                  />
                </div>

              </div>

              {/* Form Navigation CTA */}
              <div className="pt-4 border-t border-[var(--border-color)] flex justify-end">
                <Button
                  type="button"
                  onClick={goToStep2}
                  className="w-full sm:w-auto h-12 sm:h-13 px-8 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-sm sm:text-base tracking-btn uppercase rounded-xl shadow-md hover:brightness-110 cursor-pointer"
                >
                  <span>Continue to Category Selection</span>
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: CATEGORY SELECTION & FEE SUMMARY                  */}
        {/* ========================================================= */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300 w-full min-w-0 box-border">
            {/* Header */}
            <div className="border-b border-[var(--border-color)] pb-4 sm:pb-5">
              <span className="font-heading font-bold text-xs uppercase tracking-tight-heading text-[var(--gold)]">Step 2 of 3</span>
              <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight-heading text-[var(--text-primary)] mt-1 break-words">
                SELECT COMPETITION DIVISIONS
              </h1>
              <p className="font-body text-sm sm:text-base text-[var(--muted)] mt-1 leading-relaxed">
                {isTieredLeague ? (
                  <>
                    Select up to <strong>3 competition categories</strong>. Single: ₹3,000 &bull; Double: ₹5,000 &bull; Triple: ₹6,000 plus mandatory clinical testing charge (₹2,000 per athlete).
                  </>
                ) : (
                  <>
                    Choose one or more categories you are competing in. Enjoy <strong>50% off on additional divisions</strong>.
                  </>
                )}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {isIndiaNatural ? (
                [
                  { id: 'all', label: 'All Categories (20)' },
                  { id: 'fashion', label: 'Fashion Show (4)' },
                  { id: 'bermuda', label: 'Bermuda Beach (5)' },
                  { id: 'bodybuilding', label: 'Men Bodybuilding (11)' },
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setCategoryFilter(f.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-tight transition-all cursor-pointer ${
                      categoryFilter === f.id
                        ? 'bg-[var(--gold)] text-[#040A12] shadow-xs'
                        : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border-color)] hover:border-[var(--gold)]/40'
                    }`}
                  >
                    {f.label}
                  </button>
                ))
              ) : isSouthIndiaLeague ? (
                [
                  { id: 'all', label: 'All Categories (20)' },
                  { id: 'denim', label: 'Denim Jeans (4)' },
                  { id: 'bermuda', label: 'Bermuda Beach (5)' },
                  { id: 'bodybuilding', label: 'Men Bodybuilding (11)' },
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setCategoryFilter(f.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-tight transition-all cursor-pointer ${
                      categoryFilter === f.id
                        ? 'bg-[var(--gold)] text-[#040A12] shadow-xs'
                        : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border-color)] hover:border-[var(--gold)]/40'
                    }`}
                  >
                    {f.label}
                  </button>
                ))
              ) : (
                [
                  { id: 'all', label: 'All Divisions' },
                  { id: 'men', label: "Men's Divisions" },
                  { id: 'women', label: "Women's Divisions" },
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setCategoryFilter(f.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-tight transition-all cursor-pointer ${
                      categoryFilter === f.id
                        ? 'bg-[var(--gold)] text-[#040A12] shadow-xs'
                        : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border-color)] hover:border-[var(--gold)]/40'
                    }`}
                  >
                    {f.label}
                  </button>
                ))
              )}
            </div>

            {/* Category Cards List - Grouped for WFF Natural League Championships */}
            {isTieredLeague ? (
              <div className="space-y-8">
                {(isIndiaNatural ? [
                  {
                    id: 'fashion',
                    num: '1',
                    title: 'CATEGORY 1 — FASHION SHOW MODEL',
                    desc: 'High-fashion stage presentation, styling confidence, runway poise, and youth/open divisions.',
                    badge: '4 Divisions',
                    filter: (c: EventCategory) => c.name.toLowerCase().includes('fashion show')
                  },
                  {
                    id: 'bermuda',
                    num: '2',
                    title: 'CATEGORY 2 — BERMUDA BEACH MODEL',
                    desc: 'Summer beach aesthetic, athletic V-taper, boardshorts presentation, and height divisions.',
                    badge: '5 Divisions',
                    filter: (c: EventCategory) => c.name.toLowerCase().includes('bermuda beach')
                  },
                  {
                    id: 'bodybuilding',
                    num: '3',
                    title: 'CATEGORY 3 — MEN BODYBUILDING',
                    desc: 'Peak muscularity, vascularity, symmetry, mandatory poses, age groups & weight divisions.',
                    badge: '11 Divisions',
                    filter: (c: EventCategory) => c.name.toLowerCase().includes('bodybuilding')
                  }
                ] : [
                  {
                    id: 'denim',
                    num: '1',
                    title: 'CATEGORY 1 — DENIM JEANS MODEL',
                    desc: 'Modern fitness presentation, denim styling, stage confidence and athletic symmetry.',
                    badge: '4 Divisions',
                    filter: (c: EventCategory) => c.name.toLowerCase().includes('denim jeans')
                  },
                  {
                    id: 'bermuda',
                    num: '2',
                    title: 'CATEGORY 2 — BERMUDA BEACH MODEL',
                    desc: 'Summer beach aesthetic, athletic V-taper, boardshorts presentation, and height divisions.',
                    badge: '5 Divisions',
                    filter: (c: EventCategory) => c.name.toLowerCase().includes('bermuda beach')
                  },
                  {
                    id: 'bodybuilding',
                    num: '3',
                    title: 'CATEGORY 3 — MEN BODYBUILDING',
                    desc: 'Peak muscularity, vascularity, symmetry, mandatory poses, age groups & weight divisions.',
                    badge: '11 Divisions',
                    filter: (c: EventCategory) => c.name.toLowerCase().includes('bodybuilding')
                  }
                ])
                  .filter(group => categoryFilter === 'all' || categoryFilter === group.id)
                  .map(group => {
                    const groupCats = (selectedEvent.categories || []).filter(group.filter);
                    if (groupCats.length === 0) return null;

                    return (
                      <div key={group.id} className="space-y-3.5">
                        {/* Section Header */}
                        <div className="p-4 rounded-xl bg-[var(--surface)] border-l-4 border-[var(--gold)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-black text-xs px-2 py-0.5 rounded bg-[var(--gold)] text-black uppercase">
                                Division {group.num}
                              </span>
                              <h2 className="font-heading font-extrabold text-base sm:text-lg text-[var(--text-primary)] uppercase tracking-tight">
                                {group.title}
                              </h2>
                            </div>
                            <p className="font-body text-xs text-[var(--muted)] mt-1">
                              {group.desc}
                            </p>
                          </div>
                          <span className="font-body text-xs font-semibold px-2.5 py-1 rounded bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20 shrink-0 self-start sm:self-center">
                            {group.badge}
                          </span>
                        </div>

                        {/* Subcategory Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {groupCats.map(cat => {
                            const isSelected = selectedCategoryIds.includes(cat.id.toString());
                            const eligibility = checkEligibility(cat.name, cat.eligibility);

                            // Clean display title
                            const displayTitle = cat.name.includes('—') 
                              ? cat.name.split('—').slice(1).join('—').trim() 
                              : cat.name;

                            return (
                              <div
                                key={cat.id}
                                onClick={() => toggleCategory(cat.id.toString())}
                                className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between gap-3 transition-all duration-200 box-border ${
                                  isSelected 
                                    ? 'border-[var(--gold)] bg-[var(--gold-surface)] ring-2 ring-[var(--gold)]/50 shadow-md' 
                                    : 'border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--gold)]/40 hover:bg-black/5 dark:hover:bg-white/5'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-5 h-5 mt-0.5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all ${
                                    isSelected ? 'bg-[var(--gold)] border-[var(--gold)] text-[#040A12]' : 'border-[var(--border-color)] bg-[var(--bg)]'
                                  }`}>
                                    {isSelected && <Check size={12} strokeWidth={3} className="text-[#040A12]" />}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <span className="font-heading font-bold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-[var(--gold)]/15 text-[var(--gold)]">
                                        {cat.gender || 'Men'}
                                      </span>
                                      {isSelected && (
                                        <span className="font-body text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                          Selected
                                        </span>
                                      )}
                                      {eligibility && (
                                        <span className={`font-body text-[10px] font-semibold px-2 py-0.5 rounded ${
                                          eligibility.status === 'eligible'
                                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                        }`}>
                                          {eligibility.text}
                                        </span>
                                      )}
                                    </div>

                                    <h3 className="font-heading font-extrabold text-sm sm:text-base text-[var(--text-primary)] uppercase tracking-tight leading-snug">
                                      {decodeHtml(displayTitle)}
                                    </h3>
                                    <p className="font-body text-xs text-[var(--muted)] mt-1 leading-relaxed">
                                      {cat.eligibility || 'Open to all eligible competitors'}
                                    </p>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-[var(--border-color)]/60 flex items-center justify-between text-xs">
                                  <span className="text-[var(--muted)] font-medium">Official Entry Tier:</span>
                                  <span className="font-heading font-bold text-xs uppercase text-[var(--gold)]">
                                    ₹3k / ₹5k / ₹6k
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              /* Standard / Legacy Category List for other events */
              <div className="space-y-3">
                {(selectedEvent.categories || []).map((cat) => {
                  const isSelected = selectedCategoryIds.includes(cat.id.toString());
                  const categoryIndex = selectedCategoryIds.indexOf(cat.id.toString());
                  const isDiscounted = isSelected && categoryIndex > 0;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id.toString())}
                      className={`p-4 sm:p-5 rounded-2xl border cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 transition-all duration-200 box-border w-full min-w-0 ${
                        isSelected 
                          ? 'border-[var(--gold)] bg-[var(--gold-surface)] ring-1 ring-[var(--gold)]/40 shadow-sm' 
                          : 'border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--gold)]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
                        <div className={`w-6 h-6 shrink-0 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[var(--gold)] border-[var(--gold)] text-[#040A12]' : 'border-[var(--border-color)] bg-[var(--bg)]'
                        }`}>
                          {isSelected && <Check size={14} strokeWidth={3} className="text-[#040A12]" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-heading font-bold text-[11px] uppercase tracking-wide px-2 py-0.5 rounded bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20 shrink-0">
                              {cat.gender || 'Open'}
                            </span>
                            {isSelected && (
                              <span className="font-body text-xs font-semibold tracking-wide px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                                Selected {isDiscounted ? '(50% Off)' : ''}
                              </span>
                            )}
                          </div>
                          <h3 className="font-heading font-extrabold text-base sm:text-lg md:text-xl text-[var(--text-primary)] tracking-tight-heading uppercase leading-snug break-words">
                            {decodeHtml(cat.name)}
                          </h3>
                          <p className="font-body text-xs sm:text-sm text-[var(--muted)] font-normal mt-0.5">
                            {cat.eligibility || 'Open to all registered competitors'}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right pl-9 sm:pl-0 shrink-0">
                        <div className="font-heading font-black text-xl sm:text-2xl text-[var(--text-primary)]">
                          ₹{cat.entry_fee || '0'}
                        </div>
                        <div className="font-body text-[11px] font-semibold uppercase tracking-label text-[var(--muted)] mt-0.5">
                          Entry Fee
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pro Tan Spray Add-on */}
            <div
              onClick={() => setTanSprayRequested(!tanSprayRequested)}
              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 transition-all box-border w-full min-w-0 ${
                tanSprayRequested 
                  ? 'border-[var(--gold)] bg-[var(--gold-surface)] ring-1 ring-[var(--gold)]/40 shadow-sm' 
                  : 'border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--gold)]/40'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
                <div className={`w-6 h-6 shrink-0 rounded-lg border-2 flex items-center justify-center transition-all ${
                  tanSprayRequested ? 'bg-[var(--gold)] border-[var(--gold)] text-[#040A12]' : 'border-[var(--border-color)] bg-[var(--bg)]'
                }`}>
                  {tanSprayRequested && <Check size={14} strokeWidth={3} className="text-[#040A12]" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-heading font-bold text-[11px] uppercase tracking-wide px-2 py-0.5 rounded bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
                      Official Service
                    </span>
                  </div>
                  <h4 className="font-heading font-extrabold text-base sm:text-lg text-[var(--text-primary)] uppercase break-words">
                    Stage Pro Tan Spray Application (Optional)
                  </h4>
                  <p className="font-body text-xs sm:text-sm text-[var(--muted)] font-normal mt-0.5">
                    Official backstage professional coat application before stage entrance.
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right pl-9 sm:pl-0 shrink-0">
                <div className="font-heading font-black text-xl sm:text-2xl text-[var(--text-primary)]">
                  ₹{selectedEvent.tan_spray_price || '1500'}
                </div>
                <div className="font-body text-[11px] font-semibold uppercase tracking-label text-[var(--gold)] mt-0.5">
                  Single Fee
                </div>
              </div>
            </div>

            {/* Fee Breakdown Summary Card */}
            {isTieredLeague ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border-2 border-[var(--gold)]/40 shadow-sm space-y-4 box-border w-full min-w-0">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <h3 className="font-heading font-extrabold text-base uppercase tracking-tight-heading text-[var(--text-primary)]">
                    {selectedEvent?.event_name || 'Championship'} — Fee Breakdown
                  </h3>
                  <span className="font-heading font-bold text-xs uppercase px-2.5 py-0.5 rounded bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                    Official Championship Pricing
                  </span>
                </div>

                <div className="space-y-3 font-body text-sm">
                  {/* Category Tier Status */}
                  <div className="flex justify-between items-center text-[var(--muted)]">
                    <span>
                      Selected Categories ({selectedCategories.length} of 3 max):
                    </span>
                    <span className="font-heading font-bold text-base text-[var(--text-primary)]">
                      {selectedCategories.length === 0 ? (
                        <span className="text-amber-500 text-xs">Select 1 to 3 categories</span>
                      ) : (
                        `${pricing.tierLabel} (₹${pricing.categoryFee})`
                      )}
                    </span>
                  </div>

                  {/* Mandatory Clinical Testing Charge Banner */}
                  <div className="flex justify-between items-center bg-amber-500/10 p-3 sm:p-4 rounded-xl border border-amber-500/30">
                    <div>
                      <span className="font-heading font-extrabold text-xs sm:text-sm text-[var(--text-primary)] uppercase block tracking-wide">
                        Mandatory Clinical Testing Charge
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        Charged once per athlete &bull; Non-removable &bull; Mandatory for all participants
                      </span>
                    </div>
                    <span className="font-heading font-black text-lg text-[var(--gold)] shrink-0 ml-3">
                      ₹2,000
                    </span>
                  </div>

                  {/* Optional Tan Spray */}
                  {tanSprayRequested && (
                    <div className="flex justify-between items-center text-[var(--muted)]">
                      <span>Pro Tan Spray Application:</span>
                      <span className="font-heading font-bold text-base text-[var(--text-primary)]">₹{pricing.tanSpray}</span>
                    </div>
                  )}

                  {/* Final Payable */}
                  <div className="pt-3 border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-heading font-extrabold text-sm sm:text-base uppercase tracking-tight-heading text-[var(--text-primary)] block">
                        Total Payable Amount:
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        {selectedCategories.length === 0 
                          ? 'Please choose categories above' 
                          : `₹${pricing.categoryFee} (Category Fee) + ₹2,000 (Clinical Charge) ${tanSprayRequested ? '+ ₹' + pricing.tanSpray + ' (Tan Spray)' : ''}`}
                      </span>
                    </div>
                    <span className="font-heading font-black text-2xl sm:text-3xl text-[var(--gold)]">
                      ₹{pricing.total}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] shadow-xs space-y-4 box-border w-full min-w-0">
                <h3 className="font-heading font-extrabold text-base uppercase tracking-tight-heading text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
                  Live Registration Fee Breakdown
                </h3>

                <div className="space-y-2.5 font-body text-sm">
                  <div className="flex justify-between items-center text-[var(--muted)]">
                    <span>First Division Entry Fee:</span>
                    <span className="font-heading font-bold text-base text-[var(--text-primary)]">₹{pricing.firstCategoryFee}</span>
                  </div>

                  {selectedCategories.length > 1 && (
                    <div className="flex justify-between items-center text-[var(--muted)]">
                      <span>Additional Divisions ({selectedCategories.length - 1}):</span>
                      <span className="font-heading font-bold text-base text-[var(--text-primary)]">₹{pricing.additionalFee}</span>
                    </div>
                  )}

                  {pricing.discount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>50% Multi-Category Discount:</span>
                      <span className="font-heading font-bold text-base">- ₹{pricing.discount}</span>
                    </div>
                  )}

                  {tanSprayRequested && (
                    <div className="flex justify-between items-center text-[var(--muted)]">
                      <span>Pro Tan Spray Service:</span>
                      <span className="font-heading font-bold text-base text-[var(--text-primary)]">₹{pricing.tanSpray}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[var(--border-color)] flex justify-between items-center">
                    <span className="font-heading font-extrabold text-sm sm:text-base uppercase tracking-tight-heading text-[var(--text-primary)]">Final Payable:</span>
                    <span className="font-heading font-black text-2xl sm:text-3xl text-[var(--gold)]">₹{pricing.total}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <Button
                type="button"
                onClick={() => setActiveStep(1)}
                variant="secondary"
                className="w-full sm:w-auto h-12 sm:h-13 px-6 border border-[var(--border-color)] text-[var(--text-primary)] font-heading font-bold text-sm uppercase tracking-btn rounded-xl cursor-pointer"
              >
                ← Back to Details
              </Button>
              <Button
                type="button"
                onClick={goToStep3}
                disabled={selectedCategoryIds.length === 0}
                className="w-full sm:w-auto h-12 sm:h-13 px-8 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-sm sm:text-base tracking-btn uppercase rounded-xl shadow-md cursor-pointer disabled:opacity-50"
              >
                Proceed to Payment (₹{pricing.total}) →
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: UPI PAYMENT & PROOF UPLOAD (RESPONSIVE 2-COL / 1-COL) */}
        {/* ========================================================= */}
        {activeStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300 w-full min-w-0 box-border">
            
            {/* Header */}
            <div className="border-b border-[var(--border-color)] pb-4 sm:pb-5">
              <span className="font-heading font-bold text-xs uppercase tracking-tight-heading text-[var(--gold)]">Step 3 of 3</span>
              <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight-heading text-[var(--text-primary)] mt-1 break-words">
                UPI PAYMENT &amp; VERIFICATION
              </h1>
              <p className="font-body text-sm sm:text-base text-[var(--muted)] mt-1 leading-relaxed">
                Pay via the official UPI QR code or link, then upload your payment screenshot.
              </p>
            </div>

            {/* RESPONSIVE LAYOUT CONTAINER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full min-w-0 box-border">

              {/* RIGHT COLUMN ON DESKTOP / TOP ON MOBILE: Registration Fee Summary Card */}
              <div className="lg:col-span-5 lg:order-2 lg:sticky lg:top-24 space-y-4 w-full min-w-0 box-border">
                
                {/* 1. Registration Amount Due Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border-2 border-[var(--gold)]/50 shadow-md space-y-4 box-border w-full min-w-0">
                  <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                    <div className="flex items-center gap-2">
                      <Receipt size={18} className="text-[var(--gold)]" />
                      <span className="font-heading font-extrabold text-base uppercase tracking-tight-heading text-[var(--text-primary)]">
                        Registration Fee Summary
                      </span>
                    </div>
                    <span className="font-body text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded bg-[var(--gold)]/15 text-[var(--gold)]">
                      Official UPI
                    </span>
                  </div>

                  {/* Total Highlight */}
                  <div className="p-4 rounded-xl bg-[var(--gold-surface)] border border-[var(--gold)]/30 flex items-baseline justify-between">
                    <div>
                      <span className="font-body text-[11px] font-semibold uppercase tracking-label text-[var(--gold)] block">
                        Total Payable Amount
                      </span>
                      <span className="font-heading font-black text-3xl sm:text-4xl text-[var(--text-primary)]">
                        ₹{pricing.total}
                      </span>
                    </div>
                    <span className="font-heading font-extrabold text-sm text-[var(--muted)]">INR</span>
                  </div>

                  {/* Athlete info summary */}
                  <div className="space-y-2 font-body text-sm border-b border-[var(--border-color)] pb-3">
                    <div className="flex justify-between items-center text-[var(--muted)]">
                      <span>Athlete:</span>
                      <strong className="text-[var(--text-primary)] truncate max-w-[180px] font-semibold">{formData.athlete_name}</strong>
                    </div>
                    <div className="flex justify-between items-center text-[var(--muted)]">
                      <span>Mobile:</span>
                      <span className="font-mono font-semibold text-[var(--text-primary)]">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between items-center text-[var(--muted)]">
                      <span>Championship:</span>
                      <span className="text-[var(--text-primary)] truncate max-w-[180px] font-medium">{selectedEvent.event_name}</span>
                    </div>
                  </div>

                  {/* Itemized Categories breakdown */}
                  <div className="space-y-2 font-body text-sm">
                    <span className="font-body text-[11px] font-semibold uppercase tracking-label text-[var(--muted)] block">
                      Fee Breakdown:
                    </span>
                    <div className="space-y-2">
                      {isTieredLeague ? (
                        <>
                          <div className="flex justify-between items-center text-[var(--text-primary)] text-xs sm:text-sm p-2 rounded-lg bg-[var(--bg)] border border-[var(--border-color)]">
                            <div>
                              <span className="font-bold block">{pricing.tierLabel} ({selectedCategories.length} {selectedCategories.length === 1 ? 'Division' : 'Divisions'})</span>
                              <div className="text-[11px] text-[var(--muted)] max-h-16 overflow-y-auto mt-0.5">
                                {selectedCategories.map(c => decodeHtml(c.name)).join(', ')}
                              </div>
                            </div>
                            <span className="font-mono font-bold shrink-0 ml-2">₹{pricing.categoryFee}</span>
                          </div>
                          <div className="flex justify-between items-center text-[var(--text-primary)] text-xs sm:text-sm p-2 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/20">
                            <div>
                              <span className="font-bold text-[var(--gold)] block">Mandatory Clinical Testing Charge</span>
                              <span className="text-[11px] text-[var(--muted)]">Charged once per athlete</span>
                            </div>
                            <span className="font-mono font-bold text-[var(--gold)] shrink-0 ml-2">₹2,000</span>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {selectedCategories.map((cat, i) => (
                            <div key={cat.id} className="flex justify-between items-center text-[var(--text-primary)] text-xs sm:text-sm">
                              <span className="truncate pr-2 font-medium">• {decodeHtml(cat.name)}</span>
                              <span className="font-mono font-bold shrink-0">
                                {i === 0 ? `₹${cat.entry_fee}` : `₹${parseFloat(cat.entry_fee || '0') * 0.5} (50% Off)`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {tanSprayRequested && (
                        <div className="flex justify-between items-center text-[var(--gold)] text-xs sm:text-sm font-semibold p-1">
                          <span>• Pro Tan Spray Application</span>
                          <span className="font-mono font-bold shrink-0">₹{pricing.tanSpray}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Desktop Action Buttons inside right column */}
                  <div className="hidden lg:block pt-3 border-t border-[var(--border-color)] space-y-3">
                    <Button
                      type="button"
                      onClick={handleSubmitRegistration}
                      disabled={loading || !paymentProofFile}
                      className="w-full h-13 px-6 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-sm uppercase tracking-btn rounded-xl shadow-lg hover:brightness-110 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Submitting & Uploading Proof...' : 'Submit Registration & Payment Proof →'}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      variant="secondary"
                      className="w-full h-11 border border-[var(--border-color)] text-[var(--text-primary)] font-heading font-bold text-sm uppercase tracking-btn rounded-xl cursor-pointer"
                    >
                      ← Back to Categories
                    </Button>
                  </div>

                </div>

              </div>

              {/* LEFT COLUMN ON DESKTOP / MAIN BODY ON MOBILE: Instructions, QR & Screenshot */}
              <div className="lg:col-span-7 lg:order-1 space-y-6 w-full min-w-0 box-border">

                {/* 2. UPI Payment Instructions Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] shadow-xs space-y-3 box-border w-full min-w-0">
                  <h3 className="font-heading font-extrabold text-base uppercase tracking-tight-heading text-[var(--text-primary)] flex items-center gap-2">
                    <span>How to Complete Your UPI Payment:</span>
                  </h3>
                  <ol className="space-y-2 font-body text-sm text-[var(--muted)] list-decimal list-inside leading-relaxed">
                    <li>Open any UPI application (Google Pay, PhonePe, Paytm, BHIM).</li>
                    <li>Scan the official QR code below or tap the UPI payment link.</li>
                    <li>Pay the exact displayed registration amount: <strong className="text-[var(--text-primary)]">₹{pricing.total}</strong>.</li>
                    <li>Take a screenshot of the successful transaction confirmation.</li>
                    <li>Upload the screenshot below and submit your registration.</li>
                  </ol>
                </div>

                {/* 3 & 4. QR Code & UPI Links Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] shadow-xs space-y-5 box-border w-full min-w-0">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center bg-[var(--bg)] p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] box-border">
                    {/* Official QR Display */}
                    <div className="flex flex-col items-center text-center">
                      <div className="max-w-[190px] w-full p-2 bg-white rounded-2xl border border-black/10 shadow-sm box-border">
                        <img
                          src="/assets/payment-qr.jpeg"
                          alt="WFF Tamil Nadu Official UPI QR Code"
                          className="w-full h-auto object-contain rounded-xl"
                        />
                      </div>
                      <span className="font-body text-xs font-semibold text-[var(--muted)] mt-2">
                        Official Beneficiary: WFF TAMILNADU
                      </span>
                    </div>

                    {/* Official UPI ID & Intent Actions */}
                    <div className="space-y-3.5 min-w-0">
                      {/* Copy UPI ID Box */}
                      <div className="p-3.5 bg-[var(--surface)] rounded-xl border border-[var(--border-color)] min-w-0">
                        <span className="font-body text-[11px] font-semibold uppercase tracking-label text-[var(--gold)] block mb-1">
                          Official UPI Payment ID
                        </span>
                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <span className="font-mono font-bold text-sm text-[var(--text-primary)] truncate select-all tracking-normal">
                            nabbawffchennai@okicici
                          </span>
                          <button
                            type="button"
                            onClick={copyUpiToClipboard}
                            className="px-2.5 py-1.5 bg-[var(--gold-surface)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[#040A12] border border-[var(--gold)]/30 font-heading font-bold text-xs uppercase tracking-btn rounded-lg transition-colors shrink-0 cursor-pointer"
                          >
                            {copiedUpi ? 'Copied!' : 'Copy ID'}
                          </button>
                        </div>
                      </div>

                      {/* Clickable Mobile UPI Intent Link */}
                      <a
                        href={`upi://pay?pa=nabbawffchennai@okicici&pn=WFF%20Tamil%20Nadu&am=${pricing.total}&cu=INR&tn=WFF%20Registration`}
                        className="w-full flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-xs sm:text-sm uppercase tracking-btn rounded-xl shadow-md hover:brightness-110 transition-all cursor-pointer text-center px-3 box-border"
                      >
                        <Smartphone size={16} className="shrink-0" />
                        <span className="truncate">Pay via Mobile UPI App (GPay/PhonePe)</span>
                      </a>

                      {/* Web Fallback Link */}
                      <a
                        href="http://razorpay.me/@mohankumarnarasimalu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 h-11 border border-[var(--border-color)] hover:border-[var(--gold)] text-[var(--text-primary)] font-heading font-bold text-xs sm:text-sm uppercase tracking-btn rounded-xl transition-all text-center px-3 box-border"
                      >
                        <ExternalLink size={14} className="shrink-0" />
                        <span className="truncate">Web Payment Link (Cards/NetBanking)</span>
                      </a>
                    </div>
                  </div>

                </div>

                {/* 5 & 6. Payment Screenshot Upload Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] shadow-xs space-y-4 box-border w-full min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="font-heading font-extrabold text-base uppercase tracking-tight-heading text-[var(--text-primary)] flex items-center gap-2">
                        <Camera size={18} className="text-[var(--gold)] shrink-0" />
                        <span>Upload Payment Screenshot *</span>
                      </h4>
                      <p className="font-body text-xs sm:text-sm text-[var(--muted)] mt-0.5">
                        Attach the transaction screenshot from your UPI app showing successful payment.
                      </p>
                    </div>
                    <span className="font-body text-xs text-[var(--muted)] font-normal">
                      JPG, PNG, WEBP (Max 10MB)
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={paymentProofInputRef}
                    onChange={handlePaymentProofChange}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    id="payment-screenshot-input"
                  />

                  {paymentProofPreview ? (
                    <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 box-border w-full min-w-0">
                      <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
                        <img
                          src={paymentProofPreview}
                          alt="Screenshot Preview"
                          className="w-16 h-16 object-cover rounded-xl border border-emerald-500/30 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-body text-sm font-bold text-[var(--text-primary)] truncate">
                            {paymentProofFile?.name || 'Screenshot attached'}
                          </div>
                          <div className="font-body text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                            <CheckCircle2 size={13} className="shrink-0" />
                            <span>Proof ready for verification ({(paymentProofFile ? (paymentProofFile.size / 1024).toFixed(1) : '0')} KB)</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => paymentProofInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] font-heading font-bold text-xs uppercase tracking-btn hover:border-[var(--gold)] cursor-pointer"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentProofFile(null);
                            setPaymentProofPreview(null);
                            if (paymentProofInputRef.current) paymentProofInputRef.current.value = '';
                          }}
                          className="p-1.5 text-red-500 hover:text-red-600 cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => paymentProofInputRef.current?.click()}
                      className="border-2 border-dashed border-[var(--border-color)] hover:border-[var(--gold)] rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group box-border w-full min-w-0"
                    >
                      <div className="w-12 h-12 rounded-full bg-[var(--gold-surface)] text-[var(--gold)] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload size={22} />
                      </div>
                      <div className="font-body text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--gold)]">
                        Click here to attach UPI Payment Screenshot
                      </div>
                      <p className="font-body text-xs sm:text-sm text-[var(--muted)] max-w-sm">
                        Take a screenshot from GPay / PhonePe / Paytm confirming payment of ₹{pricing.total} to WFF TAMILNADU.
                      </p>
                    </div>
                  )}

                  {/* Optional UTR Input */}
                  <div>
                    <label htmlFor="transaction_ref" className="block font-body text-xs sm:text-sm font-semibold tracking-label text-[var(--muted)] mb-1.5">
                      UPI Transaction Reference / UTR Number (Optional)
                    </label>
                    <Input
                      id="transaction_ref"
                      type="text"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. 12-digit UTR No / UPI Reference (Optional)"
                      className="h-11 bg-[var(--bg)] text-sm rounded-xl w-full"
                    />
                  </div>
                </div>

                {/* 7. Mobile Action Buttons (Visible only on < lg) */}
                <div className="block lg:hidden pt-2 space-y-3">
                  <Button
                    type="button"
                    onClick={handleSubmitRegistration}
                    disabled={loading || !paymentProofFile}
                    className="w-full h-12 sm:h-13 px-6 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-sm uppercase tracking-btn rounded-xl shadow-lg hover:brightness-110 cursor-pointer disabled:opacity-50 text-center"
                  >
                    {loading ? 'Submitting & Uploading Proof...' : 'Submit Registration & Payment Proof →'}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    variant="secondary"
                    className="w-full h-11 border border-[var(--border-color)] text-[var(--text-primary)] font-heading font-bold text-sm uppercase tracking-btn rounded-xl cursor-pointer text-center"
                  >
                    ← Back to Categories
                  </Button>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
