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

const REAPPLICATION_ACKNOWLEDGEMENT_KEY = "vendor_reapplication_acknowledged";

export const acknowledgeRejectedVendorApplication = (applicationId: string) => {
  sessionStorage.setItem(REAPPLICATION_ACKNOWLEDGEMENT_KEY, applicationId);
};

export const hasAcknowledgedRejectedVendorApplication = (
  applicationId: string,
) => sessionStorage.getItem(REAPPLICATION_ACKNOWLEDGEMENT_KEY) === applicationId;

export const clearRejectedVendorApplicationAcknowledgement = () => {
  sessionStorage.removeItem(REAPPLICATION_ACKNOWLEDGEMENT_KEY);
};

// Self-service - null means the current user has never submitted an
// application.
export const getMyVendorApplicationStatus = async () => {
  const res = await api.get<MyVendorApplicationStatusDto | null>("/vendor-register/status");
  return res.data;
};
