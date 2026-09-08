import { ChampionshipHighlight, HeroSlide } from '../types';

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "WFF RUDRA CLASSIC MR. TAMIL NADU 2026",
    subtitle: "Open Bodybuilding & Fitness Championship",
    image: "/assets/wff_hero_banner.png",
    date: "15 Oct 2026",
    location: "Nehru Indoor Stadium, Chennai",
    price: "1,500",
    description: "The ultimate natural bodybuilding championship in Tamil Nadu featuring multiple divisions."
  },
  {
    id: 2,
    title: "WFF NATURAL LEAGUE TAMIL NADU 2026",
    subtitle: "Strictly Drug-Tested Natural Championship",
    image: "/assets/wff_hero_banner_2.png",
    date: "10 Dec 2026",
    location: "Kalaivanar Arangam, Chennai",
    price: "2,000",
    description: "The most prestigious natural bodybuilding championship in the state."
  }
];

export const highlights: ChampionshipHighlight[] = [
  {
    id: 1,
    title: "Professional Platform",
    description: "Compete on a national standard stage with premium lighting, LED backdrops, and professional media coverage.",
    icon: "Trophy"
  },
  {
    id: 2,
    title: "Fair Judging Panel",
    description: "Evaluated by WFF India certified officials ensuring 100% transparency and standard scoring.",
    icon: "ShieldCheck"
  },
  {
    id: 3,
    title: "National Qualifications",
    description: "Gold medalists secure direct entry to WFF National and International championships.",
    icon: "Award"
  },
  {
    id: 4,
    title: "Premium Athlete Care",
    description: "Dedicated backstage facilities, official spray tanning, and professional event coordination.",
    icon: "User"
  }
];
