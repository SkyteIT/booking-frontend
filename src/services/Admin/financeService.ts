// src/services/Admin/financeService.ts
import api from "../api";

// ── Vendors ──────────────────────────────────────────────────────────────
export interface AdminVendorSummaryDto {
  vendorProfileId: string;
  businessName: string;
  userId: string;
  ownerName: string;
  ownerEmail: string;
  isActive: boolean;
}

export const getAllVendors = async (): Promise<AdminVendorSummaryDto[]> => {
  const res = await api.get<AdminVendorSummaryDto[]>("/admin/vendors");
  return res.data;
};

// ── Payout batches ───────────────────────────────────────────────────────
export type PayoutBatchStatus = "Pending" | "Settled";

export interface PayoutBatchDto {
  id: string;
  vendorProfileId: string;
  periodStart: string;
  periodEnd: string;
  totalAmount: number;
  status: PayoutBatchStatus;
  settledAt: string | null;
  createdAt: string;
}

export const computePayoutBatch = async (payload: {
  vendorProfileId: string;
  periodStart: string;
  periodEnd: string;
}): Promise<PayoutBatchDto> => {
  const res = await api.post<PayoutBatchDto>("/payout-batches/compute", payload);
  return res.data;
};

export const settlePayoutBatch = async (id: string): Promise<PayoutBatchDto> => {
  const res = await api.post<PayoutBatchDto>(`/payout-batches/${id}/settle`);
  return res.data;
};

export const getPayoutBatchesForVendor = async (vendorProfileId: string): Promise<PayoutBatchDto[]> => {
  const res = await api.get<PayoutBatchDto[]>(`/payout-batches/vendor/${vendorProfileId}`);
  return res.data;
};

// ── Payout export (maker-checker) ───────────────────────────────────────
export type PayoutExportStatus = "PendingApproval" | "PendingSeniorApproval" | "Approved" | "Rejected";

export interface PayoutExportRunDto {
  id: string;
  batchIds: string[];
  totalAmount: number;
  status: PayoutExportStatus;
  requestedByUserId: string;
  requestedAt: string;
  approvedByUserId: string | null;
  approvedAt: string | null;
  secondApprovedByUserId: string | null;
  secondApprovedAt: string | null;
  fileChecksum: string | null;
}

export interface PayoutExportApprovalResult {
  run: PayoutExportRunDto;
  fileDownloaded: boolean;
}

export const requestPayoutExport = async (): Promise<PayoutExportRunDto> => {
  const res = await api.post<PayoutExportRunDto>("/payout-batches/export/request");
  return res.data;
};

// Visible to any admin, not just whoever's browser requested it - a
// second (and possibly third) admin needs to be able to discover and act
// on a run someone else started.
export const getPendingPayoutExports = async (): Promise<PayoutExportRunDto[]> => {
  const res = await api.get<PayoutExportRunDto[]>("/payout-batches/export/pending");
  return res.data;
};

// The approve endpoint returns either a CSV file (export finished) or a
// JSON run status (export now needs a senior approval) depending on
// whether the total is over the configured threshold - fetched as a blob
// either way so the CSV bytes are never mangled, then branched on the
// actual content-type to decide how to interpret it.
async function handleExportFileOrRun(id: string): Promise<PayoutExportApprovalResult> {
  const res = await api.post(`/payout-batches/export/${id}/approve`, null, { responseType: "blob" });
  const contentType = String(res.headers["content-type"] ?? "");
  const blob = res.data as Blob;

  if (contentType.includes("text/csv")) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payout-export-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    return { run: {} as PayoutExportRunDto, fileDownloaded: true };
  }

  const run = JSON.parse(await blob.text()) as PayoutExportRunDto;
  return { run, fileDownloaded: false };
}

export const approvePayoutExport = async (id: string): Promise<PayoutExportApprovalResult> =>
  handleExportFileOrRun(id);

export const seniorApprovePayoutExport = async (id: string): Promise<Blob> => {
  const res = await api.post(`/payout-batches/export/${id}/senior-approve`, null, { responseType: "blob" });
  return res.data as Blob;
};

export const rejectPayoutExport = async (id: string): Promise<PayoutExportRunDto> => {
  const res = await api.post<PayoutExportRunDto>(`/payout-batches/export/${id}/reject`);
  return res.data;
};

export interface PayoutExportThresholdDto {
  largeExportThreshold: number;
  updatedByUserId: string | null;
  updatedAt: string | null;
}

