import api from "./api";

export interface SearchParams {
  searchTerm?: string;
  location?: string;
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  isAvailable?: boolean;
  hasActiveOffer?: boolean;
  page?: number;
  pageSize?: number;
}

// Matches Ube.Application.Features.Search.SearchListingDto exactly — this
// used to declare priceFrom/rating/isAvailable, none of which the backend
// ever sends (it sends price/averageRating/isActive), so every listing
// silently rendered "$undefined" and a 0 rating until this was caught.
export interface SearchListing {
  id: string;
  title: string;
  categoryName: string;
  location: string;
  price: number;
  averageRating: number;
  isFeatured: boolean;
  isActive: boolean;
  thumbnailUrl: string | null;
  hasActiveOffer: boolean;
  offerBadgeText: string | null;
}

export interface SearchListingsResult {
  items: SearchListing[];
  totalCount: number;
}

export const searchListings = async (params: SearchParams): Promise<SearchListingsResult> => {
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

  const { data } = await api.get<{ items: SearchListing[]; totalCount: number }>(`/search/listings?${qs.toString()}`, {
    headers: { "Content-Type": "application/json" },
    skipAuthRedirect: true,
  });
  return { items: data.items, totalCount: data.totalCount };
};
