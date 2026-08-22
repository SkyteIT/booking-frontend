// Main feature hook (business logic):
// 1) fetches listings from the backend
// 2) loads active categories from the backend
// 3) reads filters from URL params
// 4) exposes simple handlers that update URL params
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchCategories, type ApiCategory } from "../../../../services/categoryService";
import { searchListings, type SearchListing } from "../../../../services/searchService";
import { parseSearchFilters } from "../utils/searchParams";

const PAGE_SIZE = 12;

export const useSearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<SearchListing[]>([]);
  const [allCategories, setAllCategories] = useState<ApiCategory[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [fetchedCount, setFetchedCount] = useState(0);

  // Synchronous in-flight guard - state updates from setLoadingMore are async,
  // so two IntersectionObserver callbacks firing back-to-back before the first
  // re-render would both read loadingMore as false and both fire a request.
  // This ref closes that race window: it's set the instant a request starts,
  // before any await, so the second callback sees it immediately.
  const loadingRef = useRef(false);

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
            categories.find((category) => category.name.toLowerCase() === name.toLowerCase())?.id
        )
        .filter((id): id is string => Boolean(id)),
    [filters.categories, categories]
  );

  const filterByActiveCategories = useCallback(
    (results: SearchListing[]) =>
      activeCategoryNames.size > 0
        ? results.filter((listing) => activeCategoryNames.has(listing.categoryName?.toLowerCase() ?? ""))
        : results,
    [activeCategoryNames]
  );

  // Fresh search whenever filters/categories change - always fetches page 1
  // and replaces the list.
  useEffect(() => {
    if (!categoriesLoaded) return;

    let cancelled = false;

    const run = async () => {
      loadingRef.current = true;
      try {
        setLoading(true);
        setError(null);

        const { items, totalCount: tc } = await searchListings({
          searchTerm: filters.q || undefined,
          categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          minRating: filters.minRating,
          hasActiveOffer: filters.hasOffer,
          // Explore has no pagination control, so request the largest page the
          // backend allows instead of its smaller default page.
          page: 1,
          pageSize: 50,
        });

        if (cancelled) return;

        setListings(filterByActiveCategories(items));
        setTotalCount(tc);
        setFetchedCount(items.length);
        setPage(1);
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching search results:", err);
        setListings([]);
        setTotalCount(0);
        setFetchedCount(0);
        setError("Failed to load results. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
        loadingRef.current = false;
      }
    };

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, categoriesLoaded, activeCategoryNames, selectedCategoryIds]);

  const hasMore = fetchedCount < totalCount;

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const { items, totalCount: tc } = await searchListings({
        searchTerm: filters.q || undefined,
        categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating: filters.minRating,
        hasActiveOffer: filters.hasOffer,
        page: nextPage,
        pageSize: PAGE_SIZE,
      });

      setListings((prev) => [...prev, ...filterByActiveCategories(items)]);
      setTotalCount(tc);
      setFetchedCount((prev) => prev + items.length);
      setPage(nextPage);
    } catch (err) {
      console.error("Error fetching more search results:", err);
    } finally {
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, [page, hasMore, filters, selectedCategoryIds, filterByActiveCategories]);

  const setQuery = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams);
      if (value.trim()) next.set("q", value.trim());
      else next.delete("q");
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const setMinPrice = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams);
      const n = value.replace(/[^0-9]/g, "");
      if (n) next.set("minPrice", n);
      else next.delete("minPrice");
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const setMaxPrice = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams);
      const n = value.replace(/[^0-9]/g, "");
      if (n) next.set("maxPrice", n);
      else next.delete("maxPrice");
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

      if (updated.length > 0) next.set("category", updated.join(","));
      else next.delete("category");

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
      if (rating !== undefined) next.set("minRating", String(rating));
      else next.delete("minRating");
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const toggleHasOffer = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    if (filters.hasOffer) next.delete("hasOffer");
    else next.set("hasOffer", "true");
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

  return {
    filters,
    listings,
    filteredListings: listings,
    loading,
    loadingMore,
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
