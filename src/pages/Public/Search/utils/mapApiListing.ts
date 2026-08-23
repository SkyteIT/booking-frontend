import type {
  ListingResponse,
  ListingType,
} from "../../../../services/Vendor/listingService";
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
    return api.carRentalDetails.insuranceOptions
      ? [api.carRentalDetails.insuranceOptions]
      : [];
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
  const images = api.images?.length
    ? api.images
    : api.primaryImage
      ? [api.primaryImage]
      : [];

  return {
    id: api.id,
    title: api.title,
    category,
    type: api.type,
    location: api.location || "Online",
    price: api.price,
    currency: api.currency || "LKR",
    priceUnit: priceUnitByCategory[typeLabel] ?? "unit",
    pricingUnit: api.pricingUnit ?? undefined,
    availableRooms: api.hotelDetails?.availableRooms,
    roomTypes: api.hotelDetails?.roomTypes,
    propertyType: api.hotelDetails?.propertyType,
    checkInTime: api.hotelDetails?.checkInTime,
    checkOutTime: api.hotelDetails?.checkOutTime,
    tableCapacity: api.restaurantDetails?.tableCapacity,
    cuisineType: api.restaurantDetails?.cuisineType,
    averageCost: api.restaurantDetails?.averageCost,
    openingHours: api.restaurantDetails?.openingHours,
    tableTypes: api.restaurantDetails?.tableTypes,
    reservationRules: api.restaurantDetails?.reservationRules,
    minGroupSize: api.activityDetails?.minGroupSize,
    maxGroupSize: api.activityDetails?.maxGroupSize,
    activityType: api.activityDetails?.activityType,
    durationHours: api.activityDetails?.durationHours,
    difficultyLevel: api.activityDetails?.difficultyLevel,
    minAge: api.activityDetails?.minAge,
    maxAge: api.activityDetails?.maxAge,
    safetyRequirements: api.activityDetails?.safetyRequirements,
    availabilitySchedule: api.activityDetails?.availabilitySchedule,
    venueName: api.eventDetails?.venueName,
    venueAddress: api.eventDetails?.venueAddress,
    eventType: api.eventDetails?.eventType,
    eventDateTime: api.eventDetails?.dateAndTime,
    organizer: api.eventDetails?.organizer,
    seatCount: api.eventDetails?.seatCount,
    ticketTypes: api.eventDetails?.ticketTypes,
    vehicleBrand: api.carRentalDetails?.brand,
    vehicleModel: api.carRentalDetails?.model,
    vehicleYear: api.carRentalDetails?.year,
    vehicleTransmission: api.carRentalDetails?.transmission,
    vehicleFuelType: api.carRentalDetails?.fuelType,
    vehicleSeatCount: api.carRentalDetails?.seatCount,
    pickupLocation: api.carRentalDetails?.pickupLocation,
    returnLocation: api.carRentalDetails?.returnLocation,
    availabilityStatus: api.carRentalDetails?.availabilityStatus,
    rating: api.averageRating,
    reviews: api.totalReviews,
    image: api.primaryImage || images[0] || FALLBACK_IMAGE,
    isAvailable: api.isActive,
    description: api.description,
    images: images.length ? images : [FALLBACK_IMAGE],
    vendorName: api.vendorName,
    cancellationPolicy: api.cancellationPolicy,
    amenities: amenitiesFor(api),
    hasActiveOffer: api.hasActiveOffer,
    offerBadgeText: api.offerBadgeText,
    bookingSelection: api.bookingSelection,
  };
}
