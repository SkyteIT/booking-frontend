import type { RawApiRecord } from "../../utils/types";
import api from "../api";

// Matches the backend's ApplicationTableDto exactly (GET /admin/vendor-applications) -
// the list view only gets a flat applicant name, not first/last separately.
export type VendorApplicationListItem = {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  status: string;
  submittedAt: string;
};

// Matches the backend's ApplicationDetailDto exactly (GET /admin/vendor-applications/{id}) -
// a materially different shape from the list DTO above, not a superset of it.
export type VendorApplicationDetail = {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  description: string;
  website?: string;
  taxId?: string;
  address: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  categories?: string;
  businessLicensePath?: string;
  insuranceCertificatePath?: string;
  taxDocumentPath?: string;
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
};

export type ReviewVendorApplicationPayload = {
  status: "Approved" | "Rejected";
  action: "approve" | "reject";
  rejectionReason?: string;
};

type GetVendorApplicationsParams = {
  status?: string;
  sortOptions?: string;
  search?: string;
  pageNumber?: number;
  pageSize?: number;
};

export const getVendorApplications = async ({
  status,
  sortOptions,
  search,
  pageNumber,
  pageSize,
}: GetVendorApplicationsParams = {}) => {
  const res = await api.get<VendorApplicationListItem[] | RawApiRecord>(
    "/admin/vendor-applications",
    {
      params: {
        status,
        SortOptions: sortOptions,
        Search: search,
        PageNumber: pageNumber,
        PageSize: pageSize,
      },
    }
  );

  return res.data;
};

export const reviewVendorApplication = async (id: string, status: "Approved" | "Rejected", reason?: string) => {
  const action = status === "Approved" ? "approve" : "reject";

  await api.patch(`/admin/vendor-applications/${id}/review`, {
    status,
    action,
    rejectionReason: reason,
  });
};
export const getVendorApplicationById = async (id: string) => {
  const res = await api.get<VendorApplicationDetail>(`/admin/vendor-applications/${id}`);
  return res.data;
};
