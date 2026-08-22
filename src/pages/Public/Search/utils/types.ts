// Feature-level types shared across search hook, utils, data, and components.
export type ListingCategory = string;

export interface ApiCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export interface Listing {
  id: string;
  title: string;
  category: ListingCategory | string; // admin-chosen display name, NOT the raw type - see `type` below
  // Raw ListingType (Hotel/Restaurant/Event/CarRental/Activity) from
  // ListingResponse.type - `category` above is the admin's display
  // name (e.g. "Hotels & Resorts"), which can't be pattern-matched
  // reliably. Use this field for any category-specific branching.
  type?: string;
  location: string;
  price: number;
  priceUnit?: string;
  // Category pricing model (PerNight/PerHour/PerPerson/PerDay/FixedPrice)
  // from the backend's ListingResponse.PricingUnit - lets the cart
  // compute an accurate total estimate matching BookingPricingRules.
  pricingUnit?: string;
  // Category-specific bounds for the booking-configuration quantity
  // control (see PriceCard.tsx) - drives what "quantity" honestly means
  // per category (rooms/party size/participants) instead of one
  // generic "guests" field with a fixed 1-6 range everywhere.
  availableRooms?: number; // Hotel
  roomTypes?: string[];
  propertyType?: string;
  checkInTime?: string;
  checkOutTime?: string;
  tableCapacity?: number; // Restaurant
  cuisineType?: string;
  averageCost?: number;
  openingHours?: string;
  tableTypes?: string[];
  reservationRules?: string;
  minGroupSize?: number; // Activity
  maxGroupSize?: number; // Activity
  activityType?: string;
  durationHours?: number;
  difficultyLevel?: string;
  minAge?: number;
  maxAge?: number;
  safetyRequirements?: string;
  availabilitySchedule?: string;
  // Event venue + Car Rental vehicle specs - real data the backend
  // already returns but the product page never surfaced.
  venueName?: string; // Event
  venueAddress?: string; // Event
  eventType?: string; // Event
  eventDateTime?: string;
  organizer?: string;
  seatCount?: number;
  ticketTypes?: { type: string; quantity: number; price: number }[];
  vehicleBrand?: string; // CarRental
  vehicleModel?: string; // CarRental
  vehicleYear?: number; // CarRental
  vehicleTransmission?: string; // CarRental
  vehicleFuelType?: string; // CarRental
  vehicleSeatCount?: number;
  pickupLocation?: string;
  returnLocation?: string;
  availabilityStatus?: string;
  rating: number;
  reviews: number;
  image: string;
  isAvailable: boolean;
  description?: string;
  images: string[];
  vendorName?: string;
  cancellationPolicy?: string;
  amenities: string[];
  hasActiveOffer?: boolean;
  offerBadgeText?: string | null;
}

export interface SearchFilters {
  q: string;
  date: string;
  categories: ListingCategory[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  hasOffer?: boolean;
}
