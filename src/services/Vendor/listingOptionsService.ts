import api from "../api";

export type BookingConfirmationType = "Instant" | "Request";

export interface ListingOptionValueDto {
  id: string;
  name: string;
  displayOrder: number;
  priceModifier: number;
  priceOverride?: number | null;
  confirmationTypeOverride?: BookingConfirmationType | null;
  requiresSeatSelection: boolean;
}

export interface ListingOptionGroupDto {
  id: string;
  listingId: string;
  name: string;
  displayOrder: number;
  values: ListingOptionValueDto[];
}

export const getOptionGroups = async (listingId: string): Promise<ListingOptionGroupDto[]> => {
  const res = await api.get<ListingOptionGroupDto[]>(`/listings/${listingId}/options`);
  return res.data;
};

export const addOptionGroup = async (
  listingId: string,
  data: { name: string; displayOrder?: number }
): Promise<ListingOptionGroupDto> => {
  const res = await api.post<ListingOptionGroupDto>(`/listings/${listingId}/options`, data);
  return res.data;
};

export const updateOptionGroup = async (
  listingId: string,
  groupId: string,
  data: { name?: string; displayOrder?: number }
): Promise<ListingOptionGroupDto> => {
  const res = await api.put<ListingOptionGroupDto>(`/listings/${listingId}/options/${groupId}`, data);
  return res.data;
};

export const deleteOptionGroup = async (listingId: string, groupId: string): Promise<void> => {
  await api.delete(`/listings/${listingId}/options/${groupId}`);
};

export const addOptionValue = async (
  listingId: string,
  groupId: string,
  data: { name: string; displayOrder?: number; priceModifier?: number; priceOverride?: number | null; confirmationTypeOverride?: BookingConfirmationType | null; requiresSeatSelection?: boolean }
): Promise<ListingOptionValueDto> => {
  const res = await api.post<ListingOptionValueDto>(`/listings/${listingId}/options/${groupId}/values`, data);
  return res.data;
};

export const updateOptionValue = async (
  listingId: string,
  groupId: string,
  valueId: string,
  data: {
    name?: string;
    displayOrder?: number;
    priceModifier?: number;
    priceOverride?: number | null;
    clearPriceOverride?: boolean;
    confirmationTypeOverride?: BookingConfirmationType | null;
    clearConfirmationTypeOverride?: boolean;
    requiresSeatSelection?: boolean;
  }
): Promise<ListingOptionValueDto> => {
  const res = await api.put<ListingOptionValueDto>(`/listings/${listingId}/options/${groupId}/values/${valueId}`, data);
  return res.data;
};

export const deleteOptionValue = async (listingId: string, groupId: string, valueId: string): Promise<void> => {
  await api.delete(`/listings/${listingId}/options/${groupId}/values/${valueId}`);
};
