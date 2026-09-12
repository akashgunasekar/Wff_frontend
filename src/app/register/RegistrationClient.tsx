"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Event, EventCategory } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, CreditCard, CheckCircle2, Ticket, CheckSquare, Square, Calendar, MapPin, Trophy, ShieldCheck } from 'lucide-react';
import { loadRazorpay } from '@/lib/utils';
import { API_BASE } from '@/lib/api';
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
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('cash');

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
    
    if (selectedCategoryIds.length === 0) return setError("Please select at least one category.");
    if (!formData.athlete_name.trim()) return setError("Athlete name is required.");
    if (!formData.phone.trim()) return setError("Phone number is required.");
    if (!formData.email.trim()) return setError("Email address is required.");
    if (!formData.date_of_birth) return setError("Date of birth is required.");
    
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
      
      setSuccessData({
        registration_number: json.data.registration_number,
        status: json.data.status,
        event_name: selectedEvent.event_name,
        event_date: selectedEvent.event_date,
        venue: selectedEvent.venue,
        categories: selectedCategories.map(c => c.name),
        total_amount: json.data.total_amount,
        payment_method: json.data.payment_method || paymentMethod
      });
      
      if (json.data.payment_method === 'cash' || paymentMethod === 'cash') {
        setLoading(false);
      } else {
        // Auto-trigger payment
        handlePayment(json.data.registration_number, json.data.total_amount);
      }
      
    } catch (err: any) {
      setError(err.message);
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
          ondismiss: function() {
            setPaymentFailed(true);
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
      setError(err.message);
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
  // RENDER: SUCCESS STATE (DIGITAL TICKET)
  // -------------------------------------------------------------
  if (successData?.status === 'paid' || successData?.payment_method === 'cash') {
    const isCash = successData.payment_method === 'cash';
    const isCashPaid = successData.status === 'paid';
    
    return (
      <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isCash && !isCashPaid ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
            <CheckCircle2 size={32} />
          </div>
          <h2 className="font-heading text-2xl uppercase tracking-widest text-white">Registration Confirmed</h2>
          <p className="text-wff-gold mt-2 font-medium tracking-wide">
            {isCash && !isCashPaid ? 'Spot reserved. Please pay at desk.' : 'Spot secured on stage.'}
          </p>
        </div>

        {/* TICKET UI */}
        <div className="bg-white text-black overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative rounded-xl border border-black/5">
          {/* Ticket Header */}
          <div className="bg-[#040A12] text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-[11px] tracking-[0.25em] text-[#C9A44A] font-bold mb-2 uppercase">World Fitness Federation</div>
              <h3 className="font-heading text-2xl md:text-3xl uppercase tracking-wider font-extrabold">{successData.event_name}</h3>
            </div>
            <img src="/assets/wff-india.png" alt="WFF Logo" className="h-16 w-auto object-contain drop-shadow-xl" />
          </div>
          
          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              <div className="bg-gray-50/50 p-6 rounded-lg border border-black/5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#040A12]/40 font-bold mb-1.5">Athlete</div>
                <div className="font-heading text-xl md:text-2xl uppercase font-bold text-[#040A12]">{formData.athlete_name}</div>
              </div>
              <div className="bg-gray-50/50 p-6 rounded-lg border border-black/5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#040A12]/40 font-bold mb-1.5">Registration No.</div>
                <div className="font-heading text-xl md:text-2xl font-bold text-[#040A12]">{successData.registration_number}</div>
              </div>
              
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#040A12]/40 font-bold mb-1.5">Date</div>
                <div className="font-medium text-[#040A12] uppercase tracking-wider">{successData.event_date}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#040A12]/40 font-bold mb-1.5">Venue</div>
                <div className="font-medium text-[#040A12] uppercase tracking-wider leading-relaxed">{successData.venue}</div>
              </div>
            </div>

            <div className="border-t border-black/10 my-8"></div>

            <div className="mb-8">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#040A12]/40 font-bold mb-4">Categories</div>
              <ul className="space-y-3">
                {successData.categories.map((c: string, idx: number) => (
                  <li key={idx} className="font-heading font-bold text-lg md:text-xl uppercase flex items-center gap-4 text-[#040A12]">
                    <span className="w-2 h-2 rounded-full bg-[#C9A44A] inline-block shadow-sm"></span>
                    <span dangerouslySetInnerHTML={{ __html: c }} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#F8F9FA] rounded-xl p-6 border border-black/5 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#040A12]/40 font-bold mb-1.5">Total Paid</div>
                <div className="font-heading text-3xl font-extrabold text-[#040A12]">₹{successData.total_amount}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#040A12]/40 font-bold sm:text-right">Status</div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.25em] rounded-sm border ${isCash && !isCashPaid ? 'bg-yellow-100/80 text-yellow-700 border-yellow-200' : 'bg-green-100/80 text-green-700 border-green-200'}`}>
                  <CheckCircle2 size={14} className="shrink-0" /> {isCash && !isCashPaid ? 'CASH PAYMENT DUE' : 'PAID'}
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <div className="text-[9px] uppercase tracking-[0.2em] text-[#040A12]/30 font-bold mb-1">
                Payment Ref: {isCash && !isCashPaid ? 'PAY AT DESK' : successData.razorpay_payment_id || 'CASH-PAID'}
              </div>
            </div>
            
            {isCash && !isCashPaid && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded text-center">
                <p className="text-xs text-red-600 font-bold uppercase tracking-wider">ENTRY: NOT ELIGIBLE UNTIL CASH IS RECEIVED</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={() => window.print()} className="bg-[#C9A44A] text-[#040A12] hover:bg-[#B38728] border-0 uppercase tracking-[0.2em] font-bold h-14 px-10 shadow-lg">
            Print Ticket
          </Button>
          <Button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'WFF Registration Confirmed!',
                  text: `I just registered for ${successData.event_name}! Registration No: ${successData.registration_number}`,
                  url: window.location.href,
                }).catch(console.error);
              } else {
                alert('Sharing is not directly supported on this device. You can copy the URL instead.');
              }
            }} 
            className="bg-white text-[#040A12] border border-black/10 hover:bg-gray-50 uppercase tracking-[0.2em] font-bold h-14 px-10 shadow-sm"
          >
            Share Ticket
          </Button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: REGISTRATION FORM
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // RENDER: REGISTRATION FORM
  // -------------------------------------------------------------
  return (
    <div className="w-full font-body text-[#040A12]">
      
      {/* FULL WIDTH HERO SECTION */}
      <section className="w-full bg-[#040A12] relative overflow-hidden text-white h-[65vh] min-h-[500px] flex items-center">
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
      <div className="max-w-[1440px] mx-auto px-6 py-16">
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
                <div className="p-8 bg-white min-h-[140px] flex flex-col justify-center">
                  {selectedCategories.length === 0 ? (
                    <p className="text-[13px] text-[#040A12]/30 text-center font-bold uppercase tracking-[0.2em]">No categories selected.</p>
                  ) : (
                    <div className="space-y-5">
                      {selectedCategories.map((cat, index) => {
                        const fee = parseFloat(cat.entry_fee || '0');
                        return (
                          <div key={cat.id} className="flex justify-between items-center text-[13px] font-bold text-[#040A12]">
                            <span className="uppercase tracking-wider">{decodeHtml(cat.name)}</span>
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
                        {/* <label className={`flex items-center gap-3 p-4 border rounded cursor-pointer transition-colors ${paymentMethod === 'online' ? 'bg-white border-[#C9A44A]' : 'bg-white border-black/10'}`}>
                          <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="accent-[#C9A44A]" />
                          <div className="flex flex-col">
                            <span className="font-bold text-[#040A12] text-sm">Online Payment (UPI / Card)</span>
                            <span className="text-xs text-[#040A12]/50">Instant confirmation</span>
                          </div>
                        </label> */}
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

                  <div className="bg-[#FCF9EE] p-8 flex justify-between items-center border-t border-b border-[#EADDAC]">
                    <span className="font-heading font-bold text-[#040A12] text-[13px] uppercase tracking-[0.2em]">Total Payable</span>
                    <span className="font-heading font-bold text-3xl md:text-4xl text-[#040A12]">₹ {pricing.total}</span>
                  </div>
                  
                  <div className="p-8 bg-white space-y-5">
                    <Button 
                      onClick={submitRegistration} 
                      disabled={loading || selectedCategoryIds.length === 0} 
                      className="w-full h-14 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-bold text-[14px] tracking-[0.15em] uppercase hover:brightness-110 hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(198,161,91,0.25)] transition-all duration-300 rounded border-0"
                    >
                      {loading ? 'Processing...' : paymentMethod === 'online' ? 'Proceed to Payment →' : 'Complete Registration →'}
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
                      A Natural<br/>Athlete<br/><span className="font-bold">A Stronger<br/>Tomorrow</span>
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 mt-8">
                     <div className="flex flex-col items-center text-center gap-2">
                       <Trophy size={18} className="text-[#C9A44A]" />
                       <span className="text-[8px] uppercase tracking-wider font-bold text-white/80">Fair<br/>Competition</span>
                     </div>
                     <div className="flex flex-col items-center text-center gap-2">
                       <CheckCircle2 size={18} className="text-[#C9A44A]" />
                       <span className="text-[8px] uppercase tracking-wider font-bold text-white/80">Real<br/>Opportunities</span>
                     </div>
                     <div className="flex flex-col items-center text-center gap-2">
                       <ShieldCheck size={18} className="text-[#C9A44A]" />
                       <span className="text-[8px] uppercase tracking-wider font-bold text-white/80">Clean<br/>Sport</span>
                     </div>
                     <div className="flex flex-col items-center text-center gap-2">
                       <svg className="w-[18px] h-[18px] text-[#C9A44A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       <span className="text-[8px] uppercase tracking-wider font-bold text-white/80">Global<br/>Standards</span>
                     </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
