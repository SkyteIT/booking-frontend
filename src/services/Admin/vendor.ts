import type { RawApiRecord } from "../../utils/types";
import api from "../api";

export type VendorApplication = {
  id: string;
  applicationId?: string;
  vendorApplicationId?: string;
  userName: string;
  contactPersonName?: string;
  contactNumber: string;
  businessName: string;
  businessType: string;
  address?: string;
  description?: string;
  businessLicenseUrl?: string;
  insurenceCertificateUrl?: string;
  taxDocumentUrl?: string;
  submittedAt: string;
  reviewedAt?: string;
  status: string;
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
  const res = await api.get<VendorApplication[] | RawApiRecord>(
    "/api/admin/vendor-applications",
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

export const reviewVendorApplication = async (id: string, status: string, Reason?: string) => {
  await api.patch(`/api/admin/vendor-applications/${id}/review`, {
    status,
    rejectedReason: Reason,
  });
};
export const getVendorApplicationById = async (id: string) => {
  const res = await api.get<VendorApplication>(`/api/admin/vendor-applications/${id}`);
  return res.data;
};

