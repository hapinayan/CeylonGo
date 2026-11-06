// =============================================================================
// CeylonGo — Home Feature Mock Data
// Discover Local. Feel at Home.
// Authentic Northern & Eastern Sri Lanka Focus
// =============================================================================

import {
  CategoryItem,
  DestinationItem,
  ExperienceItem,
  HomestayItem,
  MetricItem,
  QuickBenefitItem,
  TestimonialItem,
  TourismServiceItem,
} from '../../../shared/models/tourism.models';

// --- Section 4: Four Quick Benefit Highlights ---
export const QUICK_BENEFITS_DATA: QuickBenefitItem[] = [
  {
    id: 'homestays',
    title: 'Unique Homestays',
    description: 'Stay with local families.',
    icon: 'home',
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
  },
  {
    id: 'experiences',
    title: 'Local Experiences',
    description: 'Authentic cultural activities.',
    icon: 'leaf',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
  },
  {
    id: 'destinations',
    title: 'Top Destinations',
    description: "Explore Sri Lanka's best.",
    icon: 'map',
    iconBg: '#e0f2fe',
    iconColor: '#0284c7',
  },
  {
    id: 'community',
    title: 'Trusted Community',
    description: 'Real people, real stories.',
    icon: 'community',
    iconBg: '#f3e8ff',
    iconColor: '#9333ea',
  },
];

// --- Section 5: Popular Destinations (6 Authentic Sri Lankan Locations) ---
export const DESTINATIONS_DATA: DestinationItem[] = [
  {
    id: 'jaffna',
    name: 'Jaffna',
    category: 'Culture, Heritage',
    province: 'Northern Province',
    imageUrl: 'assets/images/destinations/dest_jaffna.jpg',
    description: 'Vibrant cultural heritage, historic churches and golden kovils.',
  },
  {
    id: 'trincomalee',
    name: 'Trincomalee',
    category: 'Beaches, Marine Life',
    province: 'Eastern Province',
    imageUrl: 'assets/images/destinations/dest_trincomalee.jpg',
    description: 'Pristine coastal coves, marine sanctuary, and scenic cliffs.',
  },
  {
    id: 'batticaloa',
    name: 'Batticaloa',
    category: 'Lagoons, Culture',
    province: 'Eastern Province',
    imageUrl: 'assets/images/destinations/dest_batticaloa.jpg',
    description: 'Tranquil coastal lagoons, singing fish, and sunset boat rides.',
  },
  {
    id: 'mannar',
    name: 'Mannar',
    category: 'Nature, Wildlife',
    province: 'Northern Province',
    imageUrl: 'assets/images/destinations/dest_mannar.jpg',
    description: 'Baobab trees, historic pier, and flocks of migrating pink flamingos.',
  },
  {
    id: 'nilaveli',
    name: 'Nilaveli',
    category: 'Beaches, Snorkeling',
    province: 'Eastern Province',
    imageUrl: 'assets/images/destinations/dest_nilaveli.jpg',
    description: 'Powder white sand beaches and Pigeon Island coral reef snorkeling.',
  },
  {
    id: 'arugam-bay',
    name: 'Arugam Bay',
    category: 'Surfing, Beaches',
    province: 'Eastern Province',
    imageUrl: 'assets/images/destinations/dest_arugam_bay.jpg',
    description: 'World-renowned point breaks, relaxed surf culture, and lagoons.',
  },
];

// --- Section 6: Featured Homestays (4 Mock Homestays) ---
export const HOMESTAYS_DATA: HomestayItem[] = [
  {
    id: 'jaffna-family',
    name: 'Jaffna Family Homestay',
    location: 'Jaffna',
    district: 'Jaffna',
    rating: 4.8,
    reviewCount: 72,
    priceLkr: 8000,
    imageUrl: 'assets/images/homestays/homestay_jaffna.jpg',
    isFavorite: false,
  },
  {
    id: 'trincomalee-beach',
    name: 'Trincomalee Beach House',
    location: 'Trincomalee',
    district: 'Trincomalee',
    rating: 4.6,
    reviewCount: 28,
    priceLkr: 10000,
    imageUrl: 'assets/images/homestays/homestay_trincomalee.jpg',
    isFavorite: false,
  },
  {
    id: 'batticaloa-lagoon',
    name: 'Batticaloa Lagoon Stay',
    location: 'Batticaloa',
    district: 'Batticaloa',
    rating: 4.9,
    reviewCount: 41,
    priceLkr: 7500,
    imageUrl: 'assets/images/homestays/homestay_batticaloa.jpg',
    isFavorite: false,
  },
  {
    id: 'mannar-nature',
    name: 'Mannar Nature Homestay',
    location: 'Mannar',
    district: 'Mannar',
    rating: 4.7,
    reviewCount: 19,
    priceLkr: 6500,
    imageUrl: 'assets/images/homestays/homestay_mannar.jpg',
    isFavorite: false,
  },
];

