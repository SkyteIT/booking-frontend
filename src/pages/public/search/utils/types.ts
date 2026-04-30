// types.ts
// No longer a fixed union — categories come from the database.

export interface ApiCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export interface Listing {
  id: number;
  title: string;
  category: string;       // ← was ListingCategory (hardcoded union), now plain string
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
  categories: string[];   // ← was ListingCategory[], now string[]
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}