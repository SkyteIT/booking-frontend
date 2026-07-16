import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { searchListings, type SearchListing } from "../../../../services/searchService";
import { fetchCategories } from "../../../../services/categoryService";
import { parseSearchFilters } from "../utils/searchParams";

// Category type from API
interface ApiCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export const useSearchResults = () => {
  // URL search params (q, category, price, etc.)
  const [searchParams, setSearchParams] = useSearchParams();

  // State for listings (search results)
  const [listings, setListings] = useState<SearchListing[]>([]);

  // All categories from API
  const [allCategories, setAllCategories] = useState<ApiCategory[]>([]);

  // Track if categories finished loading
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert URL params → filter object
  const filters = useMemo(() => parseSearchFilters(searchParams), [searchParams]);

  // Load categories once when component mounts
  useEffect(() => {
    fetchCategories()
      .then((data) => setAllCategories(Array.isArray(data) ? data : []))
      .catch(() => setAllCategories([])) // fallback if error
      .finally(() => setCategoriesLoaded(true)); // allow search to run
  }, []);

  // Only keep active categories
  const categories = useMemo(
    () => allCategories.filter((c) => c.isActive),
    [allCategories]
  );

  // Build a Set of active category names for fast O(1) lookup.
  // Used to filter out listings whose category has been deleted from the DB —
  // the backend search endpoint may still return them because it uses listing
  // data independently of category status.
  const activeCategoryNames = useMemo(
    () => new Set(categories.map((c) => c.name.toLowerCase())),
    [categories]
  );

  // Run search when filters or categories change
  useEffect(() => {
    if (!categoriesLoaded) return; // wait until categories loaded

    setLoading(true);
    setError(null);

    // Convert category names → category IDs for API
    const selectedCategoryIds = filters.categories
      .map((name) =>
        categories.find((c) => c.name.toLowerCase() === name.toLowerCase())?.id
      )
      .filter((id): id is string => Boolean(id));

    // API call: search listings
    searchListings({
      searchTerm: filters.q || undefined,
      categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
      
    })
      .then((data) => {
        const results = Array.isArray(data) ? data : [];

        // Filter out listings whose category no longer exists in active categories.
        // This handles the case where admin deletes a category but the backend
        // search still returns those listings (e.g. uses mock/seed data).
        // Guard: if activeCategoryNames is empty, skip filtering so we don't
        // hide all results when categories fail to load.
        const filtered =
          activeCategoryNames.size > 0
            ? results.filter((listing) =>
                activeCategoryNames.has(listing.categoryName?.toLowerCase() ?? "")
              )
            : results;

        setListings(filtered);
      })
      .catch(() => {
        setListings([]);
        setError("Failed to load results. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [filters, categories, categoriesLoaded, activeCategoryNames]);

  // Update search query in URL
  const setQuery = useCallback((value: string) => {
    const next = new URLSearchParams(searchParams);
    value.trim() ? next.set("q", value.trim()) : next.delete("q");
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  // Set minimum price filter
  const setMinPrice = useCallback((value: string) => {
    const next = new URLSearchParams(searchParams);
    const n = value.replace(/[^0-9]/g, "");
    n ? next.set("minPrice", n) : next.delete("minPrice");
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  // Set maximum price filter
  const setMaxPrice = useCallback((value: string) => {
    const next = new URLSearchParams(searchParams);
    const n = value.replace(/[^0-9]/g, "");
    n ? next.set("maxPrice", n) : next.delete("maxPrice");
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  // Add/remove category filter
  const toggleCategory = useCallback((categoryName: string) => {
    const next = new URLSearchParams(searchParams);
    const current = filters.categories;
    const isSelected = current.includes(categoryName);

    const updated = isSelected
      ? current.filter((c) => c !== categoryName)
      : [...current, categoryName];

    updated.length > 0
      ? next.set("category", updated.join(","))
      : next.delete("category");

    setSearchParams(next);
  }, [searchParams, setSearchParams, filters.categories]);

  // Clear all category filters
  const clearCategories = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  // Set minimum rating filter
  const setMinRating = useCallback((rating?: number) => {
    const next = new URLSearchParams(searchParams);
    rating !== undefined
      ? next.set("minRating", String(rating))
      : next.delete("minRating");
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    ["q", "category", "minPrice", "maxPrice", "minRating", "maxRating"].forEach((k) => next.delete(k));
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  // Return values and functions
  return {
    filters,
    listings,
    loading,
    error,
    categories,
    ratingOptions: [3, 4, 4.5] as const,
    setQuery,
    setMinPrice,
    setMaxPrice,
    clearCategories,
    toggleCategory,
    setMinRating,
    clearFilters,
  };
};