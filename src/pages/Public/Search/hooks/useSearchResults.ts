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
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
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

  const selectedCategoryIds = useMemo(
    () =>
      filters.categories
        .map(
          (name) =>
            categories.find((category) => category.name.toLowerCase() === name.toLowerCase())
              ?.id
        )
        .filter((id): id is string => Boolean(id)),
    [filters.categories, categories]
  );

  const fetchPage = useCallback(
    async (pageToLoad: number, replace: boolean) => {
      if (!categoriesLoaded) return;

      try {
        replace ? setLoading(true) : setLoadingMore(true);
        setError(null);

        const data = await searchListings({
          searchTerm: filters.q || undefined,
          categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          minRating: filters.minRating,
          hasActiveOffer: filters.hasOffer,
          page: pageToLoad,
          pageSize: 12,
        });

        const results =
          activeCategoryNames.size > 0
            ? data.items.filter((listing) =>
                activeCategoryNames.has(listing.categoryName?.toLowerCase() ?? "")
              )
            : data.items;

        setListings((current) => (replace ? results : [...current, ...results]));
        setTotalCount(data.totalCount);
        setPage(pageToLoad);
      } catch (err) {
        console.error("Error fetching search results:", err);
        if (replace) {
          setListings([]);
          setTotalCount(0);
        }
        setError("Failed to load results. Please try again.");
      } finally {
        replace ? setLoading(false) : setLoadingMore(false);
      }
    },
    [
      activeCategoryNames,
      categoriesLoaded,
      filters.hasOffer,
      filters.maxPrice,
      filters.minRating,
      filters.minPrice,
      filters.q,
      selectedCategoryIds,
    ]
  );

  useEffect(() => {
    let cancelled = false;

    const runSearch = async () => {
      if (cancelled) return;
      setPage(1);
      setListings([]);
      setTotalCount(0);
      await fetchPage(1, true);
    };

    if (categoriesLoaded) {
      void runSearch();
    }

    return () => {
      cancelled = true;
    };
  }, [categoriesLoaded, fetchPage, filters]);

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

  const toggleHasOffer = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    filters.hasOffer ? next.delete("hasOffer") : next.set("hasOffer", "true");
    setSearchParams(next);
  }, [searchParams, setSearchParams, filters.hasOffer]);

  const clearFilters = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    ["q", "category", "minPrice", "maxPrice", "minRating", "maxRating", "hasOffer"].forEach((key) =>
      next.delete(key)
    );
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const ratingOptions = [3, 4, 4.5] as const;
  const hasMore = listings.length < totalCount;
  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    void fetchPage(page + 1, false);
  }, [fetchPage, hasMore, loading, loadingMore, page]);

  return {
    filters,
    listings,
    filteredListings: listings,
    loading,
    loadingMore,
    totalCount,
    hasMore,
    loadMore,
    error,
    categories,
    ratingOptions,
    setQuery,
    setMinPrice,
    setMaxPrice,
    clearCategories,
    toggleCategory,
    setMinRating,
    toggleHasOffer,
    clearFilters,
  };
};
