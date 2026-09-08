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
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-tight mb-4 tracking-wider drop-shadow-xl animate-fade-up">
            Official <span className="text-gold-gradient">Gallery</span>
          </h1>
          <p className="text-wff-muted text-lg max-w-2xl mx-auto font-medium animate-fade-up [animation-delay:150ms]">
            Relive the greatest moments on the WFF Tamil Nadu stage.
          </p>
        </div>
      </section>

      {/* Interactive Client Component */}
      <GalleryClient albums={albums} />
    </div>
  );
}
