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
  category: ListingCategory | string; 
  type?: string;
  location: string;
  price: number;
  currency: string;
  priceUnit?: string;
 
  pricingUnit?: string;
 
  availableRooms?: number; // Hotel
  roomTypes?: string[];
  primaryRoomType?: string;
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
  ticketPrice?: number;
  vehicleBrand?: string; // CarRental
  vehicleModel?: string; // CarRental
  vehicleYear?: number; // CarRental
  vehicleTransmission?: string; // CarRental
  vehicleFuelType?: string; // CarRental
  vehicleSeatCount?: number;
  hourlyRate?: number;
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

  customFieldValues?: CustomFieldValue[];
 
  bookingSelection?: BookingSelectionConfig;

  optionGroups?: ListingOptionGroup[];
}

export interface CustomFieldValue {
  categoryCustomFieldId: string;
  label: string;
  value: string;
}

export interface ListingOptionValue {
  id: string;
  name: string;
  displayOrder: number;
  priceModifier: number;
  priceOverride?: number | null;
  confirmationTypeOverride?: "Instant" | "Request" | null;
  requiresSeatSelection: boolean;
}

export interface ListingOptionGroup {
  id: string;
  listingId: string;
  name: string;
  displayOrder: number;
  values: ListingOptionValue[];
}

export interface BookingSelectionConfig {
  startLabel: string;
  endLabel?: string;
  showStartDate: boolean;
  showStartTime: boolean;
  showEndDate: boolean;
  showEndTime: boolean;
  endMustBeAfterStart: boolean;
  quantityLabel: string;
  unitLabel?: string;
  showUnitSelection: boolean;
  fixedStartDateTime?: string;
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
