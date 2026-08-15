import type { ListingResponse, ListingType } from "../../../../services/Vendor/listingService";
import type { Listing } from "./types";

// ListingType's string values already match the labels we want to show —
// this used to be keyed by the enum's numeric value (0/1/2/...), which
// never matched anything since the backend serializes enums as strings
// (see services/Vendor/listingService.ts). Every listing silently fell
// back to "Other" here until this was caught.
const typeLabels: Record<ListingType, string> = {
  Hotel: "Hotel",
  Restaurant: "Restaurant",
  Event: "Event",
  CarRental: "CarRental",
  Activity: "Activity",
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

// Real per-type amenities/inclusions from the backend — no fabricated defaults.
function amenitiesFor(api: ListingResponse): string[] {
  if (api.hotelDetails) return api.hotelDetails.amenities ?? [];
  if (api.activityDetails) return api.activityDetails.includedServices ?? [];
  if (api.carRentalDetails) {
    return api.carRentalDetails.insuranceOptions ? [api.carRentalDetails.insuranceOptions] : [];
  }
  return [];
}

export function mapApiListing(api: ListingResponse): Listing {
  // `category` shown to customers is the real admin-created category name
  // (e.g. "Luxury Hotels", "Budget Hotels") — two categories can share the
  // same underlying `type`, so the type label is only used as a fallback
  // and to look up the price unit, never as the displayed category itself.
  const typeLabel = typeLabels[api.type] ?? "Other";
  const category = api.categoryName || typeLabel;
  const images = api.images?.length ? api.images : api.primaryImage ? [api.primaryImage] : [];

  return {
    id: api.id,
    title: api.title,
    category,
    location: api.location || "Online",
    price: api.price,
    priceUnit: priceUnitByCategory[typeLabel] ?? "unit",
    rating: api.averageRating,
    reviews: api.totalReviews,
    image: api.primaryImage || images[0] || FALLBACK_IMAGE,
    isAvailable: api.isActive,
    description: api.description,
    images: images.length ? images : [FALLBACK_IMAGE],
    vendorName: api.vendorName,
    cancellationPolicy: api.cancellationPolicy,
    amenities: amenitiesFor(api),
  };
}
