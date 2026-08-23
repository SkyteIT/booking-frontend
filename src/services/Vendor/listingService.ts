import api from "../api";

// The backend serializes these enum values using their string names.
export const ListingType = {
  Hotel: "Hotel",
  Restaurant: "Restaurant",
  Event: "Event",
  CarRental: "CarRental",
  Activity: "Activity",
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
  price?: number;
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
  vendorId?: string;
  categoryId: string;
  type?: ListingType;

  title: string;
  description: string;

  price: number;
  basePrice?: number;
  currency: string;
  location: string;

  status: string;
  isActive?: boolean;
  isAvailable?: boolean;

  images: string[];
  tags: string[];

  cancellationPolicy: string;

  hotelDetails?: HotelDetailsDto;
  restaurantDetails?: RestaurantDetailsDto;
  carRentalDetails?: CarRentalDetailsDto;
  activityDetails?: ActivityDetailsDto;
  eventDetails?: EventDetailsDto;
}

export const createListing = async (data: CreateListingRequest, files?: File[]) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("images", file);
    });
  }
  const res = await api.post("/listings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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

export interface VendorDto {
  id: string;
  businessName: string;
}

export const getCurrentVendor = async (): Promise<VendorDto> => {
  const res = await api.get<VendorDto>("/vendors/me");
  return res.data;
};

// Matches Ube.Application.Features.Listings.ListingResponse
export interface ListingResponse {
  id: string;
  vendorProfileId: string;
  vendorId?: string;
  categoryId: string;
  title: string;
  description?: string;
  price: number;
  basePrice: number;
  currency: string;
  location?: string;
  status: string;
  categoryName: string;
  vendorName: string;
  // PerNight | PerHour | PerPerson | PerDay | FixedPrice, from the
  // listing's Category.ServiceModel - null if the admin never set it.
  pricingUnit?: string | null;
  type: ListingType;
  averageRating: number;
  totalReviews: number;
  rating: number;
  bookingsCount: number;
  primaryImage?: string;
  images: string[];
  tags: string[];
  cancellationPolicy?: string;
  isActive: boolean;
  isAvailable: boolean;
  hasActiveOffer?: boolean;
  offerBadgeText?: string | null;

  hotelDetails?: HotelDetailsDto;
  restaurantDetails?: RestaurantDetailsDto;
  carRentalDetails?: CarRentalDetailsDto;
  activityDetails?: ActivityDetailsDto;
  eventDetails?: EventDetailsDto;
}

const normalizeListing = (raw: any): ListingResponse => {
  const isActive =
    typeof raw?.isActive === "boolean"
      ? raw.isActive
      : typeof raw?.status === "string"
        ? raw.status.toLowerCase() === "active"
        : true;

  return {
    id: String(raw?.id ?? ""),
    vendorProfileId: String(raw?.vendorProfileId ?? raw?.vendorId ?? ""),
    vendorId: raw?.vendorId,
    categoryId: String(raw?.categoryId ?? ""),
    title: raw?.title ?? raw?.name ?? "",
    description: raw?.description ?? "",
    price: Number(raw?.price ?? 0),
    basePrice: Number(raw?.basePrice ?? raw?.price ?? 0),
    currency: raw?.currency ?? "LKR",
    location: raw?.location ?? "",
    status: raw?.status ?? (isActive ? "Active" : "Inactive"),
    isAvailable: typeof raw?.isAvailable === "boolean" ? raw.isAvailable : isActive,
    isActive,
    categoryName: raw?.categoryName ?? raw?.category?.name ?? "",
    vendorName: raw?.vendorName ?? raw?.vendor?.name ?? "",
    type: raw?.type ?? "Hotel",
    averageRating: Number(raw?.averageRating ?? 0),
    totalReviews: Number(raw?.totalReviews ?? 0),
    rating: Number(raw?.rating ?? raw?.averageRating ?? 0),
    bookingsCount: Number(raw?.bookingsCount ?? 0),
    primaryImage: raw?.primaryImage ?? raw?.imageUrl ?? raw?.coverImage ?? undefined,
    images: raw?.images ?? [],
    tags: raw?.tags ?? [],
    cancellationPolicy: raw?.cancellationPolicy ?? "",
    hasActiveOffer: Boolean(raw?.hasActiveOffer),
    offerBadgeText: raw?.offerBadgeText ?? undefined,
    hotelDetails: raw?.hotelDetails,
    restaurantDetails: raw?.restaurantDetails,
    carRentalDetails: raw?.carRentalDetails,
    activityDetails: raw?.activityDetails,
    eventDetails: raw?.eventDetails,
  };
};

export const getVendorListings = async (): Promise<ListingResponse[]> => {
  const res = await api.get<ListingResponse[]>("/listings/me");
  return res.data.map((item: any) => normalizeListing(item));
};

export const getListings = async (): Promise<ListingResponse[]> => {
  const res = await api.get<ListingResponse[]>("/listings", {
    headers: { "Content-Type": "application/json" },
    skipAuthRedirect: true,
  });
  return res.data.map((item: any) => normalizeListing(item));
};

export const getListingById = async (id: string): Promise<ListingResponse> => {
  const res = await api.get<ListingResponse>(`/listings/${id}`, {
    headers: { "Content-Type": "application/json" },
    skipAuthRedirect: true,
  });
  return normalizeListing(res.data);
};

export const updateListing = async (id: string, data: CreateListingRequest, files?: File[]) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("images", file);
    });
  }
  const res = await api.put(`/listings/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteListing = async (id: string): Promise<void> => {
  await api.delete(`/listings/${id}`);
};