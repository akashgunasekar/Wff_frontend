"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, Search, CreditCard, CheckCircle2 } from 'lucide-react';
import { loadRazorpay } from '@/lib/utils';
import Image from 'next/image';

interface RegistrationData {
  id: number;
  registration_number: string;
  athlete_name: string;
  status: string;
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
  const [regNumber, setRegNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registration, setRegistration] = useState<RegistrationData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber.trim()) {
      setError("Please enter a registration number.");
      return;
    }

    setError('');
    setLoading(true);
    setRegistration(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/registrations/show.php?registration_number=${encodeURIComponent(regNumber.trim())}`);
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

  const handlePayment = async () => {
    if (!registration) return;
    
    setError('');
    setLoading(true);
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      const orderRes = await fetch(`${API_BASE}/payments/create-order.php`, {
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
            const verifyRes = await fetch(`${API_BASE}/payments/verify.php`, {
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
        fetch(`${API_BASE}/payments/failure.php`, {
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
        <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-500 mt-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 text-green-500 rounded-full mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--text-primary)]">Registration Confirmed</h2>
            <p className="text-[var(--gold)] mt-2 font-medium tracking-wide">Spot secured on stage.</p>
          </div>

          {/* TICKET UI */}
          <div className="bg-white text-black overflow-hidden shadow-2xl relative">
            {/* Ticket Header */}
            <div className="bg-[var(--navy)] text-white p-6 md:p-8 flex items-center justify-between">
              <div>
                <div className="text-xs tracking-[0.2em] text-[var(--gold)] mb-1">WORLD FITNESS FEDERATION</div>
                <h3 className="font-display text-2xl uppercase tracking-wider">{registration.event_name}</h3>
              </div>
              <img src="/assets/wff-india.png" alt="WFF Logo" className="h-12 w-auto object-contain hidden sm:block" />
            </div>
            
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
              <div className="flex-grow space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Athlete</div>
                    <div className="font-display text-xl uppercase text-black">{registration.athlete_name}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Registration No.</div>
                    <div className="font-display text-xl text-black">{registration.registration_number}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Date</div>
                    <div className="font-medium text-black uppercase">{registration.event_date}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Venue</div>
                    <div className="font-medium text-black uppercase">{registration.venue || 'TBA'}</div>
                  </div>
                </div>

                <div className="border-t border-b border-gray-200 py-6">
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Categories</div>
                  <ul className="space-y-1">
                    {registration.categories.map((c: string, idx: number) => (
                      <li key={idx} className="font-display text-lg uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--gold)] inline-block"></span>
                        {c}
                      </li>
                    ))}
                  </ul>
                  {registration.tan_spray_requested && (
                     <div className="mt-3 text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 inline-block"></span>
                        + TAN SPRAY ADDED
                     </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Total Paid</div>
                    <div className="font-display text-xl text-black">₹{registration.total_amount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Status</div>
                    <div className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest">
                      PAID
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ticket Stub / QR Side */}
              <div className="md:w-48 shrink-0 flex flex-col items-center justify-center bg-gray-50 p-6 border-l border-dashed border-gray-300 relative">
                 <div className="absolute top-0 bottom-0 left-[-8px] flex flex-col justify-between py-2">
                    <div className="w-4 h-4 rounded-full bg-[var(--bg-color)]"></div>
                    <div className="w-4 h-4 rounded-full bg-[var(--bg-color)]"></div>
                 </div>
                 <div className="w-32 h-32 bg-white border border-gray-200 shadow-sm p-2 flex items-center justify-center mb-4">
                   <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(registration.registration_number)}`} 
                      alt="Verification QR" 
                      className="w-full h-full object-contain"
                   />
                 </div>
                 <div className="text-center w-full">
                   <div className="text-[8px] uppercase tracking-widest text-gray-400 mb-1">Payment Ref</div>
                   <div className="text-[10px] font-mono text-gray-700 truncate w-full" title={registration.razorpay_payment_id || 'N/A'}>
                     {registration.razorpay_payment_id || 'N/A'}
                   </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={() => window.print()} variant="secondary" className="uppercase tracking-widest h-12 px-8">
              Print Ticket
            </Button>
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
