export type StatusCategory =
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Completed"
  | "Unknown";

  export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "ModifiedPendingVendor"
  | "CancelledByUser"
  | "CancelledByVendorEmergency"
  | "Completed";

export type VendorBookingDto = {
  bookingId: string;
  bookingNumber: string;
  listingTitle: string;
  customerName: string;

  startDateTime: string;
  endDateTime: string;

  status: string; // enum from backend
  totalAmount: number;
  currency: string;

  createdAt: string;
};

export type PageResult<T> = {
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};
