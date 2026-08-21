// src/pages/admin/contentManagement/services/contentService.ts

import api from "../../../../services/api";
import type { ListingType } from "../../../../services/Vendor/listingService";
import type { Category, Banner, Promotion } from "../types/contentType";

// ════════════════════════════════════════════════════════════
// CATEGORIES
// ════════════════════════════════════════════════════════════

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get("/categories");
  return data.map((c: any) => ({
    id: String(c.id),
    name: c.name,
    listings: c.listingCount ?? 0,
    status: c.status === "Active",
    icon: c.icon ?? "",
    type: c.type ?? null,
  }));
};

export const createCategory = async (payload: {
  name: string;
  description?: string;
  type: ListingType;
  bookingType?: string;
  serviceModel?: string;
  paymentCollectionModel?: string;
  dateSelectionEnabled?: boolean;
  timeSlotEnabled?: boolean;
  availabilityCalendarEnabled?: boolean;
  defaultCommissionPercent?: number;
  platformServiceFee?: number;
  taxApplicable?: boolean;
  icon?: string;
  bannerImageUrl?: string;
  displayOrder?: number;
  isFeatured?: boolean;
  requiresAdminApproval?: boolean;
  status?: string;
}): Promise<Category> => {
  const { data } = await api.post("/categories", {
    name: payload.name,
    description: payload.description,
    type: payload.type,
    bookingType: payload.bookingType,
    serviceModel: payload.serviceModel,
    dateSelectionEnabled: payload.dateSelectionEnabled,
    timeSlotEnabled: payload.timeSlotEnabled,
    availabilityCalendarEnabled: payload.availabilityCalendarEnabled,
    defaultCommissionPercent: payload.defaultCommissionPercent,
    platformServiceFee: payload.platformServiceFee,
    taxApplicable: payload.taxApplicable,
    icon: payload.icon,
    bannerImageUrl: payload.bannerImageUrl,
    displayOrder: payload.displayOrder,
    isFeatured: payload.isFeatured,
    requiresAdminApproval: payload.requiresAdminApproval,
    status: payload.status,
  });
  return {
    id: String(data.id),
    name: data.name,
    listings: data.listingCount ?? 0,
    status: data.status === "Active",
    icon: data.icon ?? "",
    type: data.type ?? null,
  };
};

export const updateCategory = async (
  id: string,
  payload: { name?: string; description?: string; icon?: string; type?: ListingType }
): Promise<Category> => {
  const { data } = await api.put(`/categories/${id}`, payload);
  return {
    id: String(data.id),
    name: data.name,
    listings: data.listingCount ?? 0,
    status: data.status === "Active",
    icon: data.icon ?? "",
    type: data.type ?? null,
  };
};

export const toggleCategoryStatus = async (id: string, isActive: boolean): Promise<void> => {
  await api.patch(`/categories/${id}/status`, { isActive });
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const { data } = await api.get(`/categories/${id}`);
    return {
      id: String(data.id),
      name: data.name ?? "",
      listings: data.listingCount ?? 0,
      status: data.status === "Active",
      icon: data.icon ?? "",
      type: data.type ?? null,
    };
  } catch {
    return null;
  }
};

export const updateCategoryFull = async (
  id: string,
  payload: { name: string; description?: string; icon?: string; status?: string; type?: ListingType }
): Promise<void> => {
  await api.put(`/categories/${id}`, {
    name: payload.name,
    description: payload.description ?? "",
    icon: payload.icon ?? "",
    status: payload.status,
    type: payload.type,
  });
};

// ════════════════════════════════════════════════════════════
// BANNERS  (unchanged)
// ════════════════════════════════════════════════════════════

export const PLACEMENT_OPTIONS = [
  { label: "Homepage Hero",   value: 1 },
  { label: "Homepage Banner", value: 2 },
  { label: "Category Pages",  value: 3 },
] as const;

export const placementLabel = (value: string | number): string => {
  if (typeof value === "string") {
    const n = value.trim().toLowerCase();
    if (n === "homepagehero")    return "Homepage Hero";
    if (n === "homepagebanner")  return "Homepage Banner";
    if (n === "categorypage")    return "Category Pages";
    if (n === "homepage hero")   return "Homepage Hero";
    if (n === "homepage banner") return "Homepage Banner";
    if (n === "category pages")  return "Category Pages";
    if (n === "category page")   return "Category Pages";
    return value;
  }
  return PLACEMENT_OPTIONS.find((p) => p.value === value)?.label ?? String(value);
};

const normalizeBanner = (b: any): Banner => ({
  id: String(b.id),
  title: b.title ?? "",
  description: b.subtitle ?? "",
  imageUrl: b.imageUrl ?? "",
  placement: placementLabel(b.placement),
  startDate: b.startDate?.slice(0, 10) ?? "",
  endDate:   b.endDate?.slice(0, 10)   ?? "",
  status: b.status === "Inactive" ? "Inactive" : "Active",
});

export const getBanners = async (): Promise<Banner[]> => {
  const { data } = await api.get("/banners");
  return data.map((b: any) => normalizeBanner(b));
};

