// types.ts — FiltersSidebar prop contract

export interface FiltersSidebarProps {
  categories: { id: string; name: string }[];   // ← was ListingCategory[] (hardcoded union)
  selectedCategories: string[];                  // ← was ListingCategory[]
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  ratingOptions: readonly number[];
  hasOffer?: boolean;
  onClearAll: () => void;
  onClearCategories: () => void;
  onToggleCategory: (category: string) => void; // ← was (category: ListingCategory)
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onMinRatingChange: (value?: number) => void;
  onToggleHasOffer: () => void;
}