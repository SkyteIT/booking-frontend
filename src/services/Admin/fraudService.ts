import api from "../api";

export type FraudRuleType = "BookingVelocity" | "NewAccountHighValue" | "RepeatedCancellations";
export type FraudFlagSeverity = "FlagOnly" | "Hold";
export type FraudFlagStatus = "Open" | "Cleared" | "ConfirmedFraud";

export interface AdminFraudFlagDto {
  id: string;
  bookingId: string;
  bookingNumber: string;
  listingTitle: string;
  customerName: string;
  ruleTriggered: FraudRuleType;
  severity: FraudFlagSeverity;
  details: string;
  status: FraudFlagStatus;
  createdAt: string;
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export const getFraudFlags = async (params: {
  status?: string;
  pageNumber?: number;
  pageSize?: number;
}) => {
  const res = await api.get<PagedResult<AdminFraudFlagDto>>("/admin/fraud-flags", {
    params: {
      Status: params.status,
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
    },
  });
  return res.data;
};

export const reviewFraudFlag = async (id: string, decision: "Clear" | "ConfirmFraud", notes?: string) => {
  const res = await api.post(`/admin/fraud-flags/${id}/review`, { decision, notes });
  return res.data;
};
