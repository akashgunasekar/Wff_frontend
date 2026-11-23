import RegistrationStatusClient from './RegistrationStatusClient';
import { Suspense } from 'react';

export const metadata = {
  title: 'Check Registration Status | WFF Tamil Nadu',
  description: 'Check the status of your WFF Tamil Nadu registration.',
};

export default function RegistrationStatusPage() {
  return (
    <main className="min-h-screen bg-[var(--surface)] pt-12 pb-24">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="mb-12 text-center">
          <div className="inline-block px-4 py-1.5 bg-[var(--gold)]/10 border border-[var(--gold)]/20 text-[var(--gold)] text-[11px] sm:text-[13px] font-heading font-bold tracking-[2px] uppercase mb-4 rounded-full leading-[1.4]">
            Athlete Services
          </div>
          <h1 className="font-heading font-extrabold text-[clamp(32px,4vw,56px)] uppercase text-[var(--text-primary)] mb-4 tracking-[-0.5px] leading-[0.95]">
            Registration Status
          </h1>
          <p className="font-body font-normal text-[15px] sm:text-[16px] text-[var(--muted)] max-w-[650px] mx-auto leading-[1.6]">
            Enter your registration number below to check the status of your championship registration and payment.
          </p>
        </div>
        
        <Suspense fallback={<div className="text-center p-12 text-[var(--muted)]">Loading...</div>}>
          <RegistrationStatusClient />
        </Suspense>
      </div>
    </main>
  );
}
