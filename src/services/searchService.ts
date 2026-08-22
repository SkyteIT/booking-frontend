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

type SearchListingPayload = Partial<SearchListing> & {
  primaryImage?: string | null;
  imageUrl?: string | null;
  coverImage?: string | null;
  images?: string[] | null;
};

export interface SearchListingsResult {
  items: SearchListing[];
  totalCount: number;
}

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

export const searchListings = async (params: SearchParams): Promise<SearchListingsResult> => {
export const searchListings = async (params: SearchParams): Promise<SearchListingsResult> => {
  const { categoryIds, ...rest } = params;
  const qs = new URLSearchParams();

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      // The search API accepts page sizes from 1 through 50. Keep every caller
      // within that contract even if it passes a stale or user-derived value.
      const queryValue = key === "pageSize" ? Math.min(50, Math.max(1, Number(value))) : value;
      qs.set(key, String(queryValue));
    }
  });

  if (categoryIds && categoryIds.length > 0) {
    categoryIds.forEach((id) => qs.append("categoryIds", id));
  }

  const { data } = await api.get<unknown>(`/search/listings?${qs.toString()}`, {
    headers: { "Content-Type": "application/json" },
    skipAuthRedirect: true,
  });

  // Support both the original array response and the paginated response used
  // by the current search endpoint. Previously, paginated data was discarded
  // as an empty array while the Explore hook expected { items, totalCount },
  // which caused the page to enter its failure state.
  if (Array.isArray(data)) {
    const items = data.map((item) => normalizeSearchListing(item as SearchListingPayload));
    return { items, totalCount: items.length };
  }

  if (data && typeof data === "object") {
    const payload = data as Record<string, unknown>;
    const rawItems = Array.isArray(payload.items)
      ? payload.items
      : Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.$values)
          ? payload.$values
          : [];
    const items = rawItems.map((item) => normalizeSearchListing(item as SearchListingPayload));
    const rawTotal = payload.totalCount ?? payload.total ?? payload.count;
    const parsedTotal = Number(rawTotal);

    return {
      items,
      totalCount: Number.isFinite(parsedTotal) ? parsedTotal : items.length,
    };
  }

  return { items: [], totalCount: 0 };
};
