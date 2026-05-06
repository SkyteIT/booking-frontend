// src/pages/admin/contentManagement/hooks/useContent.ts
// Central data hook for the Content Management section.
// Fetches categories, banners, and promotions in parallel on mount,
// and exposes fine-grained action helpers that call the service layer
// and keep local state in sync so the UI never needs a full page reload.

import { useEffect, useState, useCallback } from "react";
import {
  getCategories, createCategory, updateCategory, toggleCategoryStatus, deleteCategory,
  getBanners, createBanner, updateBanner, deleteBanner,
  getPromotions, createPromotion, deletePromotion,
} from "../services/contentService";
import type { Category, Banner, Promotion } from "../types/contentType";

export const useContent = () => {
  // ── Shared data state ────────────────────────────────────
  const [categories,  setCategories]  = useState<Category[]>([]);
  const [banners,     setBanners]     = useState<Banner[]>([]);
  const [promotions,  setPromotions]  = useState<Promotion[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  // ── refresh: re-fetches all three resources in parallel ──
  // Wrapped in useCallback so child components can safely include
  // it in their own dependency arrays without causing infinite loops.
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

  // Creates a new category then re-fetches the full list
  const addCategory = useCallback(async (name: string, icon?: string) => {
    await createCategory({ name, icon });
    await refresh();
  }, [refresh]);

  // Updates category name then re-fetches the full list
  const editCategory = useCallback(async (id: string, name: string) => {
    await updateCategory(id, { name });
    await refresh();
  }, [refresh]);

  // Optimistic toggle: updates local state immediately without waiting for a
  // full refresh, so the switch feels instant in the UI
  const toggleCategory = useCallback(async (id: string, isActive: boolean) => {
    await toggleCategoryStatus(id, isActive);
    setCategories((prev) =>
      prev.map((c) => (c.id === (id as any) ? { ...c, status: isActive } : c))
    );
  }, []);

  // Optimistic delete: removes the row from local state immediately
  const removeCategory = useCallback(async (id: string) => {
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== (id as any)));
  }, []);

  // ── Banner actions ───────────────────────────────────────

  // Creates a banner then re-fetches to get the server-assigned id and dates
  const addBanner = useCallback(async (payload: Parameters<typeof createBanner>[0]) => {
    await createBanner(payload);
    await refresh();
  }, [refresh]);

  // Updates a banner then re-fetches to reflect server-side normalisation
  const editBanner = useCallback(async (id: string, payload: any) => {
    await updateBanner(id, payload);
    await refresh();
  }, [refresh]);

  // Optimistic delete: removes the banner row from local state immediately
  const removeBanner = useCallback(async (id: string) => {
    await deleteBanner(id);
    setBanners((prev) => prev.filter((b) => b.id !== (id as any)));
  }, []);

  // ── Promotion actions ────────────────────────────────────

  // Creates a promotion then re-fetches the full list
  const addPromotion = useCallback(async (payload: Parameters<typeof createPromotion>[0]) => {
    await createPromotion(payload);
    await refresh();
  }, [refresh]);

  // Optimistic delete: removes the promotion row from local state immediately
  const removePromotion = useCallback(async (id: string) => {
    await deletePromotion(id);
    setPromotions((prev) => prev.filter((p) => p.id !== (id as any)));
  }, []);

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