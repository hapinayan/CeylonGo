// =============================================================================
// CeylonGo — Tourism Domain Models
// =============================================================================

export interface DestinationItem {
  id: string;
  name: string;
  province: string;
  imageUrl: string;
  description?: string;
}

export interface HomestayItem {
  id: string;
  name: string;
  location: string;
  district: string;
  rating: number;
  reviewCount: number;
  priceLkr: number;
  imageUrl: string;
  isFavorite?: boolean;
}

export interface ExperienceItem {
  id: string;
  title: string;
  location: string;
  priceLkr: number;
  imageUrl: string;
  duration?: string;
}

export interface CategoryItem {
  id: string;
  label: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

export interface TourismServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export interface SearchCriteria {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}
