import { useEffect, useMemo, useState } from "react";
import {
  getCategories,
  getListings,
  type CategoryDto,
  type ListingResponse,
} from "../../../services/Vendor/listingService";

export interface CategoryStat {
  name: string;
  count: number;
  tag: string;
}

// Curated taglines for the categories we expect - any category an admin
// adds that isn't in here still shows up (real data always wins), just
// with the generic fallback tag instead of a bespoke one.
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

const tagFor = (name: string) => TAGS[name.trim().toLowerCase()] ?? "Explore now";

export const useLandingListings = () => {
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getListings(), getCategories()])
      .then(([listingData, categoryData]) => {
        if (cancelled) return;
        setListings(listingData);
        setCategories(categoryData);
      })
      .catch((err) => {
        console.error("Failed to load listings/categories for landing page:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeListings = useMemo(() => listings.filter((l) => l.isActive), [listings]);

  // Real categories only - whatever's actually configured in the admin's
  // content management, not a fixed placeholder list. A category with no
  // active listings yet still shows, correctly, as 0.
  const categoryStats = useMemo<CategoryStat[]>(() => {
    const counts = new Map<string, number>();
    activeListings.forEach((l) => {
      const key = (l.categoryName ?? "").trim().toLowerCase();
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return categories.map((c) => ({
      name: c.name,
      count: counts.get(c.name.trim().toLowerCase()) ?? 0,
      tag: tagFor(c.name),
    }));
  }, [activeListings, categories]);

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