export const getPayoutExportThreshold = async (): Promise<PayoutExportThresholdDto> => {
  const res = await api.get<PayoutExportThresholdDto>("/payout-batches/export/threshold");
  return res.data;
};

// ── Vendor invoices ──────────────────────────────────────────────────────
export type VendorInvoiceStatus = "Pending" | "Paid" | "Overdue";

export interface VendorInvoiceDto {
  id: string;
  vendorProfileId: string;
  periodStart: string;
  periodEnd: string;
  amountOwed: number;
  dueDate: string;
  status: VendorInvoiceStatus;
  resolvedAt: string | null;
  createdAt: string;
}

export const computeVendorInvoice = async (payload: {
  vendorProfileId: string;
  periodStart: string;
  periodEnd: string;
  gracePeriodDays: number;
}): Promise<VendorInvoiceDto> => {
  const res = await api.post<VendorInvoiceDto>("/vendor-invoices/compute", payload);
  return res.data;
};

export const markInvoicePaid = async (id: string): Promise<VendorInvoiceDto> => {
  const res = await api.post<VendorInvoiceDto>(`/vendor-invoices/${id}/mark-paid`);
  return res.data;
};

export const markInvoiceOverdue = async (id: string): Promise<VendorInvoiceDto> => {
  const res = await api.post<VendorInvoiceDto>(`/vendor-invoices/${id}/mark-overdue`);
  return res.data;
};

export const processOverdueInvoices = async (): Promise<VendorInvoiceDto[]> => {
  const res = await api.post<VendorInvoiceDto[]>("/vendor-invoices/process-overdue");
  return res.data;
};

export const getInvoicesForVendor = async (vendorProfileId: string): Promise<VendorInvoiceDto[]> => {
  const res = await api.get<VendorInvoiceDto[]>(`/vendor-invoices/vendor/${vendorProfileId}`);
  return res.data;
};

// ── Commission policy ────────────────────────────────────────────────────
export type CommissionOverrideStatus = "Active" | "Revoked";

export interface VendorCommissionOverrideDto {
  id: string;
  vendorProfileId: string;
  categoryId: string | null;
  commissionPercent: number;
  startDate: string;
  endDate: string | null;
  reason: string;
  status: CommissionOverrideStatus;
  createdByUserId: string;
  createdAt: string;
  revokedByUserId: string | null;
  revokedAt: string | null;
}

export const createCommissionOverride = async (payload: {
  vendorProfileId: string;
  categoryId?: string;
  commissionPercent: number;
  startDate: string;
  endDate?: string;
  reason: string;
}): Promise<VendorCommissionOverrideDto> => {
  const res = await api.post<VendorCommissionOverrideDto>("/commission-policy/overrides", payload);
  return res.data;
};

export const revokeCommissionOverride = async (id: string): Promise<VendorCommissionOverrideDto> => {
  const res = await api.post<VendorCommissionOverrideDto>(`/commission-policy/overrides/${id}/revoke`);
  return res.data;
};

export const getOverridesForVendor = async (vendorProfileId: string): Promise<VendorCommissionOverrideDto[]> => {
  const res = await api.get<VendorCommissionOverrideDto[]>(`/commission-policy/overrides/vendor/${vendorProfileId}`);
  return res.data;
};

export interface LoyaltyDiscountTierDto {
  id: string;
  monthsActive: number;
  discountPercent: number;
  createdAt: string;
  updatedAt: string | null;
}

export const getLoyaltyTiers = async (): Promise<LoyaltyDiscountTierDto[]> => {
  const res = await api.get<LoyaltyDiscountTierDto[]>("/commission-policy/loyalty-tiers");
  return res.data;
};

export const createLoyaltyTier = async (payload: {
  monthsActive: number;
  discountPercent: number;
}): Promise<LoyaltyDiscountTierDto> => {
  const res = await api.post<LoyaltyDiscountTierDto>("/commission-policy/loyalty-tiers", payload);
  return res.data;
};

export const updateLoyaltyTier = async (id: string, discountPercent: number): Promise<LoyaltyDiscountTierDto> => {
  const res = await api.put<LoyaltyDiscountTierDto>(`/commission-policy/loyalty-tiers/${id}`, { discountPercent });
  return res.data;
};

export const deleteLoyaltyTier = async (id: string): Promise<void> => {
  await api.delete(`/commission-policy/loyalty-tiers/${id}`);
};
