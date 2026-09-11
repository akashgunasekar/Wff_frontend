"use client";

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { ImageIcon, Calendar, ArrowLeft, X } from 'lucide-react';
import { GalleryAlbum, GalleryImage } from '@/types';

export default function GalleryClient({ albums }: { albums: GalleryAlbum[] }) {
  const [activeAlbum, setActiveAlbum] = useState<any | null>(null);
  const [lightboxImage, setLightboxImage] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const openAlbum = async (album: GalleryAlbum) => {
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/gallery/show.php?id=${album.id}`);
      const json = await res.json();
      if (json.success) {
        setActiveAlbum(json.data);
      } else {
        alert("Failed to load album images.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (albums.length === 0) {
    return (
      <div className="py-24 min-h-[50vh] flex flex-col items-center justify-center text-center">
        <Container>
          <ImageIcon size={64} className="mx-auto text-wff-muted opacity-30 mb-6" />
          <h2 className="font-heading text-4xl text-wff-text-primary uppercase tracking-widest mb-4">
            CHAMPIONSHIP ARCHIVE
          </h2>
          <p className="text-wff-muted text-lg max-w-xl mx-auto">
            Official championship photography will appear here.
          </p>
        </Container>
      </div>
    );
  }

  if (activeAlbum) {
    return (
      <div className="py-16 min-h-[50vh]">
        <Container>
          <button
            onClick={() => setActiveAlbum(null)}
            className="flex items-center gap-2 text-wff-gold font-bold uppercase tracking-widest mb-10 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} /> Back to Albums
          </button>

          <div className="mb-12">
            <h2 className="font-heading text-4xl md:text-5xl text-white uppercase tracking-wider mb-4">{activeAlbum.title}</h2>
            <div className="flex items-center gap-2 text-wff-muted font-medium">
              <Calendar size={18} className="text-wff-gold" />
              {activeAlbum.date}
            </div>
          </div>

          {/* Masonry/Grid for Images */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {activeAlbum.images && activeAlbum.images.map((image: any) => (
              <div
                key={image.id}
                className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group relative border border-wff-border dark:border-white/5"
                onClick={() => setLightboxImage(image)}
              >
                <div className="absolute inset-0 bg-wff-deep-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col items-center justify-center p-4 text-center backdrop-blur-sm">
                  <span className="text-white font-heading text-xl uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {image.caption || "View Image"}
                  </span>
                </div>
                <img
                  src={image.image || '/assets/wff_hero_banner.png'}
                  alt={image.caption || "Gallery Image"}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>

          {(!activeAlbum.images || activeAlbum.images.length === 0) && (
            <div className="text-center py-20 text-wff-muted">
              <p>This album has no images yet.</p>
            </div>
          )}
        </Container>

        {/* Lightbox Overlay */}
        {lightboxImage && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-wff-gold text-white transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src={lightboxImage.image || '/assets/wff_hero_banner.png'}
              alt={lightboxImage.caption || "Gallery"}
              className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl border border-white/10"
            />
            {lightboxImage.caption && <h3 className="text-wff-gold font-heading text-2xl uppercase tracking-widest mt-6">{lightboxImage.caption}</h3>}
          </div>
        )}
      </div>
    );
  }

  // ALbums View
  return (
    <div className="py-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => openAlbum(album)}
              className="bg-wff-surface border border-wff-border dark:border-wff-gold/10 rounded-2xl overflow-hidden group cursor-pointer hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-2 relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"></div>

              <div className="h-64 relative overflow-hidden">
                {album.cover_image ? (
                  <img
                    src={album.cover_image || '/assets/wff_hero_banner.png'}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full bg-black/20 flex items-center justify-center text-wff-muted">
                    <ImageIcon size={48} className="opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030810] via-black/20 to-transparent"></div>

                {loading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40 backdrop-blur-sm">
                    <div className="w-8 h-8 border-2 border-wff-gold border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-wff-surface">
                <h3 className="font-heading text-2xl text-wff-text-primary uppercase tracking-wide mb-2 group-hover:text-gold-gradient transition-colors">{album.title}</h3>
                <div className="flex items-center gap-2 text-wff-muted font-medium text-sm">
                  <Calendar size={16} className="text-wff-gold" />
                  {album.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
