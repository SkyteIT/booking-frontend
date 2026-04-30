// URL param helpers:
// converts raw URLSearchParams into typed filter values for the app.
import type { SearchFilters } from "./types";

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
// Categories are no longer validated against a hardcoded list — they come
// from the database, so any non-empty string is a valid category name.
export const parseSearchFilters = (
  searchParams: URLSearchParams,
): SearchFilters => {
  const categories = (searchParams.get("category") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean); // accept all non-empty category names from the DB

  return {
    q: searchParams.get("q") || "",
    date: searchParams.get("date") || "",
    categories,
    minPrice: parseNumber(searchParams.get("minPrice")),
    maxPrice: parseNumber(searchParams.get("maxPrice")),
    minRating: parseNumber(searchParams.get("minRating")),
  };
};
