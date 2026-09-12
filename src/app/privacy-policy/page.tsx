import { Container } from '@/components/ui/Container';
import { ShieldCheck, Lock, Mail, Phone, MapPin, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Privacy Policy | WFF Tamil Nadu',
  description: 'Official Privacy Policy of World Fitness Federation Tamil Nadu. Learn how we handle your event registration and payment information.',
};

export default async function PrivacyPolicyPage() {
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
            <ShieldCheck size={14} /> Legal & Compliance
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-[0.95] mb-5 tracking-tight font-bold">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">Policy</span>
          </h1>
          <p className="text-wff-muted text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Effective Date: 12 September 2026 • WFF Tamil Nadu Official Registration Portal
          </p>
        </div>
      </section>

      <Container className="mt-12 sm:mt-16 max-w-4xl">
        {/* Overview Box */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          <p className="text-[17px] text-wff-text-body font-medium leading-[1.8]">
            <strong className="text-wff-text-primary">WFF Tamil Nadu</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates the WFF Tamil Nadu official website and provides online event registration services for bodybuilding and fitness championships conducted by WFF Tamil Nadu. This Privacy Policy details our practices concerning the collection, use, and protection of personal and payment-related data.
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-10">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-text-primary mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-wff-gold/10 text-wff-gold text-sm flex items-center justify-center font-bold">1</span>
            Information We Collect
          </h2>
          <p className="text-wff-text-body text-[15px] mb-6 leading-relaxed">
            To register athletes and manage state-level championship participation, we collect only necessary personal and competition details, including:
          </p>
          <div className="grid sm:grid-cols-2 gap-3.5">
            {[
              'Full legal name',
              'Date of birth / age',
              'Gender',
              'Phone number and active email address',
              'Residential / communication address',
              'Identification or eligibility documents (where required)',
              'Competition category and registration details',
              'Payment-related transaction identifiers and receipts'
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-lg bg-wff-bg border border-wff-border/70">
                <CheckCircle2 size={18} className="text-wff-gold shrink-0 mt-0.5" />
                <span className="text-[14px] text-wff-text-primary font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: How We Use Information */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-10">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-text-primary mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-wff-gold/10 text-wff-gold text-sm flex items-center justify-center font-bold">2</span>
            How We Use Information
          </h2>
          <p className="text-wff-text-body text-[15px] mb-4 leading-relaxed">
            We use the information gathered strictly for legitimate operational purposes, such as:
          </p>
          <ul className="space-y-3 font-medium text-[15px] text-wff-text-body">
            {[
              'Processing event registrations and confirming athlete qualification and division entries.',
              'Communicating championship schedules, official reporting times, weigh-in details, and venue instructions.',
              'Providing athlete support, customer service, and addressing inquiries.',
              'Processing eligible refunds or payment corrections as per policy.',
              'Maintaining accurate event records, official score sheets, and historical results.',
              'Fulfilling applicable sports governance, legal, and regulatory requirements.'
            ].map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-wff-gold mt-2.5 shrink-0" />
                <span className="leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3: Payment Information & Security */}
        <div className="bg-wff-surface border border-wff-border p-8 md:p-10 rounded-xl shadow-sm mb-10 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-wff-gold/10 flex items-center justify-center shrink-0 border border-wff-gold/20">
              <Lock className="text-wff-gold" size={24} />
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-text-primary mb-3">
                Payment Information & Security
              </h2>
              <p className="text-wff-text-body text-[15px] leading-relaxed mb-4">
                Online registration payments may be processed securely through <strong className="text-wff-text-primary">Razorpay</strong> or another authorized payment service provider.
              </p>
              <div className="bg-wff-bg border-l-4 border-wff-gold p-4 rounded-r-lg text-[14px] text-wff-text-primary font-medium">
                <strong>Important Notice:</strong> WFF Tamil Nadu does not request, handle, or store customers&apos; confidential payment credentials—including UPI PIN, card CVV, card expiry, net banking passwords, or card PINs—on its website servers. All payment handling takes place through secure, encrypted payment gateway channels.
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Data Protection & Third-Party Services */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-wff-surface border border-wff-border p-7 rounded-xl shadow-sm">
            <h3 className="font-heading text-xl uppercase tracking-wider text-wff-text-primary mb-3 flex items-center gap-2">
              <ShieldCheck className="text-wff-gold" size={20} /> Data Protection
            </h3>
            <p className="text-[14px] text-wff-text-body leading-relaxed">
              We adopt industry-standard administrative and technical security measures to protect personal information against unauthorized access, accidental loss, alteration, misuse, or unlawful disclosure.
            </p>
          </div>
          <div className="bg-wff-surface border border-wff-border p-7 rounded-xl shadow-sm">
            <h3 className="font-heading text-xl uppercase tracking-wider text-wff-text-primary mb-3 flex items-center gap-2">
              <FileText className="text-wff-gold" size={20} /> Third-Party Services
            </h3>
            <p className="text-[14px] text-wff-text-body leading-relaxed">
              Payment processing is executed by third-party payment gateways. Their collection, use, and disclosure of payment information is governed by their respective privacy policies and security standards.
            </p>
          </div>
        </div>

        {/* Section 5: Privacy Contact */}
        <div className="bg-[#040A12] border border-wff-gold/20 p-8 md:p-10 rounded-xl text-white shadow-xl relative overflow-hidden mb-12">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider text-wff-gold mb-2">
            Privacy Contact & Inquiries
          </h2>
          <p className="text-white/70 text-[15px] mb-8">
            If you have questions regarding this Privacy Policy or wish to update your registration information, please contact our federation desk:
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
                <div className="text-[11px] uppercase tracking-wider text-white/50 font-bold mb-1">Address</div>
                <p className="text-[13px] text-white/80 leading-relaxed">
                  {address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Nav to other legal policies */}
        <div className="border-t border-wff-border pt-8 flex flex-wrap items-center justify-between gap-4 text-sm font-medium">
          <span className="text-wff-muted">Related Compliance Policies:</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms-and-conditions" className="text-wff-gold hover:underline inline-flex items-center gap-1">
              Terms & Conditions <ArrowRight size={14} />
            </Link>
            <Link href="/cancellation-refund-policy" className="text-wff-gold hover:underline inline-flex items-center gap-1">
              Cancellation & Refund Policy <ArrowRight size={14} />
            </Link>
            <Link href="/shipping-delivery-policy" className="text-wff-gold hover:underline inline-flex items-center gap-1">
              Shipping / Delivery Policy <ArrowRight size={14} />
            </Link>
            <Link href="/pricing" className="text-wff-gold hover:underline inline-flex items-center gap-1">
              Pricing & Registration <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
