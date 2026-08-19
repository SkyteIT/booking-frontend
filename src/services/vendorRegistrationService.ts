import api from "./api";

export type VendorApplicationStatus = "Pending" | "Approved" | "Rejected";

export interface MyVendorApplicationStatusDto {
  id: string;
  businessName: string;
  status: VendorApplicationStatus;
  submittedAt: string;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
}

// Self-service - null means the current user has never submitted an
// application.
export const getMyVendorApplicationStatus = async () => {
  const res = await api.get<MyVendorApplicationStatusDto | null>("/vendor-register/status");
  return res.data;
};
