import { Container } from '@/components/ui/Container';
import { Truck, CheckCircle2, Award, Mail, Phone, MapPin, ArrowRight, Info } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | WFF Tamil Nadu',
  description: 'Official Shipping and Delivery Policy for World Fitness Federation Tamil Nadu event registration services.',
};

export default async function ShippingDeliveryPolicyPage() {
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
            <Truck size={14} /> Service Delivery
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-[0.95] mb-5 tracking-tight font-bold">
            Shipping &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">Delivery Policy</span>
          </h1>
          <p className="text-wff-muted text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Effective Date: 12 September 2026 • Digital Confirmation &amp; On-Venue Fulfillment
          </p>
        </div>
      </section>

      <Container className="mt-12 sm:mt-16 max-w-4xl">
        {/* Core Nature Box */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-wff-gold/10 flex items-center justify-center shrink-0 border border-wff-gold/20">
              <Info className="text-wff-gold" size={24} />
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-text-primary mb-3">
                Nature of Service
              </h2>
              <p className="text-[16px] text-wff-text-body font-medium leading-[1.8]">
                <strong className="text-wff-text-primary">WFF Tamil Nadu</strong> provides event registration and championship participation services. The registration fee relates exclusively to entry, participation, and division staging in our bodybuilding and fitness championships. <strong className="text-wff-text-primary">No physical merchandise or physical products are sold or shipped through the online registration portal.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* 1. Digital Registration Confirmation */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-8">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-text-primary mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-wff-gold/10 text-wff-gold text-sm flex items-center justify-center font-bold">1</span>
            Registration Confirmation (Digital Delivery)
          </h2>
          <p className="text-wff-text-body text-[15px] mb-5 leading-relaxed">
            Upon successful completion of online payment through our secure payment gateway:
          </p>
          <ul className="space-y-3.5 font-medium text-[15px] text-wff-text-body">
            <li className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-wff-gold shrink-0 mt-0.5" />
              <span>The participant&apos;s registration is recorded immediately in the WFF Tamil Nadu athlete database.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-wff-gold shrink-0 mt-0.5" />
              <span>A registration and payment confirmation receipt is provided instantly on-screen and transmitted via email/SMS.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-wff-gold shrink-0 mt-0.5" />
              <span>Event-related instructions—including official reporting timelines, stage rules, and weigh-in venue details—will be communicated to registered participants using the contact details provided during registration.</span>
            </li>
          </ul>
        </div>

        {/* 2. Physical Handover / Venue Distribution */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-wff-gold/10 flex items-center justify-center shrink-0 border border-wff-gold/20">
              <Award className="text-wff-gold" size={24} />
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-text-primary mb-3">
                Physical Items &amp; On-Venue Distribution
              </h2>
              <p className="text-wff-text-body text-[15px] leading-relaxed mb-4">
                No physical items are shipped via postal or courier service as part of the online registration process. If a particular championship includes physical items—such as participant athlete kits, badges, chest numbers, official certificates of participation, medals, or championship trophies—such items are handed over in person directly at the event venue during weigh-in or upon competition conclusion in accordance with event arrangements announced by WFF Tamil Nadu.
              </p>
            </div>
          </div>
        </div>

        {/* Support Block */}
        <div className="bg-[#040A12] border border-wff-gold/20 p-8 md:p-10 rounded-xl text-white shadow-xl relative overflow-hidden mb-12">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-gold mb-2">
            Delivery &amp; Confirmation Support
          </h2>
          <p className="text-white/70 text-[15px] mb-8">
            If you have completed your payment but have not received your digital registration confirmation receipt within 2 hours, please reach out to our support team:
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
            <Link href="/terms-and-conditions" className="text-wff-gold hover:underline inline-flex items-center gap-1">
              Terms &amp; Conditions <ArrowRight size={14} />
            </Link>
            <Link href="/cancellation-refund-policy" className="text-wff-gold hover:underline inline-flex items-center gap-1">
              Cancellation &amp; Refund Policy <ArrowRight size={14} />
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
