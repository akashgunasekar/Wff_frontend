import { fetchEvents } from '@/lib/api';
import RegistrationClient from './RegistrationClient';
import { Suspense } from 'react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Athlete Registration | WFF Tamil Nadu',
  description: 'Official registration portal for WFF Tamil Nadu championships.',
};

export default async function RegisterPage() {
  const events = await fetchEvents();
  
  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-32">
      <Suspense fallback={<div className="text-center p-20 font-heading text-xl uppercase tracking-widest text-wff-muted">Loading Secure Portal...</div>}>
        <RegistrationClient initialEvents={events} />
      </Suspense>
    </main>
  );
}
