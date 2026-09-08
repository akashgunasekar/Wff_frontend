"use client";

import Image from 'next/image';
import Link from 'next/link';
import { GalleryImage } from '@/types';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { resolveImageUrl } from '@/lib/api';

interface GallerySectionProps {
  images: GalleryImage[];
}

export function GallerySection({ images }: GallerySectionProps) {
  if (!images || images.length === 0) {
    return (
      <section className="py-24 lg:py-32 bg-[#050B14] text-white border-t border-wff-border overflow-hidden">
        <Container className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 lg:mb-20">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-wff-gold" />
                <span className="font-heading font-semibold text-sm tracking-[0.2em] uppercase text-wff-gold">
                  Archive
                </span>
              </div>
              <h2 className="font-heading font-bold text-5xl md:text-6xl uppercase text-white leading-[1] tracking-tight">
                Championship<br />
                <span className="text-wff-gold">Gallery</span>
              </h2>
            </div>
          </div>
          
          <div className="py-12 border border-white/10 bg-white/5 rounded-sm text-center">
            <p className="font-heading font-medium text-lg tracking-[0.16em] uppercase text-wff-muted">
              Gallery images will appear here after an event is published.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  // Ensure enough images for a marquee, minimum 6, else duplicate what we have until we do
  let safeImages = [...images];
  while (safeImages.length > 0 && safeImages.length < 8) {
    safeImages = [...safeImages, ...images];
  }

  const half = Math.ceil(safeImages.length / 2);
  const row1Images = safeImages.slice(0, half);
  const row2Images = safeImages.slice(half);

  return (
    <section className="py-20 lg:py-28 bg-[#050B14] text-white overflow-hidden relative w-full">
      <Container className="relative z-10 mb-12 lg:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-wff-gold" />
              <span className="font-heading font-semibold text-sm tracking-[0.2em] uppercase text-wff-gold">
                Archive
              </span>
            </div>
            <h2 className="font-heading font-bold text-5xl md:text-6xl uppercase text-white leading-[1] tracking-tight">
              Championship<br />
              <span className="text-wff-gold">Gallery</span>
            </h2>
          </div>
          <Link href="/gallery" className="inline-flex items-center gap-2 font-heading font-bold text-sm tracking-[0.15em] uppercase text-white hover:text-wff-gold transition-colors pb-1 border-b-2 border-transparent hover:border-wff-gold group">
            Explore Full Gallery <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Container>

      <div className="flex flex-col gap-4 relative w-full overflow-hidden max-w-[100vw]">
        {/* ROW 1: Left to Right */}
        <div className="w-full flex group/marquee relative overflow-hidden flex-nowrap [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-[scroll-left_60s_linear_infinite] group-hover/marquee:[animation-play-state:paused] shrink-0">
            {/* Track 1 */}
            <div className="flex shrink-0 gap-4 px-2">
              {row1Images.map((img, idx) => (
                <div key={`r1-1-${idx}`} className="relative h-[140px] w-[210px] sm:h-[180px] sm:w-[270px] md:h-[220px] md:w-[330px] lg:h-[260px] lg:w-[390px] overflow-hidden shrink-0 group rounded-sm bg-wff-navy">
                  <Image 
                    src={resolveImageUrl(img.file_url) || '/assets/wff_hero_banner.png'} 
                    alt={img.title || 'Gallery Image'} 
                    unoptimized={img.file_url?.startsWith('/uploads')} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    sizes="(max-width: 640px) 210px, (max-width: 768px) 270px, (max-width: 1024px) 330px, 390px" 
                    loading="lazy" 
                  />
                </div>
              ))}
            </div>
            {/* Track 2 (Duplicate) */}
            <div className="flex shrink-0 gap-4 px-2">
              {row1Images.map((img, idx) => (
                <div key={`r1-2-${idx}`} className="relative h-[140px] w-[210px] sm:h-[180px] sm:w-[270px] md:h-[220px] md:w-[330px] lg:h-[260px] lg:w-[390px] overflow-hidden shrink-0 group rounded-sm bg-wff-navy">
                  <Image 
                    src={resolveImageUrl(img.file_url) || '/assets/wff_hero_banner.png'} 
                    alt={img.title || 'Gallery Image'} 
                    unoptimized={img.file_url?.startsWith('/uploads')} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    sizes="(max-width: 640px) 210px, (max-width: 768px) 270px, (max-width: 1024px) 330px, 390px" 
                    loading="lazy" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2: Right to Left */}
        {row2Images.length > 0 && (
          <div className="w-full flex group/marquee relative overflow-hidden flex-nowrap [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex w-max animate-[scroll-right_60s_linear_infinite] group-hover/marquee:[animation-play-state:paused] shrink-0">
              {/* Track 1 */}
              <div className="flex shrink-0 gap-4 px-2">
                {row2Images.map((img, idx) => (
                  <div key={`r2-1-${idx}`} className="relative h-[140px] w-[210px] sm:h-[180px] sm:w-[270px] md:h-[220px] md:w-[330px] lg:h-[260px] lg:w-[390px] overflow-hidden shrink-0 group rounded-sm bg-wff-navy">
                    <Image 
                      src={resolveImageUrl(img.file_url) || '/assets/wff_hero_banner.png'} 
                      alt={img.title || 'Gallery Image'} 
                      unoptimized={img.file_url?.startsWith('/uploads')} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      sizes="(max-width: 640px) 210px, (max-width: 768px) 270px, (max-width: 1024px) 330px, 390px" 
                      loading="lazy" 
                    />
                  </div>
                ))}
              </div>
              {/* Track 2 (Duplicate) */}
              <div className="flex shrink-0 gap-4 px-2">
                {row2Images.map((img, idx) => (
                  <div key={`r2-2-${idx}`} className="relative h-[140px] w-[210px] sm:h-[180px] sm:w-[270px] md:h-[220px] md:w-[330px] lg:h-[260px] lg:w-[390px] overflow-hidden shrink-0 group rounded-sm bg-wff-navy">
                    <Image 
                      src={resolveImageUrl(img.file_url) || '/assets/wff_hero_banner.png'} 
                      alt={img.title || 'Gallery Image'} 
                      unoptimized={img.file_url?.startsWith('/uploads')} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      sizes="(max-width: 640px) 210px, (max-width: 768px) 270px, (max-width: 1024px) 330px, 390px" 
                      loading="lazy" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[scroll-left_60s_linear_infinite\\],
          .animate-\\[scroll-right_60s_linear_infinite\\] {
            animation: none !important;
            transform: translateX(0) !important;
          }
          .\\[mask-image\\:linear-gradient\\(to_right\\,transparent\\,black_10\\%\\,black_90\\%\\,transparent\\)\\] {
            mask-image: none !important;
          }
        }
      `}} />
    </section>
  );
}
