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

type SearchListingPayload = Partial<SearchListing> & {
  primaryImage?: string | null;
  imageUrl?: string | null;
  coverImage?: string | null;
  images?: string[] | null;
};

const normalizeSearchListing = (listing: SearchListingPayload): SearchListing => ({
  id: String(listing.id ?? ""),
  title: listing.title ?? "",
  categoryName: listing.categoryName ?? "",
  location: listing.location ?? "",
  price: Number(listing.price ?? 0),
  averageRating: Number(listing.averageRating ?? 0),
  isFeatured: Boolean(listing.isFeatured),
  isActive: listing.isActive !== false,
  // Search DTOs and full listing DTOs have used different cover-image field
  // names. Prefer the explicit thumbnail, then the listing's uploaded cover.
  thumbnailUrl:
    listing.thumbnailUrl ??
    listing.primaryImage ??
    listing.imageUrl ??
    listing.coverImage ??
    listing.images?.find(Boolean) ??
    null,
  hasActiveOffer: Boolean(listing.hasActiveOffer),
  offerBadgeText: listing.offerBadgeText ?? null,
});

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

  const { data } = await api.get<SearchListingPayload[]>(`/search/listings?${qs.toString()}`, {
    headers: { "Content-Type": "application/json" },
    skipAuthRedirect: true,
  });
  return Array.isArray(data) ? data.map(normalizeSearchListing) : [];
};
