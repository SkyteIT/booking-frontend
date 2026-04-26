// src/services/searchService.ts
import api from "./api";

export interface SearchParams {
  searchTerm?: string;
  location?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
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
  const { data } = await api.get<SearchListing[]>("/search/listings", { params });
  return data;
};