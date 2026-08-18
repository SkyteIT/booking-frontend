import type { Listing } from "../../Search/utils/types";

// What the quantity number actually means differs by category - it's
// never generically "guests" (for Hotel it's rooms, for CarRental
// there's no such concept at all, for Activity it must respect the
// vendor's own configured group-size bounds). Shared between
// BookingOptions (the picker) and PriceCard (the summary).
export function getQuantityConfig(listing: Listing) {
  switch (listing.type) {
    case "CarRental":
      return null; // no quantity control shown at all
    case "Hotel":
      return { label: "Number of Rooms", singular: "room", min: 1, max: Math.min(listing.availableRooms || 10, 10) };
    case "Restaurant":
      return { label: "Party Size", singular: "guest", min: 1, max: Math.min(listing.tableCapacity || 10, 20) };
    case "Event":
      return { label: "Number of Tickets", singular: "ticket", min: 1, max: 6 };
    case "Activity":
      return {
        label: "Participants",
        singular: "participant",
        min: listing.minGroupSize && listing.minGroupSize > 0 ? listing.minGroupSize : 1,
        max: listing.maxGroupSize && listing.maxGroupSize >= (listing.minGroupSize ?? 1) ? listing.maxGroupSize : 6,
      };
    default:
      return { label: "Quantity", singular: "guest", min: 1, max: 6 };
  }
}
