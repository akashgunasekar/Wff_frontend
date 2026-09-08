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
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-tight mb-4 tracking-wider drop-shadow-xl animate-fade-up">
            Leadership & <span className="text-gold-gradient">Officials</span>
          </h1>
          <p className="text-wff-muted text-lg max-w-2xl mx-auto font-medium animate-fade-up [animation-delay:150ms]">
            The dedicated individuals upholding the integrity, transparency, and prestige of natural bodybuilding in Tamil Nadu.
          </p>
        </div>
      </section>

      {/* Interactive Client Component */}
      <AssociationClient officials={officials} />
    </div>
  );
}
