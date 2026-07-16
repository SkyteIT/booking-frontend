import type { ListingResponse, ListingType } from "../../../../services/Vendor/listingService";
import type { Listing } from "./types";

const typeLabels: Record<ListingType, string> = {
  0: "Hotel",
  1: "Restaurant",
  2: "Event",
  3: "CarRental",
  4: "Activity",
};

const priceUnitByCategory: Record<string, string> = {
  Hotel: "night",
  Restaurant: "person",
  Event: "ticket",
  CarRental: "day",
  Activity: "session",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";

export function mapApiListing(api: ListingResponse): Listing {
  const category = typeLabels[api.type] ?? "Other";

  return {
    id: api.id,
    title: api.title,
    category,
    location: api.location || "Online",
    price: api.price,
    priceUnit: priceUnitByCategory[category] ?? "unit",
    rating: api.averageRating,
    reviews: api.totalReviews,
    image: api.primaryImage || FALLBACK_IMAGE,
    isAvailable: api.isActive,
  };
}
