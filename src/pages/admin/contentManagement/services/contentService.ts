import api from "../../../../services/api";
import type { Category, Banner, Promotion } from "../types/contentType";

// Categories

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get("/categories");
  return data.map((c: any) => ({
    id: String(c.id),
    name: c.name,
    listings: 0,
    status: c.isActive ?? false,
    icon: c.iconUrl ?? "",
  }));
};

export const createCategory = async (payload: {
  name: string;
  description?: string;
  iconUrl?: string;
}): Promise<Category> => {
  const { data } = await api.post("/categories", payload);
  return {
    id: String(data.id),
    name: data.name,
    listings: 0,
    status: data.isActive ?? false,
    icon: data.iconUrl ?? "",
  };
};

export const updateCategory = async (
  id: string,
  payload: { name?: string; description?: string; iconUrl?: string }
): Promise<Category> => {
  const { data } = await api.put(`/categories/${id}`, payload);
  return {
    id: String(data.id),
    name: data.name,
    listings: 0,
    status: data.isActive ?? false,
    icon: data.iconUrl ?? "",
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
      listings: 0,
      status: data.isActive ?? false,
      icon: data.iconUrl ?? "",
    };
  } catch {
    return null;
  }
};

export const updateCategoryFull = async (
  id: string,
  payload: {
    name: string;
    description?: string;
    iconUrl?: string;
    isActive?: boolean;
  }
): Promise<void> => {
  await api.put(`/categories/${id}`, {
    name: payload.name,
    description: payload.description ?? "",
    iconUrl: payload.iconUrl ?? "",
    isActive: payload.isActive,
  });
};

// Banners

export const PLACEMENT_OPTIONS = [
  { label: "Homepage Hero", value: 1 },
  { label: "Homepage Banner", value: 2 },
  { label: "Category Pages", value: 3 },
] as const;

export const placementLabel = (value: string | number): string => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "homepagehero") return "Homepage Hero";
    if (normalized === "homepagebanner") return "Homepage Banner";
    if (normalized === "categorypage") return "Category Pages";
    if (normalized === "homepage hero") return "Homepage Hero";
    if (normalized === "homepage banner") return "Homepage Banner";
    if (normalized === "category pages") return "Category Pages";
    if (normalized === "category page") return "Category Pages";
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
  endDate: b.endDate?.slice(0, 10) ?? "",
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
  const requestBody = {
    title: payload.title,
    subtitle: payload.subtitle ?? "",
    imageUrl: payload.imageUrl,
    placement: payload.placement,
    startDate: payload.startDate,
    endDate: payload.endDate,
  };

  const { data } = await api.post("/banners", requestBody);
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
  const requestBody = {
    title: payload.title,
    subtitle: payload.subtitle ?? "",
    imageUrl: payload.imageUrl,
    placement: payload.placement,
    startDate: payload.startDate,
    endDate: payload.endDate,
    status: payload.status === "Active" ? 1 : 0,
  };

  const { data } = await api.put(`/banners/${id}`, requestBody);
  return normalizeBanner(data);
};

export const deleteBanner = async (id: string): Promise<void> => {
  await api.delete(`/banners/${id}`);
};

// Promotions

export const getPromotions = async (): Promise<Promotion[]> => {
  const { data } = await api.get("/promotions");
  return data.map((p: any) => ({
    id: String(p.id),
    code: p.code,
    type: p.promotionType === 0 ? "Percentage" : "Fixed Amount",
    value: p.discountValue,
    usageCount: p.usageCount ?? 0,
    usageLimit: p.usageLimit ?? null,
    startDate: p.startDate?.slice(0, 10) ?? "",
    endDate: p.endDate?.slice(0, 10) ?? "",
    status: p.isActive ? "Active" : "Expired",
  }));
};

export const createPromotion = async (payload: {
  code: string;
  promotionType: number;
  discountValue: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
}): Promise<Promotion> => {
  const { data } = await api.post("/promotions", payload);
  return {
    id: String(data.id),
    code: data.code,
    type: data.promotionType === 0 ? "Percentage" : "Fixed Amount",
    value: data.discountValue,
    usageCount: 0,
    usageLimit: data.usageLimit ?? null,
    startDate: data.startDate?.slice(0, 10) ?? "",
    endDate: data.endDate?.slice(0, 10) ?? "",
    status: "Active",
  };
};

export const deletePromotion = async (id: string): Promise<void> => {
  await api.delete(`/promotions/${id}`);
};

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
      endDate: data.endDate?.slice(0, 10) ?? "",
      status: data.isActive ? "Active" : "Expired",
    };
  } catch {
    return null;
  }
};

export const updatePromotion = async (
  id: string,
  payload: {
    promoCode: string;
    type: number;
    value: number;
    usageCount: number;
    usageLimit?: number;
    startDate: string;
    endDate: string;
    status: number;
  }
): Promise<void> => {
  await api.put(`/promotions/${id}`, {
    code: payload.promoCode,
    promotionType: payload.type,
    discountValue: payload.value,
    usageCount: payload.usageCount,
    usageLimit: payload.usageLimit ?? null,
    startDate: payload.startDate,
    endDate: payload.endDate,
    isActive: payload.status === 1,
  });
};