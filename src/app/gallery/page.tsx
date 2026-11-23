import { fetchGalleryAlbums } from '@/lib/api';
import GalleryClient from './GalleryClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery | WFF Tamil Nadu',
  description: 'View the official photo galleries from WFF Tamil Nadu bodybuilding championships.',
};

export default async function GalleryPage() {
  const albums: any = await fetchGalleryAlbums();

  return (
    <div className="flex flex-col min-h-screen bg-wff-bg">
      {/* Hero Section */}
      <section className="relative w-full h-[35vh] min-h-[300px] flex items-center justify-center overflow-hidden border-b-[3px] border-wff-gold">
        <div className="absolute inset-0 z-0 bg-[#030810]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-wff-navy via-[#030810] to-black opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/assets/hero-pattern.png')] opacity-10 mix-blend-overlay"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 mt-10">
          <h1 className="font-heading text-[clamp(36px,4.5vw,64px)] text-white uppercase leading-[0.95] mb-4 tracking-[-1px] font-black drop-shadow-xl animate-fade-up">
            Official <span className="text-gold-gradient">Gallery</span>
          </h1>
          <p className="font-body text-wff-muted text-[15px] sm:text-[16px] max-w-[650px] mx-auto font-normal leading-[1.6] animate-fade-up [animation-delay:150ms]">
            Relive the greatest moments on the WFF Tamil Nadu stage.
          </p>
        </div>
      </section>

      {/* Interactive Client Component */}
      <GalleryClient albums={albums} />
    </div>
  );
}
