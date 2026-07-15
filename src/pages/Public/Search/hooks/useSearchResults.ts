// Main feature hook (business logic):
// 1) fetches listings from the backend
// 2) reads filters from URL params
// 3) filters listings
// 4) exposes simple handlers that update URL params.
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getListings } from "../../../../services/Vendor/listingService";
import { filterListings } from "../utils/filterListings";
import { mapApiListing } from "../utils/mapApiListing";
import { CATEGORIES, parseSearchFilters } from "../utils/searchParams";
import type { Listing, ListingCategory } from "../utils/types";

const ratingOptions = [3, 4, 4.5] as const;

export const useSearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getListings();
        if (cancelled) return;
        setListings(data.map(mapApiListing));
        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching listings:", err);
        setError("Failed to load listings.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const filters = useMemo(() => parseSearchFilters(searchParams), [searchParams]);

  const filteredListings = useMemo(
    () => filterListings(listings, filters),
    [listings, filters],
  );

  // Updates the main text query (`q`) in URL params.
  const setQuery = (value: string) => {
    const next = new URLSearchParams(searchParams);
    const query = value.trim();

    if (query) {
      next.set("q", query);
    } else {
      next.delete("q");
    }

    setSearchParams(next);
  };

  // Updates minimum price in URL after removing non-numeric characters.
  const setMinPrice = (value: string) => {
    const next = new URLSearchParams(searchParams);
    const normalized = value.replace(/[^0-9]/g, "");

    if (normalized) {
      next.set("minPrice", normalized);
    } else {
      next.delete("minPrice");
    }

    setSearchParams(next);
  };

  // Updates maximum price in URL after removing non-numeric characters.
  const setMaxPrice = (value: string) => {
    const next = new URLSearchParams(searchParams);
    const normalized = value.replace(/[^0-9]/g, "");

    if (normalized) {
      next.set("maxPrice", normalized);
    } else {
      next.delete("maxPrice");
    }

    setSearchParams(next);
  };

  // Removes all selected categories from URL params.
  const clearCategories = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    setSearchParams(next);
  };

  // Adds/removes one category in the URL category list.
  const toggleCategory = (category: ListingCategory) => {
    const next = new URLSearchParams(searchParams);
    const isSelected = filters.categories.includes(category);
    let updatedCategories = [...filters.categories];

    if (isSelected) {
      updatedCategories = updatedCategories.filter((item) => item !== category);
    } else {
      updatedCategories.push(category);
    }

    if (updatedCategories.length === 0) {
      next.delete("category");
    } else {
      next.set("category", updatedCategories.join(","));
    }

    setSearchParams(next);
  };

  // Sets or clears minimum rating in URL params.
  const setMinRating = (rating?: number) => {
    const next = new URLSearchParams(searchParams);

    if (rating === undefined) {
      next.delete("minRating");
    } else {
      next.set("minRating", String(rating));
    }

    setSearchParams(next);
  };

  // Clears sidebar filters but keeps other params like `q`.
  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);

    next.delete("category");
    next.delete("minPrice");
    next.delete("maxPrice");
    next.delete("minRating");

    setSearchParams(next);
  };

  return {
    filters,
    filteredListings,
    loading,
    error,
    categories: CATEGORIES,
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
