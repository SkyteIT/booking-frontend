// src/pages/admin/contentManagement/hooks/useContent.ts
// Central data hook for the Content Management section.
// Fetches categories, banners, and promotions in parallel on mount,
// and exposes fine-grained action helpers that call the service layer.
// Every mutating action does a full server refresh after the API call
// so the UI always reflects the true database state.

import { useEffect, useState, useCallback } from "react";
import {
  getCategories, createCategory, updateCategory, toggleCategoryStatus, deleteCategory,
  getBanners, createBanner, updateBanner, deleteBanner,
  getPromotions, createPromotion, deletePromotion,
} from "../services/contentService";
import type { Category, Banner, Promotion } from "../types/contentType";
import type { ListingType } from "../../../../services/Vendor/listingService";

export const useContent = () => {
  // ── Shared data state ────────────────────────────────────
  const [categories,  setCategories]  = useState<Category[]>([]);
  const [banners,     setBanners]     = useState<Banner[]>([]);
  const [promotions,  setPromotions]  = useState<Promotion[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  // ── refresh: re-fetches all three resources in parallel ──
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

  // Fetch on first mount
  useEffect(() => { refresh(); }, [refresh]);

  // ── Category actions ─────────────────────────────────────

  // Creates a new category then re-fetches the full list so we always
  // show the real server state (including restored listings count).
  const addCategory = useCallback(async (name: string, type: ListingType, icon?: string) => {
    await createCategory({ name, type, icon });
    await refresh();
  }, [refresh]);

  // Updates category name/icon then re-fetches the full list
  const editCategory = useCallback(async (id: string, name: string) => {
    await updateCategory(id, { name });
    await refresh();
  }, [refresh]);

  // Optimistic toggle: flips local state immediately for instant UI feedback,
  // using String() on both sides to safely compare GUID strings.
  const toggleCategory = useCallback(async (id: string, isActive: boolean) => {
    await toggleCategoryStatus(id, isActive);
    setCategories((prev) =>
      prev.map((c) => (String(c.id) === String(id) ? { ...c, status: isActive } : c))
    );
  }, []);

  // Delete: calls the API then does a full server refresh so the UI always
  // reflects the true DB state (handles FK constraints / backend rejections).
  // Throws on any failure so ContentManagement.tsx can show the error.
  const removeCategory = useCallback(async (id: string) => {
    console.log("[removeCategory] Sending DELETE /categories/" + id);
    await deleteCategory(id);
    console.log("[removeCategory] DELETE succeeded, refreshing list...");
    await refresh();
    console.log("[removeCategory] Refresh complete.");
  }, [refresh]);

  // ── Banner actions ───────────────────────────────────────

  const addBanner = useCallback(async (payload: Parameters<typeof createBanner>[0]) => {
    await createBanner(payload);
    await refresh();
  }, [refresh]);

  const editBanner = useCallback(async (id: string, payload: any) => {
    await updateBanner(id, payload);
    await refresh();
  }, [refresh]);

  // Full refresh after delete so list reflects true server state
  const removeBanner = useCallback(async (id: string) => {
    await deleteBanner(id);
    await refresh();
  }, [refresh]);

  // ── Promotion actions ────────────────────────────────────

  const addPromotion = useCallback(async (payload: Parameters<typeof createPromotion>[0]) => {
    await createPromotion(payload);
    await refresh();
  }, [refresh]);

  // Full refresh after delete so list reflects true server state
  const removePromotion = useCallback(async (id: string) => {
    await deletePromotion(id);
    await refresh();
  }, [refresh]);

  return {
    // Data
    categories, banners, promotions,
    loading, error,
    // Category actions
    addCategory, editCategory, toggleCategory, removeCategory,
    // Banner actions
    addBanner, editBanner, removeBanner,
    // Promotion actions
    addPromotion, removePromotion,
    // Manual refresh (used after modal saves)
    refresh,
  };
};