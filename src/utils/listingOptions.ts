import type { ListingResponse } from "../services/Vendor/listingService";

export interface ListingOption {
  label: string;
  value: string;
}

// Keep the complete set of saved customer-facing choices. Missing values are
// omitted; zero is meaningful for prices, age limits, and capacities.
export function getListingOptions(listing: ListingResponse): ListingOption[] {
  const options: ListingOption[] = [];
  const add = (label: string, value: unknown) => {
    const text = Array.isArray(value)
      ? value.filter((item) => typeof item === "string" && item.trim()).join(", ")
      : value == null ? "" : String(value).trim();
    if (text) options.push({ label, value: text });
  };
  const money = (value?: number | null) => value == null ? undefined : `${listing.currency} ${value.toLocaleString()}`;

  switch (listing.type) {
    case "Hotel": {
      const hotel = listing.hotelDetails;
      if (!hotel) break;
      add("Property type", hotel.propertyType);
      add("Primary room type", hotel.primaryRoomType);
      add("Room types", hotel.roomTypes);
      add("Amenities", hotel.amenities);
      add("Rooms", hotel.availableRooms);
      add("Check-in", hotel.checkInTime);
      add("Check-out", hotel.checkOutTime);
      add("Price per night", money(hotel.pricePerNight));
      break;
    }
    case "Restaurant": {
      const restaurant = listing.restaurantDetails;
      if (!restaurant) break;
      add("Cuisine", restaurant.cuisineType);
      add("Table types", restaurant.tableTypes);
      add("Seating capacity", restaurant.tableCapacity);
      add("Opening hours", restaurant.openingHours);
      add("Average cost", money(restaurant.averageCost));
      add("Reservation rules", restaurant.reservationRules);
      break;
    }
    case "Activity": {
      const activity = listing.activityDetails;
      if (!activity) break;
      add("Activity", activity.activityType);
      add("Difficulty", activity.difficultyLevel);
      add("Included services", activity.includedServices);
      add("Duration", activity.durationHours == null ? undefined : `${activity.durationHours} hours`);
      add("Minimum group size", activity.minGroupSize);
      add("Maximum group size", activity.maxGroupSize);
      add("Minimum age", activity.minAge);
      add("Maximum age", activity.maxAge);
      add("Safety requirements", activity.safetyRequirements);
      add("Availability schedule", activity.availabilitySchedule);
      add("Activity price", money(activity.price));
      break;
    }
    case "Event": {
      const event = listing.eventDetails;
      if (!event) break;
      add("Event type", event.eventType);
      add("Venue", event.venueName);
      add("Venue address", event.venueAddress);
      add("Organizer", event.organizer);
      // Preserve venue-local time rather than converting it to the viewer's zone.
      add("Date and time", event.dateAndTime?.replace("T", " ").replace(/:00$/, ""));
      add("Seats", event.seatCount);
      add("Ticket price", money(event.ticketPrice));
      for (const [index, ticket] of (event.ticketTypes ?? []).entries()) {
        add(`Ticket ${index + 1}`, `${ticket.type} · ${money(ticket.price)} · ${ticket.quantity} tickets`);
      }
      break;
    }
    case "CarRental": {
      const car = listing.carRentalDetails;
      if (!car) break;
      add("Vehicle type", car.vehicleType);
      add("Brand", car.brand);
      add("Model", car.model);
      add("Transmission", car.transmission);
      add("Fuel", car.fuelType);
      add("Seats", car.seatCount);
      add("Year", car.year);
      add("Daily rate", money(car.pricePerDay));
      add("Hourly rate", money(car.hourlyRate));
      add("Pickup", car.pickupLocation);
      add("Return", car.returnLocation);
      add("Insurance", car.insuranceOptions);
      add("Availability", car.availabilityStatus);
      break;
    }
  }

  add("Tags", listing.tags);
  add("About this listing", listing.description);
  add("Cancellation policy", listing.cancellationPolicy);
  for (const field of listing.customFieldValues ?? []) add(field.label, field.value);
  for (const [index, unit] of (listing.bookableUnits ?? []).filter((unit) => unit.isActive).entries()) {
    add(`Bookable option ${index + 1}`, [
      unit.name,
      `Capacity: ${unit.capacity}`,
      unit.priceOverride == null ? undefined : money(unit.priceOverride),
      unit.slotStartTime ? `Starts: ${unit.slotStartTime}` : undefined,
      unit.slotDuration ? `Duration: ${unit.slotDuration}` : undefined,
    ].filter(Boolean).join(" · "));
  }
  return options;
}

export function getListingPriceUnit(listing?: ListingResponse): string | undefined {
  if (!listing) return undefined;
  const units: Record<string, string> = {
    PerNight: "night", PerHour: "hour", PerPerson: "person", PerDay: "day", FixedPrice: "booking",
  };
  if (listing.pricingUnit && units[listing.pricingUnit]) return units[listing.pricingUnit];
  return { Hotel: "night", Restaurant: "person", Activity: "session", Event: "ticket", CarRental: "day" }[listing.type];
}
