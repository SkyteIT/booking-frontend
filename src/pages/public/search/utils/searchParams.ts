// URL param helpers:
// converts raw URLSearchParams into typed filter values for the app.
import type { ListingCategory, SearchFilters } from "./types";

export const CATEGORIES: ListingCategory[] = [
  "Hotels",
  "Restaurants",
  "Events",
  "Activities",
  "Car Rentals",
  "Apartments",
  "Equipment",
];

// Converts URL text value to number; returns undefined for empty/invalid values.
const parseNumber = (value: string | null): number | undefined => {
  if (value === null || value === "") {
    return undefined;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return undefined;
  }

  return numberValue;
};

// Reads URL params and returns a typed filter object used by the hook.
export const parseSearchFilters = (
  searchParams: URLSearchParams,
): SearchFilters => {
  const categoryFromUrl = (searchParams.get("category") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const categories = categoryFromUrl.filter((category): category is ListingCategory =>
    CATEGORIES.includes(category as ListingCategory),
  );

  return {
    q: searchParams.get("q") || "",
    date: searchParams.get("date") || "",
    categories,
    minPrice: parseNumber(searchParams.get("minPrice")),
    maxPrice: parseNumber(searchParams.get("maxPrice")),
    minRating: parseNumber(searchParams.get("minRating")),
  };
};
