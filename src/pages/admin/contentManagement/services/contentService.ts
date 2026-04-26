// src/pages/admin/contentManagement/services/contentService.ts
import api from "../../../../services/api";
import type { Category, Banner, Promotion } from "../types/contentType";

// ─── Categories ──────────────────────────────────────────────────────────────

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get("/categories");
  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
    listings: 0,           // backend doesn't return count; set 0 or enhance later
    status: c.isActive,
    icon: c.iconUrl ?? "",
  }));
};

export const createCategory = async (payload: {
  name: string;
  description?: string;
  iconUrl?: string;
}): Promise<Category> => {
  const { data } = await api.post("/categories", payload);
  return { id: data.id, name: data.name, listings: 0, status: data.isActive, icon: data.iconUrl ?? "" };
};

export const updateCategory = async (
  id: string,
  payload: { name?: string; description?: string; iconUrl?: string }
): Promise<Category> => {
  const { data } = await api.put(`/categories/${id}`, payload);
  return { id: data.id, name: data.name, listings: 0, status: data.isActive, icon: data.iconUrl ?? "" };
};

export const toggleCategoryStatus = async (id: string, isActive: boolean): Promise<void> => {
  await api.patch(`/categories/${id}/status`, { isActive });
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

// ─── Banners ─────────────────────────────────────────────────────────────────

export const getBanners = async (): Promise<Banner[]> => {
  const { data } = await api.get("/banners");
  return data.map((b: any) => ({
    id: b.id,
    title: b.title,
    description: b.description ?? "",
    placement: b.placement ?? "Homepage Hero",
    startDate: b.startDate?.slice(0, 10) ?? "",
    endDate: b.endDate?.slice(0, 10) ?? "",
    status: b.isActive ? "Active" : "Inactive",
  }));
};

export const createBanner = async (payload: {
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  placement?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Banner> => {
  const { data } = await api.post("/banners", payload);
  return {
    id: data.id,
    title: data.title,
    description: data.description ?? "",
    placement: data.placement ?? "Homepage Hero",
    startDate: data.startDate?.slice(0, 10) ?? "",
    endDate: data.endDate?.slice(0, 10) ?? "",
    status: data.isActive ? "Active" : "Inactive",
  };
};

export const updateBanner = async (id: string, payload: any): Promise<Banner> => {
  const { data } = await api.put(`/banners/${id}`, payload);
  return {
    id: data.id,
    title: data.title,
    description: data.description ?? "",
    placement: data.placement ?? "Homepage Hero",
    startDate: data.startDate?.slice(0, 10) ?? "",
    endDate: data.endDate?.slice(0, 10) ?? "",
    status: data.isActive ? "Active" : "Inactive",
  };
};

export const deleteBanner = async (id: string): Promise<void> => {
  await api.delete(`/banners/${id}`);
};

// ─── Promotions ───────────────────────────────────────────────────────────────

export const getPromotions = async (): Promise<Promotion[]> => {
  const { data } = await api.get("/promotions");
  return data.map((p: any) => ({
    id: p.id,
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
    id: data.id,
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