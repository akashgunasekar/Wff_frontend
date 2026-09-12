import { fetchEvents } from '@/lib/api';
import { EventsClient } from './EventsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Events | WFF Tamil Nadu',
  description: 'Championships, competitions and official WFF events in Tamil Nadu.',
};

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <EventsClient initialEvents={events} />
      </main>
    </div>
  );
}
