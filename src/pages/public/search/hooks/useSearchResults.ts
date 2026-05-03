import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { searchListings, type SearchListing } from "../../../../services/searchService";
import { fetchCategories } from "../../../../services/categoryService";
import { parseSearchFilters } from "../utils/searchParams";

interface ApiCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export const useSearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<SearchListing[]>([]);
  const [allCategories, setAllCategories] = useState<ApiCategory[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo(() => parseSearchFilters(searchParams), [searchParams]);

  // Load categories from the API once on mount.
  // Even if this fails we mark categoriesLoaded=true so the search can still
  // run — the user just won't see category filter chips, which is acceptable.
  useEffect(() => {
    fetchCategories()
      .then((data) => setAllCategories(Array.isArray(data) ? data : []))
      .catch(() => setAllCategories([]))
      .finally(() => setCategoriesLoaded(true)); // always unblock the search
  }, []);

  // Only show ACTIVE categories in the filter sidebar
  const categories = useMemo(
    () => allCategories.filter((c) => c.isActive),
    [allCategories]
  );

  // Run search whenever filters or categories are ready.
  useEffect(() => {
    if (!categoriesLoaded) return;

    setLoading(true);
    setError(null);

    // Resolve selected category names → IDs for the API call.
    // Only resolve against active categories so Inactive ones never reach the API.
    const selectedCategoryIds = filters.categories
      .map((name) =>
        categories.find((c) => c.name.toLowerCase() === name.toLowerCase())?.id
      )
      .filter((id): id is string => Boolean(id));

    searchListings({
      searchTerm: filters.q || undefined,
      categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
    })
      .then((data) => setListings(Array.isArray(data) ? data : []))
      .catch(() => {
        setListings([]);
        setError("Failed to load results. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [filters, categories, categoriesLoaded]);

  // Commits the search query to the URL (triggers API via the useEffect above).
  // Call this only on explicit user action (button click / Enter), NOT on every keystroke.
  const setQuery = useCallback((value: string) => {
    const next = new URLSearchParams(searchParams);
    value.trim() ? next.set("q", value.trim()) : next.delete("q");
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  // Price filters: also committed only on explicit action (blur or Enter)
  // so we don't fire an API call on every digit the user types.
  const setMinPrice = useCallback((value: string) => {
    const next = new URLSearchParams(searchParams);
    const n = value.replace(/[^0-9]/g, "");
    n ? next.set("minPrice", n) : next.delete("minPrice");
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const setMaxPrice = useCallback((value: string) => {
    const next = new URLSearchParams(searchParams);
    const n = value.replace(/[^0-9]/g, "");
    n ? next.set("maxPrice", n) : next.delete("maxPrice");
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

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

  const clearCategories = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const setMinRating = useCallback((rating?: number) => {
    const next = new URLSearchParams(searchParams);
    rating !== undefined
      ? next.set("minRating", String(rating))
      : next.delete("minRating");
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    ["category", "minPrice", "maxPrice", "minRating"].forEach((k) => next.delete(k));
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

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