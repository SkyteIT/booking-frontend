// Frontend mirror of the backend's BookingPricingRules.CalculateTotal
// (Ube.Application/Features/Bookings/BookingPricingRules.cs) — used by
// both the cart (CartContext) and the product page (PriceCard) so the
// live estimate a customer sees always matches what checkout charges.
// The backend remains the sole source of truth at checkout time; this
// is purely a preview.
export function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1; // At least 1 day
}

export function calculatePricingTotal(
  price: number,
  quantity: number,
  startDate: string,
  endDate: string,
  pricingUnit?: string
): number {
  switch (pricingUnit) {
    // A fixed price is per booking, not per person/unit - a table for 2
    // costs the same regardless of how many people actually show up.
    // PerPerson is the pricing unit for "each person pays their own way"
    // listings instead.
    case "FixedPrice":
      return price;
    case "PerPerson":
      return price * quantity;
    case "PerHour": {
      const hours = Math.max(
        1,
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60)
      );
      return price * quantity * hours;
    }
    case "PerNight":
    case "PerDay":
    default:
      return price * quantity * calculateDays(startDate, endDate);
  }
}
