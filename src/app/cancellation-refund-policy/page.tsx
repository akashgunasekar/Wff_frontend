import { Container } from '@/components/ui/Container';
import { RefreshCw, CheckCircle2, XCircle, CopyCheck, Clock, Mail, Phone, MapPin, ArrowRight, HelpCircle } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | WFF Tamil Nadu',
  description: 'Official Cancellation and Refund Policy of World Fitness Federation Tamil Nadu for sports championship registrations.',
};

export default async function CancellationRefundPolicyPage() {
  const settings = await getSiteSettings();
  const phone = settings.phone || '+91 99529 22686';
  const email = settings.contact_email || 'wfftamilnadu@gmail.com';
  const address = settings.contact_address || 'No. 7/8, Near ICICI Bank, Link Road, Kilpauk Garden Road, Shenoy Nagar, Chennai – 600030, Tamil Nadu.';

  return (
    <div className="flex flex-col min-h-screen bg-wff-bg pb-28">
      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-24 flex items-center justify-center overflow-hidden border-b border-wff-border bg-wff-deep-navy">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-wff-navy via-[#030810] to-black opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/assets/hero-pattern.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-wff-gold/30 bg-wff-gold/10 text-wff-gold text-[11px] font-bold tracking-[0.2em] uppercase mb-6 rounded-full">
            <RefreshCw size={14} /> Fair Practice Policy
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-[0.95] mb-5 tracking-tight font-bold">
            Cancellation &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">Refund Policy</span>
          </h1>
          <p className="text-wff-muted text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Effective Date: 12 September 2026 • Transparent Payment Protection for Athletes
          </p>
        </div>
      </section>

      <Container className="mt-12 sm:mt-16 max-w-4xl">
        {/* Notice Banner */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          <h2 className="font-heading text-2xl uppercase tracking-wider text-wff-text-primary mb-3">
            Event Registration Cancellation
          </h2>
          <p className="text-[16px] text-wff-text-body font-medium leading-[1.8]">
            Registration fees are subject to the cancellation and refund conditions applicable to the respective championship event. Because event scheduling, stage slot allocation, judging panels, and athlete kits are pre-planned, participants should carefully review the event date, category criteria, and registration fee before completing online payment.
          </p>
        </div>

        {/* Two Columns: Refund Eligibility vs Non-Refundable */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Refund Eligibility */}
          <div className="bg-wff-surface border border-emerald-500/20 p-8 rounded-xl shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 size={22} />
              </div>
              <h3 className="font-heading text-2xl uppercase tracking-wider text-wff-text-primary">
                Refund Eligibility
              </h3>
            </div>
            <p className="text-[14px] text-wff-text-body mb-5">
              Refunds may be considered and initiated under the following circumstances:
            </p>
            <ul className="space-y-3 font-medium text-[14px] text-wff-text-body">
              {[
                'Event cancellation initiated by the organizer (WFF Tamil Nadu).',
                'Event postponement where WFF Tamil Nadu explicitly announces a refund window.',
                'Duplicate payment caused by a verified technical or payment gateway error.',
                'Any other special or extenuating circumstance specifically reviewed and approved in writing by WFF Tamil Nadu.'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Non-Refundable Situations */}
          <div className="bg-wff-surface border border-rose-500/20 p-8 rounded-xl shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                <XCircle size={22} />
              </div>
              <h3 className="font-heading text-2xl uppercase tracking-wider text-wff-text-primary">
                Non-Refundable Situations
              </h3>
            </div>
            <p className="text-[14px] text-wff-text-body mb-5">
              Registration fees will strictly NOT be refunded under the following situations:
            </p>
            <ul className="space-y-3 font-medium text-[14px] text-wff-text-body">
              {[
                'Voluntary withdrawal or drop-out by the participant, unless event-specific terms state otherwise.',
                'Failure to attend or show up on event day.',
                'Disqualification due to violation of WFF competition rules or misconduct.',
                'Incorrect or inaccurate participant information submitted during checkout.',
                'Failure to satisfy division eligibility, age, or weight class guidelines.',
                'Failure to report within the specified reporting/weigh-in period.'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Duplicate Payments & Refund Processing */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-wff-surface border border-wff-border p-8 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <CopyCheck className="text-wff-gold" size={24} />
              <h3 className="font-heading text-2xl uppercase tracking-wider text-wff-text-primary">
                Duplicate Payments
              </h3>
            </div>
            <p className="text-[15px] text-wff-text-body leading-relaxed">
              If an athlete is accidentally charged more than once for the same registration due to network fluctuation or multiple button clicks, the duplicate transaction will be reviewed against our bank ledger and refunded after verification.
            </p>
          </div>

          <div className="bg-wff-surface border border-wff-border p-8 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-wff-gold" size={24} />
              <h3 className="font-heading text-2xl uppercase tracking-wider text-wff-text-primary">
                Refund Processing
              </h3>
            </div>
            <p className="text-[15px] text-wff-text-body leading-relaxed">
              Approved refunds will be initiated back to the original payment method (e.g. credit/debit card, UPI, or net banking) used during the transaction. The turnaround time for the credit to reflect is typically 5–7 business days, depending on the issuing bank or payment gateway.
            </p>
          </div>
        </div>

        {/* How to Request a Refund Step-by-Step */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="text-wff-gold" size={24} />
            <h3 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-text-primary">
              How to Request a Refund
            </h3>
          </div>
          <p className="text-wff-text-body text-[15px] mb-6 leading-relaxed">
            To submit a valid refund or duplicate payment claim, email <strong className="text-wff-text-primary">{email}</strong> or contact refund support with the following mandatory details:
          </p>

          <div className="grid sm:grid-cols-2 gap-3.5 mb-6">
            {[
              'Full Athlete / Participant Name',
              'Registered Championship & Competition Category',
              'Razorpay Payment ID / Transaction ID',
              'Date and Time of Payment',
              'Clear Explanation / Reason for the Request'
            ].map((field, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3.5 rounded-lg bg-wff-bg border border-wff-border/70 text-[14px] font-medium text-wff-text-primary">
                <span className="w-6 h-6 rounded-full bg-wff-gold/15 text-wff-gold text-xs flex items-center justify-center font-bold shrink-0">{idx + 1}</span>
                <span>{field}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Support Block */}
        <div className="bg-[#040A12] border border-wff-gold/20 p-8 md:p-10 rounded-xl text-white shadow-xl relative overflow-hidden mb-12">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-gold mb-2">
            Refund Support &amp; Assistance
          </h2>
          <p className="text-white/70 text-[15px] mb-8">
            Our finance and registration desk is active to assist you with any billing or payment concerns:
          </p>

          <div className="grid sm:grid-cols-3 gap-6 pt-2 border-t border-white/10">
            <div className="flex items-start gap-3">
              <Phone className="text-wff-gold shrink-0 mt-1" size={18} />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50 font-bold mb-1">Support Phone</div>
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-[15px] font-semibold text-white hover:text-wff-gold transition-colors">
                  {phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-wff-gold shrink-0 mt-1" size={18} />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50 font-bold mb-1">Refund Email</div>
                <a href={`mailto:${email}`} className="text-[15px] font-semibold text-white hover:text-wff-gold transition-colors">
                  {email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-wff-gold shrink-0 mt-1" size={18} />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50 font-bold mb-1">Federation Office</div>
                <p className="text-[13px] text-white/80 leading-relaxed">
                  {address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="border-t border-wff-border pt-8 flex flex-wrap items-center justify-between gap-4 text-sm font-medium">
          <span className="text-wff-muted">Related Policies:</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="text-wff-gold hover:underline inline-flex items-center gap-1">
              Privacy Policy <ArrowRight size={14} />
            </Link>
            <Link href="/terms-and-conditions" className="text-wff-gold hover:underline inline-flex items-center gap-1">
              Terms &amp; Conditions <ArrowRight size={14} />
            </Link>
            <Link href="/shipping-delivery-policy" className="text-wff-gold hover:underline inline-flex items-center gap-1">
              Shipping / Delivery Policy <ArrowRight size={14} />
            </Link>
            <Link href="/pricing" className="text-wff-gold hover:underline inline-flex items-center gap-1">
              Pricing &amp; Registration <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
