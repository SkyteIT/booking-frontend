export type ListingCard = {
  id: string;
  name: string;
  bookedCount: number;
  blockedCount: number;
};

export type DayKind = "Available" | "Booked" | "Blocked" | "Selected";

export type DateOnly = string;

export type DateRange = {
  start: DateOnly; 
  end: DateOnly;   
};

export type BookingStatusCategory =
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Completed"
  | "Unknown";

export type BookingEvent = {
  id: string;
  listingId: string;
  listingTitle: string;
  customerName?: string;
  customerEmail?: string;
  start: string; 
  end: string;    
  status: BookingStatusCategory;
  totalAmount: number;
  currency: string;
};

export type BlockEvent = {
  id: string;
  listingId: string;
  range: DateRange;
};