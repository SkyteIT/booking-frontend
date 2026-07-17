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
  const category = typeLabels[api.type] ?? "Other";
  const images = api.images?.length ? api.images : api.primaryImage ? [api.primaryImage] : [];

  return {
    id: api.id,
    title: api.title,
    category,
    location: api.location || "Online",
    price: api.price,
    priceUnit: priceUnitByCategory[category] ?? "unit",
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
