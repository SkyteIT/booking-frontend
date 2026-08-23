import { useEffect, useMemo, useState } from "react";
import {
  getBanners,
  isBannerVisible,
  sortBannersForDisplay,
  type Banner,
  type BannerPlacement,
} from "../services/bannerService";

export const usePlacementBanners = (placement?: BannerPlacement) => {
  const [allBanners, setAllBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getBanners();
        if (cancelled) return;
        setAllBanners(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (cancelled) return;
        setAllBanners([]);
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to load banners. Please try again later."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const banners = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const visibleBanners = allBanners.filter((banner) =>
      placement ? isBannerVisible(banner, placement) : String(banner.status).toLowerCase() === "active"
    );

    return sortBannersForDisplay(
      visibleBanners.filter((banner) => {
        if (!banner.startDate || !banner.endDate) return false;
        return banner.startDate <= today && banner.endDate >= today;
      })
    );
  }, [allBanners, placement]);

  return { banners, loading, error };
};
