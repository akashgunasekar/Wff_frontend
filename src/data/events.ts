import { Event } from '../types';

export const events: Event[] = [
  {
    id: 1,
    slug: "wff-natural-league-2026",
    event_name: "WFF Natural League Tamil Nadu 2026",
    subtitle: "Strictly Drug-Tested Natural Championship",
    event_date: "2026-09-20",
    event_day: "Sunday",
    registration_time: "8:00 AM TO 10:00 AM",
    show_time: "11:00 AM onwards",
    venue: "Kalaivanar Arangam",
    location: "Chennai",
    banner_image: "/assets/wff_hero_banner_2.png",
    status: "open",
    description: "<p>The WFF Natural League Tamil Nadu 2026 is the premier platform for natural athletes to showcase their hard work on a drug-free stage. Athletes will be subjected to rigorous testing to ensure a 100% natural lineup.</p><br/><p>Winners will receive a direct qualification to the WFF Natural Universe.</p>",
    organizer: "World Fitness Federation India",
    prize_pool: "₹2,00,000 Total Cash Prize",
    registration_deadline: "2026-09-10",
    eligibility: "Open to all natural athletes (drug-free for a minimum of 5 years).",
    registration_fee: "2000",
    categories: [
      { id: 1, name: "Junior Men Physique", age_group: "Under 23", gender: "Male", entry_fee: "₹2,000", eligibility: "Born after 2003", availability: "open", sort_order: 1 },
      { id: 2, name: "Senior Men Physique", age_group: "Open", gender: "Male", entry_fee: "₹2,000", eligibility: "Open", availability: "open", sort_order: 2 },
      { id: 3, name: "Sports Model", age_group: "Open", gender: "Female", entry_fee: "₹2,000", eligibility: "Open", availability: "open", sort_order: 3 }
    ],
    terms_and_conditions: [
      "All athletes must possess a valid WFF India Membership.",
      "Polygraph/Urinalysis testing may be randomly conducted.",
      "No refunds will be provided under any circumstances after registration.",
      "Athletes must report exactly during the registration window."
    ]
  },
  {
    id: 2,
    slug: "wff-rudra-classic-mr-tamil-nadu-2026",
    event_name: "WFF Rudra Classic Mr. Tamil Nadu 2026",
    subtitle: "Open Bodybuilding & Fitness Championship",
    event_date: "2026-10-15",
    event_day: "Thursday",
    registration_time: "8:00 AM TO 10:00 AM",
    show_time: "11:00 AM onwards",
    venue: "Nehru Indoor Stadium",
    location: "Chennai",
    banner_image: "/assets/wff_hero_banner.png",
    status: "upcoming",
    description: "<p>The legendary WFF Rudra Classic returns in 2026. Step onto the stage of champions in the most prestigious open natural bodybuilding championship in Tamil Nadu.</p><br/><p>With top-tier judging panels, massive prize pools, and incredible stage production, this is the ultimate battleground for elite physiques.</p>",
    organizer: "Rudra Fitness & WFF Tamil Nadu",
    prize_pool: "₹5,00,000 Total Cash Prize",
    registration_deadline: "2026-10-05",
    eligibility: "Open to all athletes resident in Tamil Nadu.",
    registration_fee: "1500",
    categories: [
      { id: 4, name: "Classic Bodybuilding", age_group: "Open", gender: "Male", entry_fee: "₹1,500", eligibility: "Height to weight ratio applies", availability: "open", sort_order: 1 },
      { id: 5, name: "Men's Fitness", age_group: "Open", gender: "Male", entry_fee: "₹1,500", eligibility: "Open", availability: "open", sort_order: 2 }
    ],
    terms_and_conditions: [
      "All athletes must possess a valid WFF India Membership.",
      "Music for posing routines must be submitted on a USB drive during registration.",
      "Dream Tan or other messy tanning products are strictly prohibited.",
      "The judges' decision is final and binding."
    ],
    special_guests: [
      { id: 1, name: "VIP Guest", designation: "WFF International President", photo: "/assets/wff-international.png" }
    ]
  }
];
