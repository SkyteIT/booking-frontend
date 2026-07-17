// Pure filtering utility:
// returns only listings that satisfy query/category/price/rating filters.
import type { Listing, SearchFilters } from "./types";

export const filterListings = (
  listings: Listing[],
  filters: SearchFilters,
): Listing[] => {
  // Normalize query once so each listing check is case-insensitive.
  const query = filters.q.trim().toLowerCase();

  // Keep only listings that pass every active filter condition.
  return listings.filter((listing) => {
    const matchesQuery =
      !query ||
      listing.title.toLowerCase().includes(query) ||
      listing.category.toLowerCase().includes(query) ||
      listing.location.toLowerCase().includes(query);
    if (!matchesQuery) return false;

    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(listing.category);
    if (!matchesCategory) return false;

    const matchesMinPrice =
      filters.minPrice === undefined || listing.price >= filters.minPrice;
    if (!matchesMinPrice) return false;

    const matchesMaxPrice =
      filters.maxPrice === undefined || listing.price <= filters.maxPrice;
    if (!matchesMaxPrice) return false;

    const matchesMinRating =
      filters.minRating === undefined || listing.rating >= filters.minRating;
    if (!matchesMinRating) return false;

  

    return true;
  });
};
