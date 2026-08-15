import api from "../api";

// The backend serializes all enums as their string name globally
// (Program.cs: AddJsonOptions -> JsonStringEnumConverter()), so this is
// always e.g. "Hotel", never the underlying numeric value.
export type ListingType = "Hotel" | "Restaurant" | "Event" | "CarRental" | "Activity";

export interface HotelDetailsDto {
  pricePerNight: number;
  availableRooms: number;
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  roomTypes: string[];
  propertyType?: string;
  primaryRoomType?: string;
}

export interface RestaurantDetailsDto {
  cuisineType: string;
  averageCost: number;
  openingHours: string;
  tableCapacity: number;
  tableTypes: string[];
  reservationRules?: string;
}

export interface CarRentalDetailsDto {
  brand: string;
  model: string;
  transmission: string;
  pricePerDay: number;
  seatCount: number;
  fuelType: string;
  availabilityStatus: string;
  year?: number;
  hourlyRate?: number;
  pickupLocation?: string;
  returnLocation?: string;
  insuranceOptions?: string;
}

export interface ActivityDetailsDto {
  activityType: string;
  durationHours: number;
  difficultyLevel: string;
  price: number;
  minGroupSize: number;
  maxGroupSize: number;
  minAge: number;
  maxAge: number;
  includedServices: string[];
  safetyRequirements: string;
  availabilitySchedule: string;
}

export interface TicketTypeDto {
  type: string;
  quantity: number;
  price: number;
}

export interface EventDetailsDto {
  eventName: string;
  organizer: string;
  dateAndTime: string;
  seatCount: number;
  ticketPrice: number;
  eventType?: string;
  venueName?: string;
  venueAddress?: string;
  ticketTypes?: TicketTypeDto[];
}

// Matches Ube.Application.Features.Listings.CreateListingRequest —
// vendor is derived server-side from the authenticated user, not sent here.
// No `type` field: ListingType is derived server-side from the chosen
// category's Type — a listing can't be created under a category that has
// no Type configured (backend returns a 400 naming the category).
export interface CreateListingRequest {
  categoryId: string;

  title: string;
  description: string;

  price: number;
  currency: string;
  location: string;

  isActive: boolean;

  images: string[];
  tags: string[];

  cancellationPolicy: string;

  hotelDetails?: HotelDetailsDto;
  restaurantDetails?: RestaurantDetailsDto;
  carRentalDetails?: CarRentalDetailsDto;
  activityDetails?: ActivityDetailsDto;
  eventDetails?: EventDetailsDto;
}

export const createListing = async (data: CreateListingRequest) => {
  const res = await api.post("/listings", data);
  return res.data;
};

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
  // Null only for the internal "Uncategorized" sentinel — every
  // admin-created category has a Type once configured.
  type?: ListingType | null;
}

export const getCategories = async (): Promise<CategoryDto[]> => {
  const res = await api.get<CategoryDto[]>("/categories");
  return res.data;
};

// Matches Ube.Application.Features.Listings.ListingResponse
export interface ListingResponse {
  id: string;
  vendorProfileId: string;
  categoryId: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  location?: string;
  isActive: boolean;
  categoryName: string;
  vendorName: string;
  type: ListingType;
  averageRating: number;
  totalReviews: number;
  primaryImage?: string;
  images: string[];
  tags: string[];
  cancellationPolicy?: string;

  hotelDetails?: HotelDetailsDto;
  restaurantDetails?: RestaurantDetailsDto;
  carRentalDetails?: CarRentalDetailsDto;
  activityDetails?: ActivityDetailsDto;
  eventDetails?: EventDetailsDto;
}

export const getVendorListings = async (): Promise<ListingResponse[]> => {
  const res = await api.get<ListingResponse[]>("/listings/me");
  return res.data;
};

export const getListings = async (): Promise<ListingResponse[]> => {
  const res = await api.get<ListingResponse[]>("/listings", {
    headers: { "Content-Type": "application/json" },
    skipAuthRedirect: true,
  });
  return res.data;
};

export const getListingById = async (id: string): Promise<ListingResponse> => {
  const res = await api.get<ListingResponse>(`/listings/${id}`, {
    headers: { "Content-Type": "application/json" },
    skipAuthRedirect: true,
  });
  return res.data;
};

export const updateListing = async (id: string, data: CreateListingRequest) => {
  const res = await api.put(`/listings/${id}`, data);
  return res.data;
};

export const deleteListing = async (id: string): Promise<void> => {
  await api.delete(`/listings/${id}`);
};
