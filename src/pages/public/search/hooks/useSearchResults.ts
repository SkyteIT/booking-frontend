import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { searchListings, type SearchListing } from "../../../../services/searchService";
import { fetchCategories, type ApiCategory } from "../../../../services/categoryService";
import { parseSearchFilters } from "../utils/searchParams";

export const useSearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<SearchListing[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo(() => parseSearchFilters(searchParams), [searchParams]);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoaded(true));
  }, []);

  useEffect(() => {
    if (!categoriesLoaded) return;

    setLoading(true);
    setError(null);

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

  const setQuery = useCallback((value: string) => {
    const next = new URLSearchParams(searchParams);
    value.trim() ? next.set("q", value.trim()) : next.delete("q");
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

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
    const isSelected = current.includes(categoryName as any);
    const updated = isSelected
      ? current.filter((c) => c !== categoryName)
      : [...current, categoryName as any];

    updated.length ? next.set("category", updated.join(",")) : next.delete("category");
    setSearchParams(next);
  }, [searchParams, setSearchParams, filters.categories]);

  const clearCategories = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const setMinRating = useCallback((rating?: number) => {
    const next = new URLSearchParams(searchParams);
    rating !== undefined ? next.set("minRating", String(rating)) : next.delete("minRating");
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
