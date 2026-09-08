import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { fetchGalleryAlbums } from '@/lib/api';

export async function AlbumsSection() {
  const albums = await fetchGalleryAlbums() as any[];
  if (!albums || albums.length === 0) return null;

  const displayAlbums = [
    albums[0],
    albums[1] || albums[0],
    albums[2] || albums[0],
    albums[3] || albums[1] || albums[0]
  ];

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* Centered Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="font-display font-medium text-[12px] tracking-[0.20em] uppercase text-[var(--gold)] mb-3">Gallery</span>
          <h2 className="font-display font-bold text-[clamp(2rem,4vw,3.5rem)] uppercase text-[var(--text-primary)] leading-[0.92] tracking-[-0.01em]">
            Championship<br />
            Moments
          </h2>
        </div>

        {/* Albums Grid - Asymmetric Rows */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
          
          {/* Row 1 */}
          <Link href={`/gallery`} className="md:col-span-5 relative aspect-square md:aspect-[4/5] rounded-sm overflow-hidden bg-[var(--navy)] group block">
            <Image src={displayAlbums[0].cover_image || '/assets/wff_hero_banner.png'} alt={displayAlbums[0].title} unoptimized={displayAlbums[0].cover_image?.startsWith('/uploads')} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-700" sizes="50vw" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col">
               <span className="font-display text-[var(--gold)] text-xs tracking-[0.15em] mb-1 uppercase">Album</span>
               <span className="font-display font-bold text-white text-2xl tracking-wide uppercase">{displayAlbums[0].title}</span>
            </div>
          </Link>
          
          <Link href={`/gallery`} className="md:col-span-7 relative aspect-[4/3] md:aspect-auto rounded-sm overflow-hidden bg-[var(--navy)] group block">
            <Image src={displayAlbums[1].cover_image || '/assets/wff_hero_banner.png'} alt={displayAlbums[1].title} unoptimized={displayAlbums[1].cover_image?.startsWith('/uploads')} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-700" sizes="70vw" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col">
               <span className="font-display text-[var(--gold)] text-xs tracking-[0.15em] mb-1 uppercase">Featured Album</span>
               <span className="font-display font-bold text-white text-3xl tracking-wide uppercase">{displayAlbums[1].title}</span>
            </div>
          </Link>

          {/* Row 2 */}
          {albums.length > 2 && (
             <>
                <Link href={`/gallery`} className="md:col-span-7 relative aspect-[4/3] md:aspect-auto rounded-sm overflow-hidden bg-[var(--navy)] group block mt-2">
                  <Image src={displayAlbums[2].cover_image || '/assets/wff_hero_banner.png'} alt={displayAlbums[2].title} unoptimized={displayAlbums[2].cover_image?.startsWith('/uploads')} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-700" sizes="70vw" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col">
                    <span className="font-display text-[var(--gold)] text-xs tracking-[0.15em] mb-1 uppercase">Album</span>
                    <span className="font-display font-bold text-white text-3xl tracking-wide uppercase">{displayAlbums[2].title}</span>
                  </div>
                </Link>
                <Link href={`/gallery`} className="md:col-span-5 relative aspect-square md:aspect-[4/5] rounded-sm overflow-hidden bg-[var(--navy)] group block mt-2">
                  <Image src={displayAlbums[3].cover_image || '/assets/wff_hero_banner.png'} alt={displayAlbums[3].title} unoptimized={displayAlbums[3].cover_image?.startsWith('/uploads')} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-700" sizes="50vw" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col">
                    <span className="font-display text-[var(--gold)] text-xs tracking-[0.15em] mb-1 uppercase">Album</span>
                    <span className="font-display font-bold text-white text-2xl tracking-wide uppercase">{displayAlbums[3].title}</span>
                  </div>
                </Link>
             </>
          )}

        </div>

        <div className="flex justify-center">
          <Link href="/gallery" className="inline-flex items-center gap-2 font-display font-bold text-[13px] tracking-[0.12em] uppercase text-[var(--text-primary)] hover:text-[var(--gold)] transition-colors border-b-2 border-transparent hover:border-[var(--gold)] pb-1">
            View Full Gallery <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
}
