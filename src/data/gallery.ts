import { GalleryImage } from '../types';

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    file_url: "/assets/wff_hero_banner.png",
    title: "Men's Physique Lineup",
    type: "photo"
  },
  {
    id: 2,
    file_url: "/assets/wff_hero_banner_2.png",
    title: "Classic Bodybuilding Routine",
    type: "photo"
  },
  {
    id: 3,
    file_url: "/assets/wff_hero_banner.png",
    title: "Trophy Presentation",
    type: "photo"
  },
  {
    id: 4,
    file_url: "/assets/wff_hero_banner.png", // reusing dummy
    title: "Overall Championship Stage",
    type: "photo"
  }
];

export const galleryAlbums = [
  {
    id: 1,
    title: "WFF Rudra Classic 2025",
    date: "15 Oct 2025",
    cover_image: "/assets/wff_hero_banner.png",
    images: galleryImages
  },
  {
    id: 2,
    title: "WFF Natural League 2025",
    date: "20 Sep 2025",
    cover_image: "/assets/wff_hero_banner_2.png",
    images: galleryImages
  }
];
