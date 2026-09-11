// API Abstraction Layer
// This now connects to the real PHP + MySQL backend.

import { Event, Official, Winner, Award, ChampionshipHighlight, GalleryImage, GalleryAlbum, HeroSlide } from '../types';
import { aboutData } from '../data/about';

export const API_BASE =
  typeof window === 'undefined'
    ? (process.env.INTERNAL_API_URL || 'https://api.wfftamilnadu.in/api')
    : (process.env.NEXT_PUBLIC_API_BASE_URL || '/api');

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.wfftamilnadu.in';

/**
 * Centralized Image URL Strategy
 */
export function resolveImageUrl(path: string | undefined | null): string | null {
  if (!path || path.trim() === '') return null;
  const normalized = path.replace(/\\/g, '/').trim();
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) return normalized;
  if (normalized.startsWith('/assets/') || normalized.startsWith('assets/')) {
    return normalized.startsWith('/') ? normalized : `/${normalized}`;
  }
  const cleanPath = normalized.replace(/^\//, '');
  return BACKEND_URL ? `${BACKEND_URL}/${cleanPath}` : `/${cleanPath}`;
}

/**
 * Helper to fetch and normalize JSON from the PHP backend.
 */
async function apiFetch<T>(endpoint: string, fallback: T): Promise<T> {
  if (!API_BASE) return fallback;
  try {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Use ISR with a 60-second revalidation to allow CMS updates without breaking static builds
    const res = await fetch(`${API_BASE}${cleanEndpoint}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.warn(`API responded with status ${res.status} for ${endpoint}`);
      return fallback;
    }
    const json = await res.json();
    if (json.success && json.data !== undefined) {
      return json.data as T;
    }
    return fallback;
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error);
    return fallback;
  }
}

export async function fetchEvents(): Promise<Event[]> {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/events/index.php`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    if (json.success && json.data) {
      return json.data.map((e: any) => ({ ...e, banner_image: resolveImageUrl(e.banner_image) }));
    }
    return [];
  } catch (error) {
    console.error('fetchEvents Error:', error);
    return [];
  }
}

export async function fetchEventBySlug(slug: string): Promise<Event | null> {
  if (!API_BASE || !slug) return null;
  try {
    const res = await fetch(`${API_BASE}/events/show.php?slug=${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      json.data.banner_image = resolveImageUrl(json.data.banner_image);
      if (Array.isArray(json.data.officials)) {
        json.data.officials = json.data.officials.map((off: any) => ({
          ...off,
          photo: resolveImageUrl(off.photo),
        }));
      }
      if (Array.isArray(json.data.gallery)) {
        json.data.gallery = json.data.gallery.map((img: any) => ({
          ...img,
          image: resolveImageUrl(img.image),
        }));
      }
      return json.data as Event;
    }
    return null;
  } catch (error) {
    console.error('fetchEventBySlug Error:', error);
    return null;
  }
}

export async function fetchOfficials(): Promise<Official[]> {
  const officials = await apiFetch<Official[]>('/officials/index.php', []);
  return officials.map(o => ({ ...o, photo: resolveImageUrl(o.photo) }));
}

export async function fetchWinners(): Promise<Winner[]> {
  const winners = await apiFetch<Winner[]>('/champions/index.php', []);
  return winners.map(w => ({ ...w, photo: resolveImageUrl(w.photo) }));
}

export async function fetchGallery(): Promise<GalleryImage[]> {
  const images = await apiFetch<any[]>('/gallery/homepage.php', []);
  return images.map(img => ({
    id: img.id || Math.random().toString(),
    file_url: resolveImageUrl(img.image),
    title: 'Championship Gallery',
    type: 'photo'
  }));
}

export async function fetchGalleryAlbums(): Promise<GalleryAlbum[]> {
  const albums = await apiFetch<GalleryAlbum[]>('/gallery/index.php', []);
  return albums.map(a => ({ ...a, cover_image: resolveImageUrl(a.cover_image) }));
}

export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  const slides = await apiFetch<HeroSlide[]>('/homepage/hero.php', []);
  return slides.map(s => ({ ...s, image: resolveImageUrl(s.image) }));
}

export async function getActiveAnnouncements(): Promise<any> {
  return apiFetch<any>('/announcements/active.php', null);
}

export async function getSiteSettings(): Promise<any> {
  return apiFetch<any>('/settings/index.php', {});
}

export async function getHomepageSections(): Promise<any> {
  return apiFetch<any>('/homepage/sections.php', {});
}

export async function fetchJournalArticles(): Promise<any[]> {
  // We do not have a journal table, return empty to trigger the empty state safely.
  return [];
}

export async function fetchAwards(): Promise<Award[]> {
  const sections = await getHomepageSections();
  if (sections && sections['wff_standard'] && sections['wff_standard'].content) {
    try {
      return JSON.parse(sections['wff_standard'].content) as Award[];
    } catch (e) {
      return [];
    }
  }
  return [];
}

export async function fetchHighlights(): Promise<ChampionshipHighlight[]> {
  const sections = await getHomepageSections();
  if (sections && sections['why_compete'] && sections['why_compete'].content) {
    try {
      return JSON.parse(sections['why_compete'].content) as ChampionshipHighlight[];
    } catch (e) {
      return [];
    }
  }
  return [];
}

export async function fetchAboutData() {
  return aboutData;
}
