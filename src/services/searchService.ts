import api from "./api";

export interface SearchParams {
  searchTerm?: string;
  location?: string;
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  isAvailable?: boolean;
  page?: number;
  pageSize?: number;
}

export interface SearchListing {
  id: string;
  title: string;
  categoryName: string;
  location: string;
  priceFrom: number;
  rating: number;
  isFeatured: boolean;
  isAvailable: boolean;
  thumbnailUrl: string | null;
}

export const searchListings = async (params: SearchParams): Promise<SearchListing[]> => {
  const { categoryIds, ...rest } = params;
  const qs = new URLSearchParams();

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      qs.set(key, String(value));
    }
  });

  if (categoryIds && categoryIds.length > 0) {
    categoryIds.forEach((id) => qs.append("categoryIds", id));
  }

  const { data } = await api.get<SearchListing[]>(`/search/listings?${qs.toString()}`);
  return data;
};
