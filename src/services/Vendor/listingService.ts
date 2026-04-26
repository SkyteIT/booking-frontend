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
}

export interface RestaurantDetailsDto {
  cuisineType: string;
  averageCost: number;
  openingHours: string;
  tableCapacity: number;
}

export interface CarRentalDetailsDto {
  brand: string;
  model: string;
  transmission: string;
  pricePerDay: number;
  seatCount: number;
  fuelType: string;
  availabilityStatus: string;
}

export interface ActivityDetailsDto {
  activityType: string;
  durationHours: number;
  difficultyLevel: string;
  price: number;
}

export interface EventDetailsDto {
  eventName: string;
  organizer: string;
  dateAndTime: string;
  seatCount: number;
  ticketPrice: number;
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
  const response = await fetch(`${API_BASE_URL}/Listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  const response = await fetch(`${API_BASE_URL}/Vendors/me`);
  if (!response.ok) {
    throw new Error("Failed to fetch current vendor. Have you seeded the database?");
  }
  return response.json();
};