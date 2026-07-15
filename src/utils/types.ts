// src/utils/types.ts

// Generic escape hatch for backend payloads whose exact shape varies by
// endpoint (e.g. paginated envelopes that come back as {items}, {data},
// {$values}, ...). Prefer a concrete interface wherever the shape is known;
// reach for this only where the code is deliberately defensive about the
// response shape.
export type RawApiRecord = Record<string, unknown>;

// react-hook-form's FieldErrors<T> doesn't distribute cleanly across a
// discriminated union like ListingFormData — it collapses to whichever
// union member TS resolves first, dropping the other categories' field
// names. Category-specific field components only ever read the couple of
// keys relevant to their own category off the shared error bag, so a loose
// map is an honest fit here (narrower than `any`, without fighting the
// union).
export type FormErrorMap = Record<string, { message?: string } | undefined>;

export type ListingCategory = 'Hotels' | 'Restaurants' | 'Activities' | 'Events' | 'Car Rentals';

export interface BaseListingData {
    title: string;
    location: string;
    category: ListingCategory;
    images: File[];
}

export interface HotelData extends BaseListingData {
    category: 'Hotels';
    propertyType: string;
    numberOfRooms: number;
    checkInTime: string;
    checkOutTime: string;
    roomTypes: string[];
    amenities: string[];
    cancellationPolicy: string;
}

export interface RestaurantData extends BaseListingData {
    category: 'Restaurants';
    cuisineType: string;
    seatingCapacity: number;
    openingTime: string;
    closingTime: string;
    tableTypes: string[];
    reservationRules: string;
}

export interface ActivityData extends BaseListingData {
    category: 'Activities';
    activityType: string;
    duration: string;
    minGroupSize: number;
    maxGroupSize: number;
    minAge: number;
    maxAge?: number;
    includedServices: string[];
    safetyRequirements: string;
    availabilitySchedule: string;
}

export interface TicketType {
    type: string;
    quantity: number;
    price: number;
}

export interface EventData extends BaseListingData {
    category: 'Events';
    eventType: string;
    venueName: string;
    eventDate: string;
    eventTime: string;
    venueAddress: string;
    ticketTypes: TicketType[];
}

export interface InsuranceOption {
    label: string;
    price: string;
    selected?: boolean;
}

export interface CarRentalData extends BaseListingData {
    category: 'Car Rentals';
    vehicleType: string;
    transmission: string;
    fuelType: string;
    year: number;
    dailyRate: number;
    hourlyRate: number;
    pickupLocation: string;
    returnLocation: string;
    insuranceOptions: string; // Storing selected insurance label
}

export type ListingFormData = HotelData | RestaurantData | ActivityData | EventData | CarRentalData;
