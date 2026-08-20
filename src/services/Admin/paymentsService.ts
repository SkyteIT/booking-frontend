import api from "../api";

export interface AdminRefundDto {
  id: string;
  paymentId: string;
  bookingNumber: string;
  customerName: string;
  vendorName: string;
  listingTitle: string;
  amount: number;
  reason: string;
  status: "Requested" | "Approved" | "Processed" | "Rejected";
  policyTierApplied: number;
  processedAt: string | null;
  createdAt: string;
}

export interface AdminDisputeDto {
  id: string;
  paymentId: string;
  bookingNumber: string;
  customerName: string;
  vendorName: string;
  amount: number;
  reason: string;
  disputeFeeAmount: number | null;
  externalDisputeReference: string | null;
  status: "Opened" | "Won" | "Lost" | "Withdrawn";
  openedAt: string;
  resolvedAt: string | null;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export const getRefunds = async (params: {
  status?: string;
  pageNumber?: number;
  pageSize?: number;
}) => {
  const res = await api.get<PagedResult<AdminRefundDto>>("/refunds", {
    params: {
      Status: params.status,
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
    },
  });
  return res.data;
};

export const approveRefund = async (id: string) => {
  const res = await api.put(`/refunds/${id}/approve`);
  return res.data;
};

// Backend binds this as [FromBody] string reason - the body must be a
// JSON string literal (quoted), not raw text, so it's explicitly
// JSON-encoded here rather than relying on axios's default object handling.
export const rejectRefund = async (id: string, reason: string) => {
  const res = await api.put(`/refunds/${id}/reject`, JSON.stringify(reason), {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const getDisputes = async (params: {
  status?: string;
  pageNumber?: number;
  pageSize?: number;
}) => {
  const res = await api.get<PagedResult<AdminDisputeDto>>("/payment-disputes", {
    params: {
      Status: params.status,
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
    },
  });
  return res.data;
};

export const recordDispute = async (payload: {
  paymentId: string;
  amount: number;
  reason: string;
  disputeFeeAmount?: number;
  externalDisputeReference?: string;
}) => {
  const res = await api.post("/payment-disputes", payload);
  return res.data;
};

export const resolveDispute = async (id: string, outcome: "Won" | "Lost" | "Withdrawn") => {
  const res = await api.post(`/payment-disputes/${id}/resolve`, { outcome });
  return res.data;
};
