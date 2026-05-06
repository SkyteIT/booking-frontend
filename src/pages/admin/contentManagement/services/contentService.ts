// src/pages/admin/contentManagement/services/contentService.ts
// API service layer for the Content Management feature.
// All HTTP calls go through the shared `api` axios instance.
// Each function normalises raw backend shapes into the typed interfaces
// defined in contentType.ts so the rest of the app never sees raw API data.

import api from "../../../../services/api";
import type { Category, Banner, Promotion } from "../types/contentType";

// ════════════════════════════════════════════════════════════
// CATEGORIES
// ════════════════════════════════════════════════════════════

// Fetches all non-deleted, non-system categories ordered by displayOrder
export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get("/categories");
  return data.map((c: any) => ({
    id: String(c.id),
    name: c.name,
    listings: c.listingCount ?? 0,
    // API returns status as "Active" | "Inactive" string — normalise to boolean
    status: c.status === "Active",
    icon: c.icon ?? "",
  }));
};

// Creates a new category. Backend will automatically restore a previously
// soft-deleted category with the same name and re-link its orphaned listings.
export const createCategory = async (payload: {
  name: string;
  description?: string;
  bookingType?: string;
  serviceModel?: string;
  dateSelectionEnabled?: boolean;
  timeSlotEnabled?: boolean;
  availabilityCalendarEnabled?: boolean;
  defaultCommissionPercent?: number;
  platformServiceFee?: number;
  taxApplicable?: boolean;
  icon?: string;
  displayOrder?: number;
  isFeatured?: boolean;
  requiresAdminApproval?: boolean;
  status?: string;
}): Promise<Category> => {
  const { data } = await api.post("/categories", payload);
  return {
    id: String(data.id),
    name: data.name,
    listings: data.listingCount ?? 0,
    status: data.status === "Active",
    icon: data.icon ?? "",
  };
};

// Partial update — used by the EditCategory modal (name, description, icon)
export const updateCategory = async (
  id: string,
  payload: { name?: string; description?: string; icon?: string }
): Promise<Category> => {
  const { data } = await api.put(`/categories/${id}`, payload);
  return {
    id: String(data.id),
    name: data.name,
    listings: data.listingCount ?? 0,
    status: data.status === "Active",
    icon: data.icon ?? "",
  };
};

// PATCH endpoint — toggles Active ↔ Inactive without touching other fields
export const toggleCategoryStatus = async (id: string, isActive: boolean): Promise<void> => {
  await api.patch(`/categories/${id}/status`, { isActive });
};

// Soft-deletes the category on the backend (sets Status = Deleted).
// Listings are moved to __Uncategorized__ and can be restored later.
export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

// Fetches a single category by id — returns null on 404 / error
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const { data } = await api.get(`/categories/${id}`);
    return {
      id: String(data.id),
      name: data.name ?? "",
      listings: data.listingCount ?? 0,
      status: data.status === "Active",
      icon: data.icon ?? "",
    };
  } catch {
    return null;
  }
};

// Full update used by EditCategory — sends all editable fields in one PUT
export const updateCategoryFull = async (
  id: string,
  payload: {
    name: string;
    description?: string;
    icon?: string;
    status?: string;
  }
): Promise<void> => {
  await api.put(`/categories/${id}`, {
    name: payload.name,
    description: payload.description ?? "",
    icon: payload.icon ?? "",
    status: payload.status,
  });
};

// ════════════════════════════════════════════════════════════
// BANNERS
// ════════════════════════════════════════════════════════════

// Enum mapping: backend int → human-readable label used throughout the UI.
// value matches the integer sent to / received from the backend Placement enum.
export const PLACEMENT_OPTIONS = [
  { label: "Homepage Hero",   value: 1 },
  { label: "Homepage Banner", value: 2 },
  { label: "Category Pages",  value: 3 },
] as const;

// Normalises whatever the backend returns for placement (int, enum string,
// or already-human-readable label) into one of the three display strings.
export const placementLabel = (value: string | number): string => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "homepagehero")    return "Homepage Hero";
    if (normalized === "homepagebanner")  return "Homepage Banner";
    if (normalized === "categorypage")    return "Category Pages";
    if (normalized === "homepage hero")   return "Homepage Hero";
    if (normalized === "homepage banner") return "Homepage Banner";
    if (normalized === "category pages")  return "Category Pages";
    if (normalized === "category page")   return "Category Pages";
    return value; // Return as-is if unrecognised
  }
  return PLACEMENT_OPTIONS.find((p) => p.value === value)?.label ?? String(value);
};

// Shared normaliser — converts raw API banner shape → typed Banner interface
const normalizeBanner = (b: any): Banner => ({
  id: String(b.id),
  title: b.title ?? "",
  description: b.subtitle ?? "",    // Backend field is "subtitle"
  imageUrl: b.imageUrl ?? "",
  placement: placementLabel(b.placement),
  startDate: b.startDate?.slice(0, 10) ?? "", // Trim time part if present
  endDate:   b.endDate?.slice(0, 10)   ?? "",
  status: b.status === "Inactive" ? "Inactive" : "Active",
});

// Fetches all banners
export const getBanners = async (): Promise<Banner[]> => {
  const { data } = await api.get("/banners");
  return data.map((b: any) => normalizeBanner(b));
};

