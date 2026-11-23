import { Container } from '@/components/ui/Container';
import { Tag, Calendar, MapPin, CheckCircle2, ShieldCheck, Phone, Mail, ArrowRight, Trophy } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings, fetchEvents } from '@/lib/api';
import { formatEventDateRange } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Pricing & Registration | WFF Tamil Nadu',
  description: 'Official registration fees and category pricing structure for WFF Tamil Nadu bodybuilding and fitness championships.',
};

export default async function PricingPage() {
  const [settings, events] = await Promise.all([
    getSiteSettings(),
    fetchEvents()
  ]);
  const featuredEvent = events[0] || null;
  const eventName = featuredEvent ? featuredEvent.event_name : 'WFF Rudra Classic 2026';
  const eventDate = featuredEvent 
    ? formatEventDateRange(featuredEvent.event_date, featuredEvent.event_end_date, featuredEvent.date_type)
    : '20 September 2026';
  const eventVenue = featuredEvent 
    ? featuredEvent.venue 
    : 'Tamil Nadu Physical Education and Sports University, Melakottaiyur, Chennai, Tamil Nadu';

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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-wff-gold/30 bg-wff-gold/10 text-wff-gold text-[11px] sm:text-[13px] font-bold tracking-[2px] uppercase mb-6 rounded-full font-heading leading-[1.4]">
            <Tag size={14} /> Official Fee Schedule
          </div>
          <h1 className="font-heading text-[clamp(36px,4.5vw,64px)] text-white uppercase leading-[0.95] mb-5 font-extrabold tracking-[-1px]">
            Pricing &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">Registration</span>
          </h1>
          <p className="text-wff-muted text-[15px] sm:text-[16px] max-w-[650px] mx-auto font-normal font-body leading-[1.6]">
            Transparent Category Fees &amp; Entry Guidelines • WFF Tamil Nadu
          </p>
        </div>
      </section>

      <Container className="mt-12 sm:mt-16 max-w-4xl">
        {/* Dedicated Section: SOUTH INDIA NATURAL LEAGUE 2027 — REGISTRATION FEES */}
        <div className="bg-[#040A12] border-2 border-wff-gold/40 p-8 md:p-12 rounded-2xl text-white shadow-2xl relative overflow-hidden mb-16">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="text-[11px] sm:text-[13px] uppercase tracking-[2px] text-wff-gold font-bold font-heading leading-[1.4] block mb-1">
                Championship Official Pricing
              </span>
              <h2 className="font-heading text-[clamp(26px,3vw,42px)] uppercase leading-[1.05] text-white font-extrabold tracking-[-0.5px]">
                SOUTH INDIA NATURAL LEAGUE 2027 — REGISTRATION FEES
              </h2>
              <p className="text-white/80 font-body text-sm mt-2">
                10 January 2027 • Chennai, Tamil Nadu • World Fitness Federation Tamil Nadu
              </p>
            </div>
            <Link
              href="/register?eventId=11"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-[14px] sm:text-[16px] tracking-[1px] uppercase shadow-lg hover:brightness-110 active:scale-95 transition-all shrink-0"
            >
              Register Now <ArrowRight size={18} />
            </Link>
          </div>

          {/* 3 Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            {/* Card 1: Single Category */}
            <div className="bg-[#071A2E]/90 border border-wff-gold/30 rounded-xl p-6 flex flex-col justify-between hover:border-wff-gold/60 transition-all hover:-translate-y-1 shadow-lg">
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-[1.5px] px-3 py-1 rounded bg-wff-gold/15 text-[#FCF6BA] border border-wff-gold/30 inline-block mb-3">
                  Tier 1 Entry
                </span>
                <h3 className="font-heading text-2xl font-bold uppercase text-white mb-2">
                  SINGLE CATEGORY
                </h3>
                <p className="text-white/70 text-xs font-body leading-relaxed mb-4">
                  Entry into any one official category division of your choice.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="font-heading text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] block">
                  ₹3,000
                </span>
                <span className="text-[11px] font-body text-white/60 block mt-1">Category Registration Fee</span>
              </div>
            </div>

            {/* Card 2: Double Category */}
            <div className="bg-[#071A2E]/90 border-2 border-wff-gold rounded-xl p-6 flex flex-col justify-between hover:border-wff-gold transition-all hover:-translate-y-1 shadow-[0_0_25px_rgba(201,164,74,0.15)] relative">
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-[#BF953F] to-[#B38728] text-[#040A12] text-[10px] font-heading font-black uppercase px-3 py-0.5 rounded-full tracking-[1px]">
                Popular Cross-Entry
              </div>
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-[1.5px] px-3 py-1 rounded bg-wff-gold/20 text-[#FCF6BA] border border-wff-gold/40 inline-block mb-3">
                  Tier 2 Entry
                </span>
                <h3 className="font-heading text-2xl font-bold uppercase text-white mb-2">
                  DOUBLE CATEGORY
                </h3>
                <p className="text-white/70 text-xs font-body leading-relaxed mb-4">
                  Cross-entry into two eligible category divisions in the championship.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="font-heading text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] block">
                  ₹5,000
                </span>
                <span className="text-[11px] font-body text-white/60 block mt-1">Combined Category Fee</span>
              </div>
            </div>

            {/* Card 3: Triple Category */}
            <div className="bg-[#071A2E]/90 border border-wff-gold/30 rounded-xl p-6 flex flex-col justify-between hover:border-wff-gold/60 transition-all hover:-translate-y-1 shadow-lg">
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-[1.5px] px-3 py-1 rounded bg-wff-gold/15 text-[#FCF6BA] border border-wff-gold/30 inline-block mb-3">
                  Tier 3 Entry
                </span>
                <h3 className="font-heading text-2xl font-bold uppercase text-white mb-2">
                  TRIPLE CATEGORY
                </h3>
                <p className="text-white/70 text-xs font-body leading-relaxed mb-4">
                  Cross-entry into three eligible category divisions in the championship.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="font-heading text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] block">
                  ₹6,000
                </span>
                <span className="text-[11px] font-body text-white/60 block mt-1">Combined Category Fee</span>
              </div>
            </div>
          </div>

          {/* Mandatory Clinical Testing Charge Banner */}
          <div className="bg-[#11243B] border border-[#C9A44A]/50 rounded-xl p-6 my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#C9A44A]/20 border border-[#C9A44A]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#FCF6BA]">
                <ShieldCheck size={22} />
              </div>
              <div>
                <div className="text-[11px] font-heading font-bold uppercase tracking-[2px] text-[#FCF6BA]">
                  Official Poster Requirement
                </div>
                <h4 className="font-heading text-xl sm:text-2xl font-bold uppercase text-white tracking-[0.5px]">
                  MANDATORY CLINICAL TESTING CHARGE
                </h4>
                <p className="text-white/75 text-xs sm:text-sm font-body leading-relaxed mt-1">
                  The event poster specifies that this drug-free clinical testing charge is mandatory for all athletes. Added once per athlete, regardless of how many categories are selected.
                </p>
              </div>
            </div>
            <div className="sm:text-right shrink-0 bg-[#071A2E] px-5 py-3 rounded-lg border border-[#C9A44A]/30">
              <span className="font-heading text-3xl font-black text-[#FCF6BA] block">₹2,000</span>
              <span className="text-[10px] font-heading uppercase tracking-[1px] text-white/70 block font-semibold">PER ATHLETE</span>
            </div>
          </div>

          {/* Example Calculations Table */}
          <div className="bg-[#071A2E]/60 border border-white/10 rounded-xl p-6 mt-6">
            <h4 className="font-heading text-lg sm:text-xl font-bold uppercase text-[#FCF6BA] tracking-[1px] mb-4">
              Example Total Calculation (Category Fee + Clinical Testing Charge)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#040A12] p-4 rounded-lg border border-white/10">
                <span className="text-xs uppercase font-heading text-white/60 font-semibold block mb-1">Single Category</span>
                <div className="text-sm font-body text-white/80">₹3,000 + ₹2,000 clinical</div>
                <div className="font-heading text-2xl font-black text-[#FCF6BA] mt-2">₹5,000 Total</div>
              </div>
              <div className="bg-[#040A12] p-4 rounded-lg border border-wff-gold/40">
                <span className="text-xs uppercase font-heading text-wff-gold font-semibold block mb-1">Double Category</span>
                <div className="text-sm font-body text-white/80">₹5,000 + ₹2,000 clinical</div>
                <div className="font-heading text-2xl font-black text-[#FCF6BA] mt-2">₹7,000 Total</div>
              </div>
              <div className="bg-[#040A12] p-4 rounded-lg border border-white/10">
                <span className="text-xs uppercase font-heading text-white/60 font-semibold block mb-1">Triple Category</span>
                <div className="text-sm font-body text-white/80">₹6,000 + ₹2,000 clinical</div>
                <div className="font-heading text-2xl font-black text-[#FCF6BA] mt-2">₹8,000 Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Existing / Other Championship Fee Schedule */}
        <div className="bg-[#040A12] border border-wff-gold/30 p-8 md:p-10 rounded-2xl text-white shadow-xl relative overflow-hidden mb-12">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="text-[11px] sm:text-[13px] uppercase tracking-[2px] text-wff-gold font-bold font-heading leading-[1.4]">Championship Event</span>
              <h2 className="font-heading text-[clamp(24px,2.5vw,36px)] uppercase leading-[1.05] text-white mt-1 font-bold">
                {eventName}
              </h2>
            </div>
            <Link
              href={featuredEvent?.id ? `/register?eventId=${featuredEvent.id}` : "/register"}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-extrabold text-[13px] sm:text-[15px] tracking-[1px] uppercase shadow-lg hover:brightness-110 transition-all shrink-0"
            >
              Register Now <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="flex items-start gap-3 text-white/80 text-[14px]">
              <Calendar className="text-wff-gold shrink-0 mt-0.5" size={18} />
              <div>
                <strong className="text-white block font-heading font-bold text-[12px] uppercase tracking-[1px] text-wff-gold">Event Date:</strong>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <span className="font-body font-semibold text-[15px] text-white">{eventDate}</span>
                  {featuredEvent?.date_type === 'multi' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-heading font-extrabold uppercase bg-wff-gold/20 text-wff-gold border border-wff-gold/40 tracking-[1px]">
                      Multi-Day
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-white/80 text-[14px]">
              <MapPin className="text-wff-gold shrink-0 mt-0.5" size={18} />
              <div>
                <strong className="text-white block font-heading font-bold text-[12px] uppercase tracking-[1px] text-wff-gold">Official Venue:</strong>
                <span className="font-body font-medium text-[14px] text-white/90 leading-[1.6] block mt-0.5">{eventVenue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Table Card */}
        <div className="bg-wff-surface border border-wff-border rounded-xl shadow-sm overflow-hidden mb-12">
          <div className="p-6 sm:p-8 border-b border-wff-border bg-wff-surface">
            <h3 className="font-heading text-[clamp(21px,2vw,24px)] uppercase tracking-[1px] text-wff-text-primary font-bold">
              Registration Fee Schedule
            </h3>
            <p className="text-[14px] sm:text-[15px] font-body text-wff-muted mt-1 leading-[1.6]">
              Standard base entry fees per competition category for the championship.
            </p>
          </div>

          <div className="divide-y divide-wff-border">
            {categoryFees.map((row, idx) => (
              <div key={idx} className="p-5 sm:px-8 flex items-center justify-between hover:bg-wff-bg/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="font-heading text-[19px] sm:text-[21px] uppercase tracking-normal text-wff-text-primary font-bold">
                    {row.category}
                  </span>
                  <span className="inline-block text-[11px] font-heading font-bold tracking-[1px] uppercase px-2.5 py-0.5 rounded-full bg-wff-gold/10 text-wff-gold border border-wff-gold/20 w-fit">
                    {row.badge}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-heading text-xl sm:text-2xl font-extrabold text-wff-gold">
                    {row.fee}
                  </span>
                  <span className="block text-[11px] font-body text-wff-muted">Base Fee</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-wff-bg text-[13px] font-body text-wff-muted border-t border-wff-border leading-relaxed">
            * Additional-category pricing applies when an athlete cross-registers into a second eligible division in the same event.
          </div>
        </div>

        {/* What the Registration Fee Covers */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-wff-gold" size={24} />
            <h3 className="font-heading text-[clamp(21px,2vw,26px)] uppercase tracking-[1px] text-wff-text-primary font-bold">
              What the Registration Fee Covers
            </h3>
          </div>
          <p className="text-[15px] font-body text-wff-text-body leading-[1.6] mb-6 font-normal">
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
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-lg bg-wff-bg border border-wff-border/70 text-[14px] text-wff-text-primary font-body font-medium leading-[1.5]">
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
            <h3 className="font-heading text-[clamp(21px,2vw,26px)] uppercase tracking-[1px] text-wff-text-primary font-bold">
              Checklist Before Payment
            </h3>
          </div>
          <ul className="space-y-3.5 font-normal text-[15px] font-body text-wff-text-body">
            {[
              'Verify the event name, date (20 September 2026), and venue location.',
              'Select the correct category matching your age, experience, and physique profile.',
              'Verify that you satisfy all eligibility requirements for junior or senior brackets.',
              'Review the applicable Terms & Conditions and Cancellation & Refund Policy.',
              'Ensure participant personal details (name, phone, email, date of birth) are accurately typed.'
            ].map((check, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-wff-gold/15 text-wff-gold text-xs flex items-center justify-center font-bold shrink-0 mt-0.5 font-heading">✓</span>
                <span className="leading-[1.6]">{check}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Card */}
        <div className="bg-[#040A12] border border-wff-gold/20 p-8 md:p-10 rounded-xl text-white shadow-xl relative overflow-hidden mb-12">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          <h2 className="font-heading text-[clamp(21px,2vw,26px)] uppercase tracking-[1px] text-wff-gold mb-2 font-bold">
            Payment &amp; Registration Support
          </h2>
          <p className="text-white/70 text-[15px] font-body leading-[1.6] mb-8">
            For registration inquiries, payment confirmation, failed transactions, duplicate payment resolution, or category cross-entry questions:
          </p>

          <div className="grid sm:grid-cols-3 gap-6 pt-2 border-t border-white/10">
            <div className="flex items-start gap-3">
              <Phone className="text-wff-gold shrink-0 mt-1" size={18} />
              <div>
                <div className="text-[11px] uppercase tracking-[1.5px] text-white/50 font-bold mb-1 font-heading">Phone</div>
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-[15px] font-semibold text-white hover:text-wff-gold transition-colors font-body">
                  {phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-wff-gold shrink-0 mt-1" size={18} />
              <div>
                <div className="text-[11px] uppercase tracking-[1.5px] text-white/50 font-bold mb-1 font-heading">Email</div>
                <a href={`mailto:${email}`} className="text-[15px] font-semibold text-white hover:text-wff-gold transition-colors font-body">
                  {email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-wff-gold shrink-0 mt-1" size={18} />
              <div>
                <div className="text-[11px] uppercase tracking-[1.5px] text-white/50 font-bold mb-1 font-heading">Headquarters</div>
                <p className="text-[13px] text-white/80 leading-[1.6] font-body">
                  {address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="border-t border-wff-border pt-8 flex flex-wrap items-center justify-between gap-4 text-[14px] font-body font-medium">
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
