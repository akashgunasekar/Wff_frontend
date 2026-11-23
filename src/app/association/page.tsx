import { fetchOfficials } from '@/lib/api';
import AssociationClient from './AssociationClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Association & Leadership | WFF Tamil Nadu',
  description: 'Meet the officials, judges, and board members of the World Fitness Federation Tamil Nadu.',
};

export default async function AssociationPage() {
  const officials = await fetchOfficials();

  return (
    <div className="flex flex-col min-h-screen bg-wff-bg">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden border-b-[3px] border-wff-gold">
        <div className="absolute inset-0 z-0 bg-[#030810]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-wff-navy via-[#030810] to-black opacity-90"></div>
        </div>
        
        <div className="relative z-10 text-center px-6">
          <h1 className="font-heading text-[clamp(36px,4.5vw,64px)] text-white uppercase leading-[0.95] mb-4 tracking-[-1px] font-black drop-shadow-xl animate-fade-up">
            Leadership &amp; <span className="text-gold-gradient">Officials</span>
          </h1>
          <p className="font-body text-wff-muted text-[15px] sm:text-[16px] max-w-[650px] mx-auto font-normal leading-[1.6] animate-fade-up [animation-delay:150ms]">
            The dedicated individuals upholding the integrity, transparency, and prestige of natural bodybuilding in Tamil Nadu.
          </p>
        </div>
      </section>

      {/* Interactive Client Component */}
      <AssociationClient officials={officials} />
    </div>
  );
}
