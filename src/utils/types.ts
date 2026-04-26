// src/utils/types.ts

export type ListingCategory = 'Hotels' | 'Restaurants' | 'Activities' | 'Events' | 'Car Rentals';

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
    images: string[]; // Changed from FileList to string[] as per requested JSON
    description?: string;
    price?: number;
    tags?: string[];
    status?: string;
    isAvailable?: boolean;

    // Hotel fields
    propertyType?: string;
    numberOfRooms?: number;
    pricePerNight?: number;
    checkInTime?: string;
    checkOutTime?: string;
    roomTypes?: string[];
    roomType?: string; // Singular for single selection if needed
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

// Strongly-typed variants for use outside the form (e.g. API submission)
export type ListingCategory_Hotels    = 'Hotels';
export type ListingCategory_Rest      = 'Restaurants';
export type ListingCategory_Activity  = 'Activities';
export type ListingCategory_Events    = 'Events';
export type ListingCategory_Car       = 'Car Rentals';