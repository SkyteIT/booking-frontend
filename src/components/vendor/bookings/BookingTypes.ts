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
  listingId: string;
  listingTitle: string;

  customerId: string;
  customerName: string;
  customerEmail: string;

  startDateTime: string;
  endDateTime: string;

  bookingStatus: BookingStatus | number;
  statusLabel: string;
  statusCategory: StatusCategory;

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
