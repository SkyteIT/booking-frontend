import api from "../api";
import type { BookingDetailDto } from "./bookingService";

export interface CheckoutItemRequest {
  listingId: string;
  quantity: number;
  startDateTime: string;
  endDateTime: string;
  listingUnitId?: string | null;
}

export interface PaymentDto {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface CheckoutResultDto {
  bookings: BookingDetailDto[];
  payments: PaymentDto[];
}

export const checkout = async (
  items: CheckoutItemRequest[],
  idempotencyKey: string
): Promise<CheckoutResultDto> => {
  const res = await api.post<CheckoutResultDto>("/bookings/checkout", {
    items,
    idempotencyKey,
  });
  return res.data;
};
