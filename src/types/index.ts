export interface HeroSlide {
  id: number;
  image: string | null;
  title: string;
  subtitle: string;
  date?: string;
  location?: string;
  price?: string;
  description?: string;
  event_id?: number | null;
  slug?: string;
  date_type?: 'single' | 'multi';
  event_date?: string;
  event_end_date?: string | null;
  event_status?: string;
}

export interface EventCategory {
  id: number;
  name: string;
  age_group?: string;
  gender?: string;
  entry_fee?: string;
  eligibility: string;
  availability: 'open' | 'closed' | 'waitlist';
  sort_order: number;
  structure_type?: 'single' | 'weight' | 'height';
  short_description?: string;
  weight_divisions?: string[];
  height_divisions?: string[];
}

export interface SpecialGuest {
  id: number;
  name: string;
  designation: string;
  photo: string | null;
}

export interface Event {
  id: number;
  slug: string;
  event_name: string;
  subtitle: string;
  date_type?: 'single' | 'multi';
  event_date: string;
  event_end_date?: string | null;
  event_day: string;
  registration_time: string;
  show_time: string;
  venue: string;
  location: string;
  banner_image: string | null;
  status: 'open' | 'upcoming' | 'closed' | 'completed';
  description: string;
  organizer?: string;
  prize_pool?: string;
  registration_deadline?: string;
  eligibility?: string;
  registration_fee?: string;
  categories?: EventCategory[];
  officials?: Official[];
  special_guests?: SpecialGuest[];
  gallery?: GalleryImage[];
  terms_and_conditions?: string[];
  tan_spray_price?: string;
  cash_enabled?: boolean;
  content_meta?: {
    about_title?: string;
    about_content?: string;
    why_title?: string;
    why_intro?: string;
    why_highlights?: Array<{
      icon: string;
      title: string;
      description: string;
      active: boolean;
      sort_order: number;
    }>;
    winner_slides?: Array<{
      photo: string;
      active: boolean;
      sort_order: number;
    }>;
    faqs?: Array<{
      question: string;
      answer: string;
      active: boolean;
      sort_order: number;
    }>;
    terms_content?: string;
    pricing_tiers?: Array<{
      tier?: string;
      name?: string;
      fee?: string;
      total?: string;
      description?: string;
    }>;
    clinical_testing_charge?: string;
  };
}

export interface ChampionshipHighlight {
  id: number;
  title: string;
  description: string;
  icon: string; // We can use the name of the lucide-react icon
}

export interface Award {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Official {
  id: number;
  official_id?: number;
  name: string;
  role: string;
  designation: string;
  photo: string | null;
  bio?: string;
  instagram?: string;
  phone?: string;
  sort_order?: number;
  display_order?: number;
  status?: number;
}

export interface Judge {
  id: number;
  name: string;
  designation: string;
  photo: string | null;
  bio?: string;
  sort_order: number;
}

export interface Winner {
  id: number;
  athlete_name: string;
  title_won: string;
  event_name: string;
  photo: string | null;
  sort_order: number;
}

export interface GalleryImage {
  id: number;
  file_url: string | null;
  title: string;
  type: 'photo' | 'video';
}

export interface GalleryAlbum {
  id: number;
  title: string;
  date?: string;
  cover_image: string | null;
  images: GalleryImage[];
}

export interface AssociationMember {
  id: number;
  name: string;
  role: string;
  photo: string | null;
}
