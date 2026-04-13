const API_BASE_URL = "http://localhost:5037/api";

export interface CreateListingRequest {
  vendorId: string;
  categoryId: string;
  title: string;
  description?: string;
  basePrice: number;
  currency: string;
  location?: string;
}

export const createListing = async (data: CreateListingRequest) => {
  const response = await fetch(`${API_BASE_URL}/Listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to create listing");
  }

  return response.json();
};