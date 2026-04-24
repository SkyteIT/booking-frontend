const API_BASE_URL = "http://localhost:5037/api";

export interface CreateVendorApplicationRequest {
  userId: string;
  businessName: string;
  businessType: string;
  description: string;
  contactNumber: string;
  taxId?: string;
  website?: string;
  address?: string;
  businessLicenseUrl?: string;
  insuranceCertificateUrl?: string;
  taxDocumentUrl?: string;
  categories: string[];
}

export const submitVendorApplication = async (data: CreateVendorApplicationRequest) => {
  const response = await fetch(`${API_BASE_URL}/VendorApplications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to submit application");
  }

  return response.json();
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/Users/me`);
  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }
  return response.json();
};
