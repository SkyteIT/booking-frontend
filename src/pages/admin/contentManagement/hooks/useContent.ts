// src/pages/admin/contentManagement/hooks/useContent.ts
import { useEffect, useState, useCallback } from "react";
import {
  getCategories, createCategory, updateCategory, toggleCategoryStatus, deleteCategory,
  getBanners, createBanner, updateBanner, deleteBanner,
  getPromotions, createPromotion, deletePromotion,
} from "../services/contentService";
import type { Category, Banner, Promotion } from "../types/contentType";

export const useContent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, bans, promos] = await Promise.all([
        getCategories(),
        getBanners(),
        getPromotions(),
      ]);
      setCategories(cats);
      setBanners(bans);
      setPromotions(promos);
    } catch {
      setError("Failed to load content. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // ── Category actions ─────────────────────────────────────
  const addCategory = useCallback(async (name: string, icon?: string) => {
    await createCategory({ name, icon });
    await refresh();
  }, [refresh]);

  const editCategory = useCallback(async (id: string, name: string) => {
    await updateCategory(id, { name });
    await refresh();
  }, [refresh]);

  const toggleCategory = useCallback(async (id: string, isActive: boolean) => {
    await toggleCategoryStatus(id, isActive);
    setCategories((prev) =>
      prev.map((c) => (c.id === (id as any) ? { ...c, status: isActive } : c))
    );
  }, []);

  const removeCategory = useCallback(async (id: string) => {
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== (id as any)));
  }, []);

  // ── Banner actions ───────────────────────────────────────
  const addBanner = useCallback(async (payload: Parameters<typeof createBanner>[0]) => {
    await createBanner(payload);
    await refresh();
  }, [refresh]);

  const editBanner = useCallback(async (id: string, payload: any) => {
    await updateBanner(id, payload);
    await refresh();
  }, [refresh]);

  const removeBanner = useCallback(async (id: string) => {
    await deleteBanner(id);
    setBanners((prev) => prev.filter((b) => b.id !== (id as any)));
  }, []);

  // ── Promotion actions ────────────────────────────────────
  const addPromotion = useCallback(async (payload: Parameters<typeof createPromotion>[0]) => {
    await createPromotion(payload);
    await refresh();
  }, [refresh]);

  const removePromotion = useCallback(async (id: string) => {
    await deletePromotion(id);
    setPromotions((prev) => prev.filter((p) => p.id !== (id as any)));
  }, []);

  return {
    categories, banners, promotions,
    loading, error,
    addCategory, editCategory, toggleCategory, removeCategory,
    addBanner, editBanner, removeBanner,
    addPromotion, removePromotion,
    refresh,
  };
};