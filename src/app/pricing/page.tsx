import { Container } from '@/components/ui/Container';
import { Tag, Calendar, MapPin, CheckCircle2, ShieldCheck, Phone, Mail, ArrowRight, Trophy } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Pricing & Registration | WFF Tamil Nadu',
  description: 'Official registration fees and category pricing structure for WFF Tamil Nadu bodybuilding and fitness championships.',
};

export default async function PricingPage() {
  const settings = await getSiteSettings();
  const phone = settings.phone || '+91 99529 22686';
  const email = settings.contact_email || 'wfftamilnadu@gmail.com';
  const address = settings.contact_address || 'No. 7/8, Near ICICI Bank, Link Road, Kilpauk Garden Road, Shenoy Nagar, Chennai – 600030, Tamil Nadu.';

  const categoryFees = [
    { category: "Senior Men's Physique", fee: '₹2,000', badge: 'Popular Division' },
    { category: 'Senior Bodybuilding', fee: '₹2,000', badge: 'Core Championship' },
    { category: 'Denim Jeans', fee: '₹2,000', badge: 'Open Men' },
    { category: 'Junior Bermuda', fee: '₹2,000', badge: 'Under 23' },
    { category: 'Junior Bodybuilding', fee: '₹2,000', badge: 'Under 23' },
    { category: 'Additional Category', fee: '₹1,000*', badge: 'Per Cross-Entry' },
  ];

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
            <Tag size={14} /> Official Fee Schedule
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-[0.95] mb-5 tracking-tight font-bold">
            Pricing &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">Registration</span>
          </h1>
          <p className="text-wff-muted text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Transparent Category Fees &amp; Entry Guidelines • WFF Tamil Nadu
          </p>
        </div>
      </section>

      <Container className="mt-12 sm:mt-16 max-w-4xl">
        {/* Featured Championship Banner */}
        <div className="bg-[#040A12] border border-wff-gold/30 p-8 md:p-10 rounded-2xl text-white shadow-xl relative overflow-hidden mb-12">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-wff-gold font-bold">Upcoming Championship</span>
              <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-wider text-white mt-1">
                WFF Rudra Classic 2026
              </h2>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-bold text-sm tracking-wider uppercase shadow-lg hover:brightness-110 transition-all shrink-0"
            >
              Register Now <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="flex items-start gap-3 text-white/80 text-[14px]">
              <Calendar className="text-wff-gold shrink-0 mt-0.5" size={18} />
              <div>
                <strong className="text-white block">Event Date:</strong>
                <span>20 September 2026</span>
              </div>
            </div>
            <div className="flex items-start gap-3 text-white/80 text-[14px]">
              <MapPin className="text-wff-gold shrink-0 mt-0.5" size={18} />
              <div>
                <strong className="text-white block">Official Venue:</strong>
                <span>Tamil Nadu Physical Education and Sports University, Melakottaiyur, Chennai, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Table Card */}
        <div className="bg-wff-surface border border-wff-border rounded-xl shadow-sm overflow-hidden mb-12">
          <div className="p-6 sm:p-8 border-b border-wff-border bg-wff-surface">
            <h3 className="font-heading text-2xl uppercase tracking-wider text-wff-text-primary">
              Registration Fee Schedule
            </h3>
            <p className="text-sm text-wff-muted mt-1">
              Standard base entry fees per competition category for the championship.
            </p>
          </div>

          <div className="divide-y divide-wff-border">
            {categoryFees.map((row, idx) => (
              <div key={idx} className="p-5 sm:px-8 flex items-center justify-between hover:bg-wff-bg/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="font-heading text-lg sm:text-xl uppercase tracking-wide text-wff-text-primary font-bold">
                    {row.category}
                  </span>
                  <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-wff-gold/10 text-wff-gold border border-wff-gold/20 w-fit">
                    {row.badge}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-heading text-xl sm:text-2xl font-bold text-wff-gold">
                    {row.fee}
                  </span>
                  <span className="block text-[11px] text-wff-muted">Base Fee</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-wff-bg text-xs text-wff-muted border-t border-wff-border">
            * Additional-category pricing applies when an athlete cross-registers into a second eligible division in the same event.
          </div>
        </div>

        {/* What the Registration Fee Covers */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-wff-gold" size={24} />
            <h3 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-text-primary">
              What the Registration Fee Covers
            </h3>
          </div>
          <p className="text-[15px] text-wff-text-body leading-relaxed mb-6 font-medium">
            The registration fee provides full athlete qualification, official division staging, and entry for the chosen category under certified WFF judging protocols:
          </p>
          <div className="grid sm:grid-cols-2 gap-3.5">
            {[
              'Official entry into the selected competition division',
              'Stage staging, judging evaluation, and scoring',
              'Official athlete certificate of participation',
              'Official athlete chest / badge number allocation',
              'Access to athlete warm-up and backstage area',
              'Eligibility for championship medals and podium awards'
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-lg bg-wff-bg border border-wff-border/70 text-[14px] text-wff-text-primary font-medium">
                <CheckCircle2 size={18} className="text-wff-gold shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Before Payment Checklist */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-wff-gold" size={24} />
            <h3 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-text-primary">
              Checklist Before Payment
            </h3>
          </div>
          <ul className="space-y-3.5 font-medium text-[15px] text-wff-text-body">
            {[
              'Verify the event name, date (20 September 2026), and venue location.',
              'Select the correct category matching your age, experience, and physique profile.',
              'Verify that you satisfy all eligibility requirements for junior or senior brackets.',
              'Review the applicable Terms & Conditions and Cancellation & Refund Policy.',
              'Ensure participant personal details (name, phone, email, date of birth) are accurately typed.'
            ].map((check, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-wff-gold/15 text-wff-gold text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">✓</span>
                <span className="leading-snug">{check}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Card */}
        <div className="bg-[#040A12] border border-wff-gold/20 p-8 md:p-10 rounded-xl text-white shadow-xl relative overflow-hidden mb-12">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-gold mb-2">
            Payment &amp; Registration Support
          </h2>
          <p className="text-white/70 text-[15px] mb-8">
            For registration inquiries, payment confirmation, failed transactions, duplicate payment resolution, or category cross-entry questions:
          </p>

          <div className="grid sm:grid-cols-3 gap-6 pt-2 border-t border-white/10">
            <div className="flex items-start gap-3">
              <Phone className="text-wff-gold shrink-0 mt-1" size={18} />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50 font-bold mb-1">Phone</div>
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-[15px] font-semibold text-white hover:text-wff-gold transition-colors">
                  {phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-wff-gold shrink-0 mt-1" size={18} />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50 font-bold mb-1">Email</div>
                <a href={`mailto:${email}`} className="text-[15px] font-semibold text-white hover:text-wff-gold transition-colors">
                  {email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-wff-gold shrink-0 mt-1" size={18} />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50 font-bold mb-1">Headquarters</div>
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
            <Link href="/cancellation-refund-policy" className="text-wff-gold hover:underline inline-flex items-center gap-1">
              Cancellation &amp; Refund Policy <ArrowRight size={14} />
            </Link>
            <Link href="/shipping-delivery-policy" className="text-wff-gold hover:underline inline-flex items-center gap-1">
              Shipping / Delivery Policy <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
