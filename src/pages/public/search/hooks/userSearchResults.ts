import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getListings } from "../../../../services/Vendor/listingService";
import type { ListingResponse } from "../../../../services/Vendor/listingService";
import { filterListings } from "../utils/filterListings";
import { CATEGORIES, parseSearchFilters } from "../utils/searchParams";
import type { Listing, ListingCategory } from "../utils/types";

const ratingOptions = [3, 4, 4.5] as const;

// Helper to map API response to frontend Listing type
const mapApiListing = (api: ListingResponse): Listing => {
  const typeLabels: Record<number, string> = {
    0: "Hotel",
    1: "Restaurant",
    2: "Event",
    3: "CarRental",
    4: "Activity"
  };

  let categoryLabel = "Other";
  if (typeof api.type === "number") {
    categoryLabel = typeLabels[api.type] || "Other";
  } else if (typeof api.type === "string") {
    // Backend returns string labels like "Hotel", "Restaurant" etc. due to JsonStringEnumConverter
    categoryLabel = api.type;
  }

  const unitMap: Record<string, string> = {
    Hotel: "night",
    Restaurant: "person",
    Event: "ticket",
    CarRental: "day",
    Activity: "session"
  };

  const priceUnit = unitMap[categoryLabel] || "unit";

  return {
    id: api.id,
    title: api.title,
    category: categoryLabel,
    location: api.location || "Online",
    price: api.basePrice,
    priceUnit: priceUnit,
    rating: api.rating,
    reviews: api.bookingsCount,
    image: api.primaryImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    isAvailable: api.isActive
  };
};

export const useSearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getListings();
        setListings(data.map(mapApiListing));
        setError(null);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError("Failed to load listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
