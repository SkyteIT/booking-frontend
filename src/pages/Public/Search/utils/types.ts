// Feature-level types shared across search hook, utils, data, and components.
export type ListingCategory = string;

export interface Listing {
  id: string;
  title: string;
  category: ListingCategory | string;
  location: string;
  price: number;
  priceUnit?: string;
  rating: number;
  reviews: number;
  image: string;
  isAvailable: boolean;
}

export interface SearchFilters {
  q: string;
  date: string;
  categories: ListingCategory[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}
