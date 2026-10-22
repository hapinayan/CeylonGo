// =============================================================================
// CeylonGo — Shared UI & Component Models
// Discover Local. Feel at Home.
// =============================================================================

export interface BreadcrumbItem {
  label: string;
  url?: string;
  icon?: string;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  icon?: string;
  disabled?: boolean;
}

export interface FilterState {
  searchQuery?: string;
  category?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
}

export interface ListingCardData {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  price: number;
  priceUnit?: string; // e.g. 'night', 'person', 'trip'
  rating?: number;
  reviewCount?: number;
  badge?: string;
  badgeVariant?: 'primary' | 'accent' | 'success';
  isFavorite?: boolean;
  linkUrl?: string;
}

export interface DialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger' | 'warning' | 'info';
  confirmColor?: string;
}
