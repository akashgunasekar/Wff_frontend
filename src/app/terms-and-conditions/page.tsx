import { Container } from '@/components/ui/Container';
import { FileCheck, AlertOctagon, Camera, Calendar, CreditCard, ShieldAlert, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Terms & Conditions | WFF Tamil Nadu',
  description: 'Official Terms and Conditions for participation, event registration, and website use for World Fitness Federation Tamil Nadu.',
};

export default async function TermsAndConditionsPage() {
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
            <FileCheck size={14} /> Official Terms
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-[0.95] mb-5 tracking-tight font-bold">
            Terms &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">Conditions</span>
          </h1>
          <p className="text-wff-muted text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Effective Date: 12 September 2026 • WFF Tamil Nadu Championships &amp; Services
          </p>
        </div>
      </section>

      <Container className="mt-12 sm:mt-16 max-w-4xl">
        {/* Welcome Statement */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          <p className="text-[17px] text-wff-text-body font-medium leading-[1.8]">
            Welcome to <strong className="text-wff-text-primary">WFF Tamil Nadu</strong>. By accessing or using this website, registering for a championship, or purchasing an entry ticket/category pass, you agree to comply with and be bound by these Terms &amp; Conditions. Please read them thoroughly before proceeding with event registration or online payments.
          </p>
        </div>

        {/* 1. Event Registration */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-8">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-text-primary mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-wff-gold/10 text-wff-gold text-sm flex items-center justify-center font-bold">1</span>
            Event Registration
          </h2>
          <ul className="space-y-3.5 font-medium text-[15px] text-wff-text-body">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-wff-gold mt-2.5 shrink-0" />
              <span>Participants must provide strictly accurate, truthful, and complete information during registration.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-wff-gold mt-2.5 shrink-0" />
              <span>Participants are fully responsible for reviewing the event date, venue location, competition category criteria, age and eligibility brackets, registration fee, and federation rules prior to completing payment.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-wff-gold mt-2.5 shrink-0" />
              <span>A participant must not submit false, forged, misleading, or unauthorized personal credentials or certificates.</span>
            </li>
          </ul>
        </div>

        {/* 2. Payment Terms */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-8">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-text-primary mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-wff-gold/10 text-wff-gold text-sm flex items-center justify-center font-bold">2</span>
            Payment
          </h2>
          <div className="space-y-3.5 font-medium text-[15px] text-wff-text-body">
            <div className="flex items-start gap-3">
              <CreditCard size={18} className="text-wff-gold shrink-0 mt-1" />
              <span>Registration payments are processed securely through an authorized third-party payment gateway (Razorpay).</span>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard size={18} className="text-wff-gold shrink-0 mt-1" />
              <span>A successful payment alone does not override eligibility requirements or formal event rules. Every athlete must fulfill the physical, medical, and division criteria of WFF.</span>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard size={18} className="text-wff-gold shrink-0 mt-1" />
              <span>Participants should retain their transaction ID, payment reference, and official email receipt until event registration has been physically verified at weigh-in.</span>
            </div>
          </div>
        </div>

        {/* 3. Participant Responsibility */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-8">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-text-primary mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-wff-gold/10 text-wff-gold text-sm flex items-center justify-center font-bold">3</span>
            Participant Responsibility
          </h2>
          <ul className="space-y-3.5 font-medium text-[15px] text-wff-text-body">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-wff-gold mt-2.5 shrink-0" />
              <span>Provide original government ID proof, age verification, and required physical clearance documents upon request.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-wff-gold mt-2.5 shrink-0" />
              <span>Satisfy all applicable weight, height, and age class specifications for the chosen competition division.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-wff-gold mt-2.5 shrink-0" />
              <span>Follow all WFF competition staging rules, tanning regulations, attire standards, and instructions from stage marshals and certified judges.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-wff-gold mt-2.5 shrink-0" />
              <span>Report at the championship venue within the specified reporting period and weigh-in schedule without delay.</span>
            </li>
          </ul>
        </div>

        {/* 4. Event Changes & Modifications */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-8">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-text-primary mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-wff-gold/10 text-wff-gold text-sm flex items-center justify-center font-bold">4</span>
            Event Changes
          </h2>
          <p className="text-wff-text-body text-[15px] leading-relaxed mb-4">
            WFF Tamil Nadu reserves the right to modify event schedules, line-ups, competition categories, venue arrangements, or judging procedures where circumstances or safety regulations require. Any significant change will be promptly communicated to registered participants through available contact channels (SMS, email, phone, or official website updates).
          </p>
        </div>

        {/* 5. Disqualification */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-8">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-text-primary mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 text-sm flex items-center justify-center font-bold">5</span>
            Disqualification
          </h2>
          <p className="text-wff-text-body text-[15px] leading-relaxed mb-4">
            WFF Tamil Nadu maintains a zero-tolerance policy towards violations of sporting integrity. Disqualification without refund may occur under the following circumstances:
          </p>
          <div className="grid sm:grid-cols-2 gap-3.5">
            {[
              'Submission of false or materially misleading personal details',
              'Violation of WFF anti-doping or competition codes',
              'Misconduct, unsportsmanlike behavior, or failure to obey officials',
              'Failure to satisfy division eligibility or weigh-in guidelines'
            ].map((reason, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-lg bg-red-500/5 border border-red-500/20 text-[14px] text-wff-text-primary font-medium">
                <AlertOctagon size={18} className="text-red-500 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Photography & Media */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-8">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-text-primary mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-wff-gold/10 text-wff-gold text-sm flex items-center justify-center font-bold">6</span>
            Photography &amp; Media Rights
          </h2>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-wff-gold/10 flex items-center justify-center shrink-0 border border-wff-gold/20">
              <Camera className="text-wff-gold" size={24} />
            </div>
            <p className="text-wff-text-body text-[15px] leading-relaxed">
              Participants may be photographed, videotaped, and recorded during WFF Tamil Nadu events and ceremonies. Event photographs, livestream broadcasts, and recorded media may be utilized for legitimate promotional, journalistic, archival, and organizational purposes across print, digital, and social media, subject to applicable laws and event standards.
            </p>
          </div>
        </div>

        {/* Contact Block */}
        <div className="bg-[#040A12] border border-wff-gold/20 p-8 md:p-10 rounded-xl text-white shadow-xl relative overflow-hidden mb-12">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-gold mb-2">
            Questions Regarding Terms?
          </h2>
          <p className="text-white/70 text-[15px] mb-8">
            For clarifications regarding competition terms, rules, or federation governance, contact our committee:
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
                <div className="text-[11px] uppercase tracking-wider text-white/50 font-bold mb-1">Office</div>
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
            <Link href="/cancellation-refund-policy" className="text-wff-gold hover:underline inline-flex items-center gap-1">
              Cancellation &amp; Refund Policy <ArrowRight size={14} />
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
