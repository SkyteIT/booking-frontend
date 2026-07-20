// Main feature hook (business logic):
// 1) fetches listings from the backend
// 2) loads active categories from the backend
// 3) reads filters from URL params
// 4) exposes simple handlers that update URL params
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchCategories, type ApiCategory } from "../../../../services/categoryService";
import { searchListings, type SearchListing } from "../../../../services/searchService";
import { parseSearchFilters } from "../utils/searchParams";

export const useSearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<SearchListing[]>([]);
  const [allCategories, setAllCategories] = useState<ApiCategory[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo(() => parseSearchFilters(searchParams), [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        if (cancelled) return;
        setAllCategories(Array.isArray(data) ? data : []);
      } catch {
        if (cancelled) return;
        setAllCategories([]);
      } finally {
        if (!cancelled) setCategoriesLoaded(true);
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => allCategories.filter((category) => category.isActive),
    [allCategories]
  );

  const activeCategoryNames = useMemo(
    () => new Set(categories.map((category) => category.name.toLowerCase())),
    [categories]
  );

  useEffect(() => {
    if (!categoriesLoaded) return;

    let cancelled = false;

    const runSearch = async () => {
      try {
        setLoading(true);
        setError(null);

        const selectedCategoryIds = filters.categories
          .map(
            (name) =>
              categories.find((category) => category.name.toLowerCase() === name.toLowerCase())
                ?.id
          )
          .filter((id): id is string => Boolean(id));

        const data = await searchListings({
          searchTerm: filters.q || undefined,
          categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          minRating: filters.minRating,
        });

        if (cancelled) return;

        const results = Array.isArray(data) ? data : [];
        const filtered =
          activeCategoryNames.size > 0
            ? results.filter((listing) =>
                activeCategoryNames.has(listing.categoryName?.toLowerCase() ?? "")
              )
            : results;

        setListings(filtered);
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching search results:", err);
        setListings([]);
        setError("Failed to load results. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [filters, categories, categoriesLoaded, activeCategoryNames]);

  const setQuery = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams);
      value.trim() ? next.set("q", value.trim()) : next.delete("q");
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const setMinPrice = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams);
      const n = value.replace(/[^0-9]/g, "");
      n ? next.set("minPrice", n) : next.delete("minPrice");
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const setMaxPrice = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams);
      const n = value.replace(/[^0-9]/g, "");
      n ? next.set("maxPrice", n) : next.delete("maxPrice");
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const toggleCategory = useCallback(
    (categoryName: string) => {
      const next = new URLSearchParams(searchParams);
      const current = filters.categories;
      const isSelected = current.includes(categoryName);

      const updated = isSelected
        ? current.filter((category) => category !== categoryName)
        : [...current, categoryName];

      updated.length > 0 ? next.set("category", updated.join(",")) : next.delete("category");

      setSearchParams(next);
    },
    [searchParams, setSearchParams, filters.categories]
  );

  const clearCategories = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const setMinRating = useCallback(
    (rating?: number) => {
      const next = new URLSearchParams(searchParams);
      rating !== undefined ? next.set("minRating", String(rating)) : next.delete("minRating");
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const clearFilters = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    ["q", "category", "minPrice", "maxPrice", "minRating", "maxRating"].forEach((key) =>
      next.delete(key)
    );
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const ratingOptions = [3, 4, 4.5] as const;

  return {
    filters,
    listings,
    filteredListings: listings,
    loading,
    error,
    categories,
    ratingOptions,
    setQuery,
    setMinPrice,
    setMaxPrice,
    clearCategories,
    toggleCategory,
    setMinRating,
    clearFilters,
  };
};
