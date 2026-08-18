import api from "../api";

export type SeasonalRateAdjustmentType = "PercentageAdjustment" | "FixedRate";

export interface SeasonalPricingRuleDto {
  id: string;
  listingId: string;
  listingUnitId?: string | null;
  name: string;
  startDate: string; // "yyyy-MM-dd"
  endDate: string;
  adjustmentType: SeasonalRateAdjustmentType;
  adjustmentValue: number;
  isActive: boolean;
}

export interface CreateSeasonalPricingRuleRequest {
  listingUnitId?: string;
  name: string;
  startDate: string;
  endDate: string;
  adjustmentType: SeasonalRateAdjustmentType;
  adjustmentValue: number;
}

export interface PriceQuoteDto {
  totalAmount: number;
  currency: string;
}

export const getSeasonalRules = async (listingId: string): Promise<SeasonalPricingRuleDto[]> => {
  const res = await api.get<SeasonalPricingRuleDto[]>(`/listings/${listingId}/seasonal-rates`);
  return res.data;
};

export const createSeasonalRule = async (
  listingId: string,
  data: CreateSeasonalPricingRuleRequest
): Promise<SeasonalPricingRuleDto> => {
  const res = await api.post<SeasonalPricingRuleDto>(`/listings/${listingId}/seasonal-rates`, data);
  return res.data;
};

export const deleteSeasonalRule = async (listingId: string, ruleId: string): Promise<void> => {
  await api.delete(`/listings/${listingId}/seasonal-rates/${ruleId}`);
};

export const getPriceQuote = async (
  listingId: string,
  params: { startDate: string; endDate: string; unitId?: string; quantity?: number }
): Promise<PriceQuoteDto> => {
  const res = await api.get<PriceQuoteDto>(`/listings/${listingId}/price-quote`, {
    params: {
      startDate: params.startDate,
      endDate: params.endDate,
      unitId: params.unitId,
      quantity: params.quantity,
    },
  });
  return res.data;
};
