const API_BASE_URL = "http://localhost:5037/api";

export const ListingType = {
  Hotel: 0,
  Restaurant: 1,
  Event: 2,
  CarRental: 3,
  Activity: 4
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

export interface CreateListingRequest {
  vendorId: string;
  categoryId: string;
  type: number;

  title: string;
  description: string;

  basePrice: number;
  currency: string;
  location: string;

  status: string;
  isAvailable: boolean;

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
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/Listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to create listing");
  }

  return response.json();
};

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
}

export const getCategories = async (): Promise<CategoryDto[]> => {
  const response = await fetch(`${API_BASE_URL}/Categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

export interface VendorDto {
  id: string;
  businessName: string;
}

export const getCurrentVendor = async (): Promise<VendorDto> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/Vendors/me`, {
    headers: {
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Not authorized. Please log in.");
    }
    throw new Error("Failed to fetch current vendor. Have you created a vendor profile?");
  }
  return response.json();
};

export interface ListingResponse {
  id: string;
  vendorId: string;
  categoryId: string;
  title: string;
  description?: string;
  basePrice: number;
  currency: string;
  categoryName: string;
  location: string;
  type: number;
  status: string;
  rating: number;
  bookingsCount: number;
  primaryImage?: string;
  images: string[];
  tags: string[];
  cancellationPolicy?: string;
  isActive: boolean;
  isAvailable: boolean;

  // Detail fields
  hotelDetails?: HotelDetailsDto;
  restaurantDetails?: RestaurantDetailsDto;
  carRentalDetails?: CarRentalDetailsDto;
  activityDetails?: ActivityDetailsDto;
  eventDetails?: EventDetailsDto;
}

export const getVendorListings = async (): Promise<ListingResponse[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/Listings/me`, {
    headers: {
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch vendor listings");
  }
  return response.json();
};

export const getListings = async (): Promise<ListingResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/Listings`);
  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }
  return response.json();
};

export const getListingById = async (id: string): Promise<ListingResponse> => {
  const response = await fetch(`${API_BASE_URL}/Listings/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch listing details");
  }
  return response.json();
};

export const updateListing = async (id: string, data: CreateListingRequest) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/Listings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to update listing");
  }

  return response.ok;
};