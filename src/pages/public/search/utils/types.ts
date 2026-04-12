// Feature-level types shared across search hook, utils, data, and components.
export type ListingCategory =
  | "Hotels"
  | "Restaurants"
  | "Events"
  | "Activities"
  | "Car Rentals"
  | "Apartments"
  | "Equipment";

export interface Listing {
  id: number;
  title: string;
  category: ListingCategory;
  location: string;
  price: number;
  priceUnit: "night" | "person" | "ticket" | "day" | "hour";
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
