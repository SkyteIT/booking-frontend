import api from "../api";

export type OfferDiscountType = "PercentageDiscount" | "FixedAmountDiscount";

export interface ListingOfferDto {
  id: string;
  listingId: string;
  title: string;
  description: string;
  discountType: OfferDiscountType | null;
  discountValue: number | null;
  startDate: string; // "yyyy-MM-dd"
  endDate: string;
  isActive: boolean;
}

export interface CreateListingOfferRequest {
  title: string;
  description: string;
  discountType?: OfferDiscountType | null;
  discountValue?: number | null;
  startDate: string;
  endDate: string;
}

export const getListingOffers = async (listingId: string): Promise<ListingOfferDto[]> => {
  const res = await api.get<ListingOfferDto[]>(`/listings/${listingId}/offers`);
  return res.data;
};

export const createListingOffer = async (
  listingId: string,
  data: CreateListingOfferRequest
): Promise<ListingOfferDto> => {
  const res = await api.post<ListingOfferDto>(`/listings/${listingId}/offers`, data);
  return res.data;
};

export const deleteListingOffer = async (listingId: string, offerId: string): Promise<void> => {
  await api.delete(`/listings/${listingId}/offers/${offerId}`);
};
