import { 
  fetchHeroSlides, 
  fetchEvents, 
  fetchOfficials, 
  fetchWinners, 
  fetchGallery,
  getHomepageSections
} from '@/lib/api';

import { HeroSection } from '@/components/sections/HeroSection';
import { UpcomingEventsSection } from '@/components/sections/UpcomingEventsSection';
import { WhyCompeteSection } from '@/components/sections/WhyCompeteSection';
import { ExcellenceSection } from '@/components/sections/ExcellenceSection';
import { OfficialsSection } from '@/components/sections/OfficialsSection';
import { WinnersSection } from '@/components/sections/WinnersSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { CtaSection } from '@/components/sections/CtaSection';

export default async function Home() {
  const [
    heroSlides,
    events,
    officials,
    winners,
    galleryImages,
    sections
  ] = await Promise.all([
    fetchHeroSlides(),
    fetchEvents(),
    fetchOfficials(),
    fetchWinners(),
    fetchGallery(),
    getHomepageSections()
  ]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <HeroSection slides={heroSlides} />
      <UpcomingEventsSection events={events} />
      <WhyCompeteSection />
      <ExcellenceSection />
      <WinnersSection winners={winners} />
      <OfficialsSection officials={officials} />
      <GallerySection images={galleryImages} />
      <CtaSection section={sections?.final_cta} />
    </div>
  );
}