// Fetches a single banner by id — returns null on 404 / error
export const getBannerById = async (id: string): Promise<Banner | null> => {
  try {
    const { data } = await api.get(`/banners/${id}`);
    return normalizeBanner(data);
  } catch {
    return null;
  }
};

// Creates a banner. imageUrl can be a base64 data-URI or a CDN URL.
export const createBanner = async (payload: {
  title: string;
  subtitle?: string;
  imageUrl: string;
  placement: number; // int matching backend BannerPlacement enum
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
}): Promise<Banner> => {
  const requestBody = {
    title:     payload.title,
    subtitle:  payload.subtitle ?? "",
    imageUrl:  payload.imageUrl,
    placement: payload.placement,
    startDate: payload.startDate,
    endDate:   payload.endDate,
  };
  const { data } = await api.post("/banners", requestBody);
  return normalizeBanner(data);
};

// Updates an existing banner. Status is sent as int (1 = Active, 0 = Inactive)
// to match the backend enum expected by the PUT endpoint.
export const updateBanner = async (
  id: string,
  payload: {
    title: string;
    subtitle?: string;
    imageUrl: string;
    placement: number;
    startDate: string;
    endDate: string;
    status: "Active" | "Inactive";
  }
): Promise<Banner> => {
  const requestBody = {
    title:     payload.title,
    subtitle:  payload.subtitle ?? "",
    imageUrl:  payload.imageUrl,
    placement: payload.placement,
    startDate: payload.startDate,
    endDate:   payload.endDate,
    status:    payload.status === "Active" ? 1 : 0, // Convert to int enum
  };
  const { data } = await api.put(`/banners/${id}`, requestBody);
  return normalizeBanner(data);
};

// Hard-deletes a banner
export const deleteBanner = async (id: string): Promise<void> => {
  await api.delete(`/banners/${id}`);
};

// ════════════════════════════════════════════════════════════
// PROMOTIONS
// ════════════════════════════════════════════════════════════

// Fetches all promotions. isActive → "Active" | "Expired" status string.
export const getPromotions = async (): Promise<Promotion[]> => {
  const { data } = await api.get("/promotions");
  return data.map((p: any) => ({
    id: String(p.id),
    code: p.code,
    // Backend promotionType: 0 = Percentage, 1 = Fixed Amount
    type: p.promotionType === 0 ? "Percentage" : "Fixed Amount",
    value: p.discountValue,
    usageCount: p.usageCount ?? 0,
    usageLimit: p.usageLimit ?? null, // null means unlimited
    startDate: p.startDate?.slice(0, 10) ?? "",
    endDate:   p.endDate?.slice(0, 10)   ?? "",
    status: p.isActive ? "Active" : "Expired",
  }));
};

// Creates a promotion. Only the fields required by CreatePromotionDto are sent.
export const createPromotion = async (payload: {
  code: string;
  promotionType: number; // 0 = Percentage, 1 = Fixed Amount
  discountValue: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;   // Omit or undefined = unlimited
}): Promise<Promotion> => {
  const { data } = await api.post("/promotions", payload);
  return {
    id: String(data.id),
    code: data.code,
    type: data.promotionType === 0 ? "Percentage" : "Fixed Amount",
    value: data.discountValue,
    usageCount: 0, // Newly created — no uses yet
    usageLimit: data.usageLimit ?? null,
    startDate: data.startDate?.slice(0, 10) ?? "",
    endDate:   data.endDate?.slice(0, 10)   ?? "",
    status: "Active",
  };
};

// Hard-deletes a promotion
export const deletePromotion = async (id: string): Promise<void> => {
  await api.delete(`/promotions/${id}`);
};

// Fetches a single promotion by id — returns null on 404 / error
export const getPromotionById = async (id: string): Promise<Promotion | null> => {
  try {
    const { data } = await api.get(`/promotions/${id}`);
    return {
      id: String(data.id),
      code: data.code,
      type: data.promotionType === 0 ? "Percentage" : "Fixed Amount",
      value: data.discountValue,
      usageCount: data.usageCount ?? 0,
      usageLimit: data.usageLimit ?? null,
      startDate: data.startDate?.slice(0, 10) ?? "",
      endDate:   data.endDate?.slice(0, 10)   ?? "",
      status: data.isActive ? "Active" : "Expired",
    };
  } catch {
    return null;
  }
};

// Updates an existing promotion.
// `status` is sent as int (1 = Active, 0 = Inactive) to match the backend enum.
// `usageCount` must be echoed back because the backend PUT replaces the whole record.
export const updatePromotion = async (
  id: string,
  payload: {
    promoCode: string;
    type: number;        // 0 = Percentage, 1 = Fixed Amount
    value: number;
    usageCount: number;  // Echo server value — not editable in the UI
    usageLimit?: number; // undefined = unlimited
    startDate: string;
    endDate: string;
    status: number;      // 1 = Active, 0 = Inactive
  }
): Promise<void> => {
  await api.put(`/promotions/${id}`, {
    code:          payload.promoCode,
    promotionType: payload.type,
    discountValue: payload.value,
    usageCount:    payload.usageCount,
    usageLimit:    payload.usageLimit ?? null,
    startDate:     payload.startDate,
    endDate:       payload.endDate,
    isActive:      payload.status === 1, // Convert int back to bool for backend
  });
};