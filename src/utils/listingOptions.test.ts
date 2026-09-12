import { describe, expect, it } from "vitest";
import type { ListingResponse } from "../services/Vendor/listingService";
import { getListingOptions, getListingPriceUnit } from "./listingOptions";

const listing: ListingResponse = {
  id: "listing", vendorProfileId: "vendor", categoryId: "category", title: "Listing",
  categoryName: "Hotels", vendorName: "Vendor", type: "Hotel", price: 100, currency: "LKR",
  isActive: true, averageRating: 0, totalReviews: 0, images: [], tags: [], hasActiveOffer: false,
};

describe("public listing options", () => {
  it("includes every hotel selection, including zero available rooms", () => {
    const options = getListingOptions({ ...listing, hotelDetails: {
      propertyType: "Resort", primaryRoomType: "Suite", roomTypes: ["Suite", "Double"],
      amenities: ["Pool", "WiFi", "Parking", "Gym"], availableRooms: 0,
      checkInTime: "14:00", checkOutTime: "11:00", pricePerNight: 100,
    } });
    expect(options).toEqual(expect.arrayContaining([
      { label: "Primary room type", value: "Suite" },
      { label: "Room types", value: "Suite, Double" },
      { label: "Amenities", value: "Pool, WiFi, Parking, Gym" },
      { label: "Rooms", value: "0" },
    ]));
    expect(options).toHaveLength(8);
  });

  it("includes restaurant table options and reservation rules", () => {
    expect(getListingOptions({ ...listing, type: "Restaurant", restaurantDetails: {
      cuisineType: "Italian", tableTypes: ["Outdoor", "Private"], tableCapacity: 20,
      openingHours: "09:00 - 22:00", averageCost: 200, reservationRules: "Arrive 10 minutes early",
    } })).toEqual(expect.arrayContaining([
      { label: "Table types", value: "Outdoor, Private" },
      { label: "Reservation rules", value: "Arrive 10 minutes early" },
    ]));
  });

  it("preserves all activity inclusions and age bounds", () => {
    const options = getListingOptions({ ...listing, type: "Activity", activityDetails: {
      activityType: "Hiking", durationHours: 2, difficultyLevel: "Easy", price: 0,
      minGroupSize: 1, maxGroupSize: 8, minAge: 0, maxAge: 80,
      includedServices: ["Guide", "Equipment"], safetyRequirements: "Wear boots", availabilitySchedule: "Weekends",
    } });
    expect(options).toContainEqual({ label: "Included services", value: "Guide, Equipment" });
    expect(options).toContainEqual({ label: "Minimum age", value: "0" });
    expect(options).toContainEqual({ label: "Activity price", value: "LKR 0" });
  });

  it("includes each ticket type with its price and quantity", () => {
    const options = getListingOptions({ ...listing, type: "Event", eventDetails: {
      eventName: "Music", organizer: "Organizer", dateAndTime: "2026-12-01T19:30:00", seatCount: 10, ticketPrice: 100,
      ticketTypes: [{ type: "VIP", quantity: 2, price: 250 }, { type: "General", quantity: 8, price: 100 }],
    } });
    expect(options).toContainEqual({ label: "Ticket 1", value: "VIP · LKR 250 · 2 tickets" });
    expect(options).toContainEqual({ label: "Ticket 2", value: "General · LKR 100 · 8 tickets" });
  });

  it("includes vehicle type, insurance, transmission and pickup options", () => {
    const options = getListingOptions({ ...listing, type: "CarRental", carRentalDetails: {
      brand: "Toyota", model: "RAV4", vehicleType: "SUV", transmission: "Automatic", pricePerDay: 100,
      seatCount: 5, fuelType: "Hybrid", availabilityStatus: "Available", insuranceOptions: "Full coverage",
      pickupLocation: "Airport", returnLocation: "City", hourlyRate: 20,
    } });
    expect(options).toContainEqual({ label: "Vehicle type", value: "SUV" });
    expect(options).toContainEqual({ label: "Insurance", value: "Full coverage" });
    expect(options).toContainEqual({ label: "Return", value: "City" });
  });

  it("omits missing details and inactive units without inventing defaults", () => {
    expect(getListingOptions(listing)).toEqual([]);
    expect(getListingOptions({ ...listing,
      bookableUnits: [
        { id: "1", name: "Suite 1", kind: "Generic", capacity: 2, isActive: true },
        { id: "2", name: "Closed room", kind: "Generic", capacity: 2, isActive: false },
      ], customFieldValues: [{ categoryCustomFieldId: "field", label: "View", value: "Sea" }],
    })).toEqual([
      { label: "View", value: "Sea" },
      { label: "Bookable option 1", value: "Suite 1 · Capacity: 2" },
    ]);
    expect(getListingPriceUnit({ ...listing, pricingUnit: "PerHour" })).toBe("hour");
  });
});
