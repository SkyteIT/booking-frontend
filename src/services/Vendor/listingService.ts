import api from "../api";

// The backend serializes all enums as their string name globally
// (Program.cs: AddJsonOptions -> JsonStringEnumConverter()), so this is
// always e.g. "Hotel", never the underlying numeric value.
export type ListingType =
  | "Hotel"
  | "Restaurant"
  | "Event"
  | "CarRental"
  | "Activity";

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
  vehicleType?: string;
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

export interface CreateListingResult {
  id: string;
}

// Creation responses have differed between API versions (the listing object,
// a bare Guid, or an envelope). Keep that transport detail out of the page so
// optional unit creation always targets the listing that was just created.
export const createListing = async (
  data: CreateListingRequest,
  images: File[] = [],
): Promise<CreateListingResult> => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  images.forEach((file) => formData.append("images", file));
  const res = await api.post("/listings", formData);
  const body = res.data as unknown;

  let id = "";
  if (typeof body === "string") {
    id = body;
  } else if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const nested =
      record.data && typeof record.data === "object"
        ? (record.data as Record<string, unknown>)
        : undefined;
    id = String(
      record.id ?? record.listingId ?? nested?.id ?? nested?.listingId ?? "",
    );
  }

  if (!id) {
    const location = String(res.headers.location ?? "");
    id = location.match(/\/listings\/([^/?#]+)/i)?.[1] ?? "";
  }

  return { id };
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
  // PerNight | PerHour | PerPerson | PerDay | FixedPrice, from the
  // listing's Category.ServiceModel - null if the admin never set it.
  pricingUnit?: string | null;
  type: ListingType;
  averageRating: number;
  totalReviews: number;
  primaryImage?: string;
  images: string[];
  tags: string[];
  cancellationPolicy?: string;
  hasActiveOffer: boolean;
  offerBadgeText?: string | null;

  hotelDetails?: HotelDetailsDto;
  restaurantDetails?: RestaurantDetailsDto;
  carRentalDetails?: CarRentalDetailsDto;
  activityDetails?: ActivityDetailsDto;
  eventDetails?: EventDetailsDto;

  bookingSelection?: BookingSelectionConfigDto;
}

// Matches Ube.Application.Features.Listings.BookingSelectionConfigDto -
// the backend's per-listing-type authority on what booking UI to show,
// so the frontend doesn't have to re-derive it from `type` guesses.
export interface BookingSelectionConfigDto {
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

const unwrapValues = <T>(
  value: T[] | { $values?: T[] } | null | undefined,
): T[] => {
  if (Array.isArray(value)) return value;
  return value?.$values ?? [];
};

const normalizeListing = (response: any): ListingResponse => {
  // Some API actions return the DTO directly while others wrap it in
  // { data } or { result }. Edit mode must hydrate from all supported shapes.
  const raw = response?.data ?? response?.result ?? response;
  const isActive =
    typeof raw?.isActive === "boolean"
      ? raw.isActive
      : typeof raw?.status === "string"
        ? raw.status.toLowerCase() === "active"
        : true;

  return {
    id: String(raw?.id ?? ""),
    vendorProfileId: String(raw?.vendorProfileId ?? raw?.vendorId ?? ""),
    categoryId: String(raw?.categoryId ?? raw?.category?.id ?? ""),
    title: raw?.title ?? raw?.name ?? "",
    description: raw?.description ?? "",
    price: Number(raw?.price ?? 0),
    currency: raw?.currency ?? "LKR",
    location: raw?.location ?? "",
    isActive,
    categoryName: raw?.categoryName ?? raw?.category?.name ?? "",
    vendorName: raw?.vendorName ?? raw?.vendor?.name ?? "",
    type: raw?.type ?? "Hotel",
    averageRating: Number(raw?.averageRating ?? 0),
    totalReviews: Number(raw?.totalReviews ?? 0),
    primaryImage:
      raw?.primaryImage ?? raw?.imageUrl ?? raw?.coverImage ?? undefined,
    images: unwrapValues<string>(raw?.images),
    tags: unwrapValues<string>(raw?.tags),
    cancellationPolicy: raw?.cancellationPolicy ?? "",
    hasActiveOffer: Boolean(raw?.hasActiveOffer),
    offerBadgeText: raw?.offerBadgeText ?? undefined,
    hotelDetails: raw?.hotelDetails ?? raw?.details?.hotelDetails,
    restaurantDetails:
      raw?.restaurantDetails ?? raw?.details?.restaurantDetails,
    carRentalDetails: raw?.carRentalDetails ?? raw?.details?.carRentalDetails,
    activityDetails: raw?.activityDetails ?? raw?.details?.activityDetails,
    eventDetails: raw?.eventDetails ?? raw?.details?.eventDetails,
    bookingSelection: raw?.bookingSelection ?? undefined,
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

export const getEditableListingById = async (
  id: string,
): Promise<ListingResponse> => {
  const publicListing = await getListingById(id);

  try {
    const vendorListings = await getVendorListings();
    const ownedListing = vendorListings.find((listing) => listing.id === id);
    if (!ownedListing) return publicListing;

    return {
      ...publicListing,
      ...ownedListing,
      categoryId: ownedListing.categoryId || publicListing.categoryId,
      categoryName: ownedListing.categoryName || publicListing.categoryName,
      // Prefer whichever endpoint actually includes the full subtype DTO.
      hotelDetails: ownedListing.hotelDetails ?? publicListing.hotelDetails,
      restaurantDetails:
        ownedListing.restaurantDetails ?? publicListing.restaurantDetails,
      carRentalDetails:
        ownedListing.carRentalDetails ?? publicListing.carRentalDetails,
      activityDetails:
        ownedListing.activityDetails ?? publicListing.activityDetails,
      eventDetails: ownedListing.eventDetails ?? publicListing.eventDetails,
      images:
        ownedListing.images.length > 0
          ? ownedListing.images
          : publicListing.images,
      tags:
        ownedListing.tags.length > 0 ? ownedListing.tags : publicListing.tags,
    };
  } catch {
    // The public detail response is still usable if the vendor collection is
    // temporarily unavailable or an older API does not expose /listings/me.
    return publicListing;
  }
};

export const updateListing = async (
  id: string,
  data: CreateListingRequest,
  images: File[] = [],
) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  images.forEach((file) => formData.append("images", file));
  const res = await api.put(`/listings/${id}`, formData);
  return res.data;
};

export const deleteListing = async (id: string): Promise<void> => {
  await api.delete(`/listings/${id}`);
};