// --- Section 7: Local Experiences (4 Authentic Northern/Eastern Livelihoods) ---
export const EXPERIENCES_DATA: ExperienceItem[] = [
  {
    id: 'sea-farming',
    title: 'Sea Farming Experience',
    location: 'Jaffna',
    rating: 4.8,
    reviewCount: 26,
    priceLkr: 4500,
    imageUrl: 'assets/images/experiences/exp_sea_farming.jpg',
    duration: '3 Hours',
  },
  {
    id: 'palmyrah-crafts',
    title: 'Traditional Palmyrah Handicrafts',
    location: 'Jaffna',
    rating: 4.7,
    reviewCount: 18,
    priceLkr: 3500,
    imageUrl: 'assets/images/experiences/exp_palmyrah_crafts.jpg',
    duration: '2.5 Hours',
  },
  {
    id: 'community-fishing',
    title: 'Fishing with Local Communities',
    location: 'Trincomalee',
    rating: 4.6,
    reviewCount: 13,
    priceLkr: 5000,
    imageUrl: 'assets/images/experiences/exp_fishing_locals.jpg',
    duration: '4 Hours',
  },
  {
    id: 'salt-harvesting',
    title: 'Salt Harvesting Experience',
    location: 'Mannar',
    rating: 4.5,
    reviewCount: 21,
    priceLkr: 3000,
    imageUrl: 'assets/images/experiences/exp_salt_harvesting.jpg',
    duration: '2 Hours',
  },
];

// --- Section 9: Why Choose CeylonGo Metrics ---
export const WHY_CHOOSE_METRICS_DATA: MetricItem[] = [
  {
    id: 'districts',
    value: '25+',
    label: 'Districts Covered',
    subtext: 'All administrative districts',
    icon: 'home',
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
  },
  {
    id: 'homestays',
    value: '500+',
    label: 'Verified Homestays',
    subtext: 'Demo platform preview',
    icon: 'bed',
    iconBg: '#ffedd5',
    iconColor: '#c2410c',
  },
  {
    id: 'experiences',
    value: '200+',
    label: 'Local Experiences',
    subtext: 'Community activities',
    icon: 'pin',
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
  },
  {
    id: 'travelers',
    value: '10K+',
    label: 'Happy Travelers',
    subtext: 'Community reach',
    icon: 'users',
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
  },
];

// --- Section 10: Community Testimonials ---
export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'sarah',
    name: 'Sarah M.',
    country: 'Australia',
    avatarUrl: 'assets/images/testimonials/sarah.jpg',
    rating: 5,
    quote:
      'Amazing homestay experience in Jaffna! The family was so welcoming and the food was incredible.',
  },
  {
    id: 'james',
    name: 'James T.',
    country: 'UK',
    avatarUrl: 'assets/images/testimonials/james.jpg',
    rating: 5,
    quote:
      'Trincomalee was beautiful! CeylonGo made it so easy to find authentic experiences.',
  },
  {
    id: 'priya',
    name: 'Priya K.',
    country: 'India',
    avatarUrl: 'assets/images/testimonials/priya.jpg',
    rating: 5,
    quote:
      'Best travel platform for exploring real Sri Lanka. Highly recommended!',
  },
];

// --- Legacy support items (preserved for shared component compatibility) ---
export const CATEGORIES_DATA: CategoryItem[] = [
  { id: 'homestays', label: 'Homestays', icon: 'home', bgColor: '#ffedd5', iconColor: '#ea580c' },
  { id: 'destinations', label: 'Destinations', icon: 'palm', bgColor: '#dcfce7', iconColor: '#16a34a' },
  { id: 'experiences', label: 'Experiences', icon: 'map', bgColor: '#e0e7ff', iconColor: '#4f46e5' },
  { id: 'eco-tourism', label: 'Eco-Tourism', icon: 'leaf', bgColor: '#d1fae5', iconColor: '#059669' },
];

export const TOURISM_SERVICES_DATA: TourismServiceItem[] = [
  {
    id: 'tour-guides',
    title: 'Local Tour Guides',
    description: 'Explore with expert local guides',
    icon: 'guide',
    iconBg: '#fff7ed',
    iconColor: '#ea580c',
  },
  {
    id: 'airport-pickup',
    title: 'Airport Pickup',
    description: 'Hassle-free transfers',
    icon: 'car',
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
  },
  {
    id: 'bike-rental',
    title: 'Bike & Bicycle Rental',
    description: 'Explore at your own pace',
    icon: 'bike',
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
  },
  {
    id: 'travel-insurance',
    title: 'Travel Insurance',
    description: 'Travel with peace of mind',
    icon: 'shield',
    iconBg: '#fef2f2',
    iconColor: '#dc2626',
  },
];
