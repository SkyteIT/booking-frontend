// src/utils/types.ts

// Generic escape hatch for backend payloads whose exact shape varies by
// endpoint (e.g. paginated envelopes that come back as {items}, {data},
// {$values}, ...). Prefer a concrete interface wherever the shape is known;
// reach for this only where the code is deliberately defensive about the
// response shape.
export type RawApiRecord = Record<string, unknown>;

// Matches the backend's ListingType enum (Ube.Domain.Enums.Listings) by name.
export type ListingCategory = 'Hotel' | 'Restaurant' | 'Activity' | 'Event' | 'CarRental';

export interface TicketType {
    type: string;
    quantity: number;
    price: number;
}

export interface ListingFormData {
    // Base fields (required for all categories)
    title: string;
    location: string;
    category: ListingCategory;
    // The real admin-created Category's id (services/Vendor/listingService.ts
    // CategoryDto) — distinct from `category` above, which only selects the
    // fixed ListingType and determines which detail-fields section renders.
    categoryId: string;
    images: string[];
    imageUrls?: string;
    description?: string;
    price?: number;
    currency?: string;
    tagsInput?: string;
    tags?: string | string[];
    status?: string;
    isAvailable?: boolean;
    isActive?: boolean;

    // Hotel fields
    propertyType?: string;
    numberOfRooms?: number;
    pricePerNight?: number;
    checkInTime?: string;
    checkOutTime?: string;
    roomTypes?: string[];
    roomType?: string;
    amenities?: string[];
    cancellationPolicy?: string;

    // Restaurant fields
    cuisineType?: string;
    seatingCapacity?: number;
    averageCost?: number;
    openingTime?: string;
    closingTime?: string;
    tableTypes?: string[];
    reservationRules?: string;

    // Activity fields
    activityType?: string;
    duration?: string;
    difficultyLevel?: string;
    activityPrice?: number;
    minGroupSize?: number;
    maxGroupSize?: number;
    minAge?: number;
    maxAge?: number;
    includedServices?: string[];
    safetyRequirements?: string;
    availabilitySchedule?: string;

    // Event fields
    eventType?: string;
    venueName?: string;
    eventDate?: string;
    eventTime?: string;
    venueAddress?: string;
    organizer?: string;
    seatCount?: number;
    ticketTypes?: TicketType[];

    // Car rental fields
    vehicleType?: string;
    brand?: string;
    model?: string;
    transmission?: string;
    fuelType?: string;
    year?: number;
    dailyRate?: number;
    hourlyRate?: number;
    seatCountCar?: number;
    availabilityStatus?: string;
    pickupLocation?: string;
    returnLocation?: string;
    insuranceOptions?: string;
}
