import { useEffect, useMemo, useState } from "react";
import {
  getListings,
  type ListingResponse,
} from "../../../services/Vendor/listingService";

export interface CategoryStat {
  name: string;
  count: number;
  tag: string;
}

// The same fixed 6 categories the old landing page's CategoriesSection used —
// always shown regardless of what's actually seeded in the backend, with real
// counts overlaid per category (0 if that category has no active listings yet).
export const FIXED_CATEGORIES = [
  "Hotels",
  "Restaurants",
  "Events",
  "Activities",
  "Car rentals",
  "Apartments",
] as const;

const TAGS: Record<string, string> = {
  hotel: "From boutique to grand",
  hotels: "From boutique to grand",
  restaurant: "Tables worth flying for",
  restaurants: "Tables worth flying for",
  event: "Live nights, front row",
  events: "Live nights, front row",
  activity: "Do the thing",
  activities: "Do the thing",
  "car rental": "Keys in minutes",
  "car rentals": "Keys in minutes",
  apartment: "Stay like a local",
  apartments: "Stay like a local",
};

// Maps a listing's real (freeform) categoryName to one of the 6 fixed tiles,
// e.g. "Hotel" / "hotels" / "Boutique Hotels" all count toward "Hotels".
const CATEGORY_SYNONYMS: Record<string, (typeof FIXED_CATEGORIES)[number]> = {
  hotel: "Hotels",
  hotels: "Hotels",
  restaurant: "Restaurants",
  restaurants: "Restaurants",
  event: "Events",
  events: "Events",
  activity: "Activities",
  activities: "Activities",
  "car rental": "Car rentals",
  "car rentals": "Car rentals",
  apartment: "Apartments",
  apartments: "Apartments",
};

const tagFor = (name: string) => TAGS[name.trim().toLowerCase()] ?? "Explore now";

const canonicalCategoryFor = (name: string) => CATEGORY_SYNONYMS[name.trim().toLowerCase()];

export const useLandingListings = () => {
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getListings()
      .then((data) => {
        if (!cancelled) setListings(data);
      })
      .catch((err) => {
        console.error("Failed to load listings for landing page:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeListings = useMemo(() => listings.filter((l) => l.isActive), [listings]);

  const categoryStats = useMemo<CategoryStat[]>(() => {
    const counts = new Map<string, number>(FIXED_CATEGORIES.map((name) => [name, 0]));
    activeListings.forEach((l) => {
      const canonical = canonicalCategoryFor(l.categoryName ?? "");
      if (canonical) counts.set(canonical, (counts.get(canonical) ?? 0) + 1);
    });
    return FIXED_CATEGORIES.map((name) => ({
      name,
      count: counts.get(name) ?? 0,
      tag: tagFor(name),
    }));
  }, [activeListings]);

  const featuredListings = useMemo(
    () =>
      [...activeListings]
        .sort((a, b) => b.averageRating - a.averageRating || b.totalReviews - a.totalReviews)
        .slice(0, 6),
    [activeListings]
  );

  return {
    loading,
    totalListings: activeListings.length,
    categoryStats,
    featuredListings,
  };
};
