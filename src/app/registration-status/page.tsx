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
          <div className="inline-block px-3 py-1 bg-[var(--gold)]/10 border border-[var(--gold)]/20 text-[var(--gold)] text-xs font-display tracking-widest uppercase mb-4">
            Athlete Services
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl uppercase text-[var(--text-primary)] mb-4 tracking-wide">
            Registration Status
          </h1>
          <p className="font-body text-[var(--muted)] text-lg max-w-2xl mx-auto">
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
