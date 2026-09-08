"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');

    // Simulate API request (Will connect to POST /api/contact later)
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  if (status === 'success') {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center animate-fade-up border border-wff-border p-10 bg-wff-bg rounded-sm shadow-inner">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h3 className="font-heading text-3xl uppercase tracking-widest text-wff-text-primary mb-4">Message Sent!</h3>
        <p className="text-wff-muted font-medium text-lg max-w-sm mx-auto">
          Thank you for reaching out. A federation official will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {status === 'error' && (
        <div className="bg-red-500/10 border-2 border-red-500/30 p-5 rounded-sm flex items-start gap-4 text-red-500 mb-8">
          <AlertCircle size={24} className="shrink-0 mt-0.5" />
          <span className="font-bold text-sm tracking-wide">Failed to send message. Please check your connection and try again.</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-wff-muted uppercase tracking-[0.2em]">Full Name *</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={cn(
              "w-full bg-wff-bg border rounded-sm px-5 py-4 text-[15px] font-medium text-wff-text-primary focus:outline-none focus:ring-1 focus:ring-wff-gold/80 focus:border-wff-gold transition-all shadow-inner",
              errors.name ? "border-red-500" : "border-wff-border"
            )}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-xs font-bold tracking-wide">{errors.name}</p>}
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-bold text-wff-muted uppercase tracking-[0.2em]">Phone Number *</label>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={cn(
              "w-full bg-wff-bg border rounded-sm px-5 py-4 text-[15px] font-medium text-wff-text-primary focus:outline-none focus:ring-1 focus:ring-wff-gold/80 focus:border-wff-gold transition-all shadow-inner",
              errors.phone ? "border-red-500" : "border-wff-border"
            )}
            placeholder="+91 98765 43210"
          />
          {errors.phone && <p className="text-red-500 text-xs font-bold tracking-wide">{errors.phone}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[11px] font-bold text-wff-muted uppercase tracking-[0.2em]">Email Address *</label>
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          suppressHydrationWarning={true}
          className={cn(
            "w-full bg-wff-bg border rounded-sm px-5 py-4 text-[15px] font-medium text-wff-text-primary focus:outline-none focus:ring-1 focus:ring-wff-gold/80 focus:border-wff-gold transition-all shadow-inner",
            errors.email ? "border-red-500" : "border-wff-border"
          )}
          placeholder="athlete@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs font-bold tracking-wide">{errors.email}</p>}
      </div>

      <div className="space-y-3">
        <label className="text-[11px] font-bold text-wff-muted uppercase tracking-[0.2em]">Subject</label>
        <select 
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full bg-wff-bg border border-wff-border rounded-sm px-5 py-4 text-[15px] font-medium text-wff-text-primary focus:outline-none focus:ring-1 focus:ring-wff-gold/80 focus:border-wff-gold transition-all appearance-none cursor-pointer shadow-inner"
        >
          <option value="">Select a topic...</option>
          <option value="Championship Registration">Championship Registration</option>
          <option value="WFF Membership">WFF Membership</option>
          <option value="Sponsorship">Sponsorship Inquiry</option>
          <option value="Judging/Officials">Judging & Officials</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="text-[11px] font-bold text-wff-muted uppercase tracking-[0.2em]">Message *</label>
        <textarea 
          name="message"
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className={cn(
            "w-full bg-wff-bg border rounded-sm px-5 py-4 text-[15px] font-medium text-wff-text-primary focus:outline-none focus:ring-1 focus:ring-wff-gold/80 focus:border-wff-gold transition-all resize-none shadow-inner",
            errors.message ? "border-red-500" : "border-wff-border"
          )}
          placeholder="How can we help you?"
        ></textarea>
        {errors.message && <p className="text-red-500 text-xs font-bold tracking-wide">{errors.message}</p>}
      </div>

      <div className="pt-4 border-t border-wff-border/50">
        <Button 
          type="submit" 
          variant="gold" 
          className="w-full h-16 shadow-[0_4px_20px_rgba(198,161,91,0.2)] text-[15px] tracking-[0.2em] font-bold uppercase flex items-center justify-center gap-3"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </Button>
      </div>
    </form>
  );
}
