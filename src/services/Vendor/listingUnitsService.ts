import api from "../api";

export type ListingUnitKind = "Generic" | "Seat" | "TimeSlot";

export interface ListingUnitDto {
  id: string;
  listingId: string;
  kind: ListingUnitKind;
  name: string;
  code?: string | null;
  description?: string | null;
  priceOverride?: number | null;
  capacity: number;
  rowIndex?: number | null;
  columnIndex?: number | null;
  slotStartTime?: string | null;
  slotDuration?: string | null;
  isActive: boolean;
  displayOrder: number;
}

export const getUnits = async (listingId: string): Promise<ListingUnitDto[]> => {
  const res = await api.get<ListingUnitDto[]>(`/listings/${listingId}/units`);
  return res.data;
};

export const addUnit = async (
  listingId: string,
  data: { name: string; description?: string; priceOverride?: number; capacity: number; displayOrder?: number }
): Promise<ListingUnitDto> => {
  const res = await api.post<ListingUnitDto>(`/listings/${listingId}/units`, data);
  return res.data;
};

export const addUnitsGrid = async (
  listingId: string,
  data: { rows: number; columns: number; rowLabels?: string[]; pricePerSeat?: number }
): Promise<ListingUnitDto[]> => {
  const res = await api.post<ListingUnitDto[]>(`/listings/${listingId}/units/bulk-grid`, data);
  return res.data;
};

export const addUnitsTimeSlots = async (
  listingId: string,
  data: {
    startTime: string; // "HH:mm:ss"
    endTime: string;
    slotDurationMinutes: number;
    capacityPerSlot: number;
    price?: number;
  }
): Promise<ListingUnitDto[]> => {
  const res = await api.post<ListingUnitDto[]>(`/listings/${listingId}/units/bulk-timeslots`, data);
  return res.data;
};

export const updateUnit = async (
  listingId: string,
  unitId: string,
  data: { name?: string; description?: string; priceOverride?: number; capacity?: number; isActive?: boolean; displayOrder?: number }
): Promise<ListingUnitDto> => {
  const res = await api.put<ListingUnitDto>(`/listings/${listingId}/units/${unitId}`, data);
  return res.data;
};

export const deleteUnit = async (listingId: string, unitId: string): Promise<void> => {
  await api.delete(`/listings/${listingId}/units/${unitId}`);
};

// Distinct unit ids already booked (Pending/Confirmed) for a date range -
// backs the seat map's "already taken" display.
export const getBookedUnitIds = async (
  listingId: string,
  start: string,
  end: string
): Promise<string[]> => {
  const res = await api.get<string[]>(`/listings/${listingId}/units/booked`, {
    params: { start, end },
  });
  return res.data;
};
