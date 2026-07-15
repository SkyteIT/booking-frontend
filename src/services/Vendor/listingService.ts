import api from "../api";

export const ListingType = {
  Hotel: 0,
  Restaurant: 1,
  Event: 2,
  CarRental: 3,
  Activity: 4,
} as const;

export type ListingType = (typeof ListingType)[keyof typeof ListingType];

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
export interface CreateListingRequest {
  categoryId: string;
  type: ListingType;

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
  const res = await api.post("/api/listings", data);
  return res.data;
};

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
}

export const getCategories = async (): Promise<CategoryDto[]> => {
  const res = await api.get<CategoryDto[]>("/api/categories");
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
  const res = await api.get<ListingResponse[]>("/api/listings/me");
  return res.data;
};

export const getListings = async (): Promise<ListingResponse[]> => {
  const res = await api.get<ListingResponse[]>("/api/listings");
  return res.data;
};

export const getListingById = async (id: string): Promise<ListingResponse> => {
  const res = await api.get<ListingResponse>(`/api/listings/${id}`);
  return res.data;
};

export const updateListing = async (id: string, data: CreateListingRequest) => {
  const res = await api.put(`/api/listings/${id}`, data);
  return res.data;
};
