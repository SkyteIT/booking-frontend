// Public prop contract for the FiltersSidebar parent component.
import type { ListingCategory } from "../../utils/types";

export interface FiltersSidebarProps {
  categories: ListingCategory[];
  selectedCategories: ListingCategory[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  ratingOptions: readonly number[];
  onClearAll: () => void;
  onClearCategories: () => void;
  onToggleCategory: (category: ListingCategory) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onMinRatingChange: (value?: number) => void;
}