export const getBannerById = async (id: string): Promise<Banner | null> => {
  try {
    const { data } = await api.get(`/banners/${id}`);
    return normalizeBanner(data);
  } catch {
    return null;
  }
};

export const createBanner = async (payload: {
  title: string;
  subtitle?: string;
  imageUrl: string;
  placement: number;
  startDate: string;
  endDate: string;
}): Promise<Banner> => {
  const { data } = await api.post("/banners", {
    title:     payload.title,
    subtitle:  payload.subtitle ?? "",
    imageUrl:  payload.imageUrl,
    placement: payload.placement,
    startDate: payload.startDate,
    endDate:   payload.endDate,
  });
  return normalizeBanner(data);
};

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
  const { data } = await api.put(`/banners/${id}`, {
    title:     payload.title,
    subtitle:  payload.subtitle ?? "",
    imageUrl:  payload.imageUrl,
    placement: payload.placement,
    startDate: payload.startDate,
    endDate:   payload.endDate,
    status:    payload.status === "Active" ? 1 : 0,
  });
  return normalizeBanner(data);
};

export const deleteBanner = async (id: string): Promise<void> => {
  await api.delete(`/banners/${id}`);
};

// ════════════════════════════════════════════════════════════
// PROMOTIONS
// ════════════════════════════════════════════════════════════

// Derive promotion status from dates — more reliable than trusting isActive alone.
//   endDate in the past        → "Expired"
//   isActive explicitly false  → "Draft"
//   startDate in the future    → "Draft"
//   otherwise                  → "Active"
const derivePromotionStatus = (
  startDate: string,
  endDate: string,
  isActive: boolean | undefined
): "Active" | "Expired" | "Draft" => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    if (end < today) return "Expired";
  }

  if (isActive === false) return "Draft";

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    if (start > today) return "Draft";
  }

  return "Active";
};

// FIX: normaliser now reads the corrected backend DTO field names:
//   p.code          (was p.code — backend now returns "code" not "promoCode")
//   p.promotionType (int 0/1 — backend now returns "promotionType" not "type")
//   p.discountValue (was p.discountValue — backend now returns "discountValue" not "value")
//   p.isActive      (bool — backend now returns "isActive" not "status" string)
const normalizePromotion = (p: any): Promotion => {
  const startDate = p.startDate?.slice(0, 10) ?? "";
  const endDate   = p.endDate?.slice(0, 10)   ?? "";

  return {
    id:         String(p.id),
    code:       p.code ?? "",
    type:       p.promotionType === 0 ? "Percentage" : "Fixed Amount",
    value:      Number(p.discountValue ?? 0),
    usageCount: p.usageCount ?? 0,
    usageLimit: p.usageLimit ?? null,
    startDate,
    endDate,
    status: derivePromotionStatus(startDate, endDate, p.isActive),
  };
};

export const getPromotions = async (): Promise<Promotion[]> => {
  const { data } = await api.get("/promotions");
  return data.map((p: any) => normalizePromotion(p));
};

// FIX: payload now uses the field names the backend CreatePromotionDto expects:
//   code          (was "code" but DTO had "PromoCode" — now both use "code")
//   promotionType (was "promotionType" but DTO had "Type" — now both use "promotionType")
//   discountValue (was "discountValue" but DTO had "Value" — now both use "discountValue")
export const createPromotion = async (payload: {
  code: string;
  promotionType: number;  // 0 = Percentage, 1 = Fixed Amount
  discountValue: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
}): Promise<Promotion> => {
  const { data } = await api.post("/promotions", {
    code:          payload.code,
    promotionType: payload.promotionType,
    discountValue: payload.discountValue,
    startDate:     payload.startDate,
    endDate:       payload.endDate,
    usageLimit:    payload.usageLimit,
  });
  return normalizePromotion(data);
};

export const deletePromotion = async (id: string): Promise<void> => {
  await api.delete(`/promotions/${id}`);
};

export const getPromotionById = async (id: string): Promise<Promotion | null> => {
  try {
    const { data } = await api.get(`/promotions/${id}`);
    return normalizePromotion(data);
  } catch {
    return null;
  }
};

// FIX: payload now uses field names the backend UpdatePromotionDto expects:
//   code          (was mapped as "code" → backend "PromoCode" — now both "code")
//   promotionType (was mapped as "promotionType" → backend "Type" — now both "promotionType")
//   discountValue (was mapped as "discountValue" → backend "Value" — now both "discountValue")
//   isActive      (was mapped as "isActive" bool → backend "Status" int — now both bool "isActive")
export const updatePromotion = async (
  id: string,
  payload: {
    promoCode: string;
    type: number;       // 0 = Percentage, 1 = Fixed Amount
    value: number;
    usageCount: number;
    usageLimit?: number;
    startDate: string;
    endDate: string;
    status: number;    // 1 = Active, 0 = Inactive
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
    isActive:      payload.status === 1,   // int → bool for backend
  });
};
