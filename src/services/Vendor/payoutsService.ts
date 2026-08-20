import api from "../api";

export interface LedgerEntry {
  id: string;
  accountType: "Platform" | "Vendor";
  vendorProfileId: string | null;
  entryType:
    | "Charge"
    | "Commission"
    | "PlatformFee"
    | "Refund"
    | "AdvancePayout"
    | "Settlement"
    | "Clawback"
    | "InvoicePayment"
    | "Dispute"
    | "DisputeFee"
    | "DisputeReversal";
  direction: "Credit" | "Debit";
  amount: number;
  bookingId: string | null;
  bookingNumber: string | null;
  paymentId: string | null;
  refundId: string | null;
  payoutBatchId: string | null;
  vendorCommissionInvoiceId: string | null;
  createdAt: string;
}

export interface PayoutBatchDto {
  id: string;
  vendorProfileId: string;
  periodStart: string;
  periodEnd: string;
  totalAmount: number;
  status: "Pending" | "Processing" | "Settled" | "Exported";
  settledAt: string | null;
  createdAt: string;
}

export interface CommissionAcknowledgementDto {
  id: string;
  vendorProfileId: string;
  commissionPercentShown: number;
  sourceOverrideId: string | null;
  acknowledgedAt: string;
}

export interface PaymentDisputeDto {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  disputeFeeAmount: number | null;
  externalDisputeReference: string | null;
  status: "Opened" | "Won" | "Lost" | "Withdrawn";
  openedAt: string;
  resolvedAt: string | null;
  createdAt: string;
}

export const getLedger = async (): Promise<LedgerEntry[]> => {
  const res = await api.get<LedgerEntry[]>("/vendor/finance/ledger");
  return res.data;
};

export const getPayoutBatches = async (): Promise<PayoutBatchDto[]> => {
  const res = await api.get<PayoutBatchDto[]>("/vendor/finance/payout-batches");
  return res.data;
};

export const getCommissionAcknowledgements = async (): Promise<CommissionAcknowledgementDto[]> => {
  const res = await api.get<CommissionAcknowledgementDto[]>("/vendor/finance/commission-acknowledgements");
  return res.data;
};

export const acknowledgeCommissionRate = async (categoryId: string): Promise<CommissionAcknowledgementDto> => {
  const res = await api.post<CommissionAcknowledgementDto>("/vendor/finance/commission-acknowledgement", {
    categoryId,
  });
  return res.data;
};

export const getDisputes = async (): Promise<PaymentDisputeDto[]> => {
  const res = await api.get<PaymentDisputeDto[]>("/vendor/finance/disputes");
  return res.data;
};

export type ReportGranularity = "Daily" | "Weekly" | "Monthly";

export interface RevenuePeriodDto {
  periodStart: string;
  netRevenue: number;
  bookingCount: number;
}

export interface RevenueReportParams {
  startDate: string;
  endDate: string;
  granularity: ReportGranularity;
}

export const getRevenueReport = async (params: RevenueReportParams): Promise<RevenuePeriodDto[]> => {
  const res = await api.get<RevenuePeriodDto[]>("/vendor/dashboard/revenue-report", {
    params: {
      StartDate: params.startDate,
      EndDate: params.endDate,
      Granularity: params.granularity,
    },
  });
  return res.data;
};

// Fetches the server-generated CSV as a Blob - same pattern as
// adminService.exportBookingsCsv (needs responseType: "blob" or axios
// would try to parse the CSV text as JSON and fail).
export const exportRevenueReportCsv = async (params: RevenueReportParams): Promise<Blob> => {
  const res = await api.get("/vendor/dashboard/revenue-report/export", {
    params: {
      StartDate: params.startDate,
      EndDate: params.endDate,
      Granularity: params.granularity,
    },
    responseType: "blob",
  });
  return res.data as Blob;
};

// The literal "what's mine vs what I owe UBE" breakdown - every figure
// shown, not just a single net number.
export interface GrossCommissionRefundBreakdownDto {
  grossRevenue: number;
  platformCommission: number;
  refunds: number;
  netEarnings: number;
}

export interface BookingStatusBreakdownDto {
  pending: number;
  confirmed: number;
  rejected: number;
  cancelled: number;
  completed: number;
  total: number;
}

export interface ListingRevenueDto {
  listingId: string;
  listingTitle: string;
  grossRevenue: number;
  bookingCount: number;
}

export interface VendorEarningsDto {
  breakdown: GrossCommissionRefundBreakdownDto;
  revenueTrend: RevenuePeriodDto[];
  totalBookings: number;
  averageBookingValue: number;
  revenueChangePercent: number;
  statusBreakdown: BookingStatusBreakdownDto;
  topListings: ListingRevenueDto[];
}

export const getVendorEarnings = async (params: RevenueReportParams): Promise<VendorEarningsDto> => {
  const res = await api.get<VendorEarningsDto>("/vendor/dashboard/earnings", {
    params: {
      StartDate: params.startDate,
      EndDate: params.endDate,
      Granularity: params.granularity,
    },
  });
  return res.data;
};
