import api from "./api";

export type BannerPlacement = "Home" | "Explore";
export type BannerStatus = "Active" | "Inactive" | string;

export interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  placement: BannerPlacement;
  startDate: string;
  endDate: string;
  status: BannerStatus;
  bannerType?: string;
  actionUrl?: string;
  openInNewTab?: boolean;
  priority?: number | null;
}

export const PLACEMENT_OPTIONS = [
  { label: "Home", value: "Home" },
  { label: "Explore", value: "Explore" },
] as const;

export const placementLabel = (value: unknown): BannerPlacement => {
  if (typeof value === "number") {
    return value === 3 ? "Explore" : "Home";
  }

  const normalized = String(value ?? "").trim().toLowerCase();
  if (
    normalized.includes("explore") ||
    normalized.includes("category") ||
    normalized.includes("search")
  ) {
    return "Explore";
  }

  return "Home";
};

export const placementValue = (value: unknown): BannerPlacement => placementLabel(value);

const placementCode = (value: BannerPlacement): number => (value === "Explore" ? 3 : 1);

const normalizeStatusFlag = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;

  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return false;
  return !["inactive", "disabled", "false", "0", "draft", "expired"].includes(normalized);
};

const buildBannerRequestBody = (payload: {
  title: string;
  subtitle?: string;
  imageUrl: string;
  placement: BannerPlacement;
  startDate: string;
  endDate: string;
  status?: BannerStatus | boolean | number;
  actionUrl?: string;
  openInNewTab?: boolean;
  bannerType?: string;
}) => {
  const isActive = normalizeStatusFlag(payload.status ?? true);
  const status = isActive ? 1 : 0;

  return {
    title: payload.title,
    subtitle: payload.subtitle ?? "",
    description: payload.subtitle ?? "",
    imageUrl: payload.imageUrl,
    image: payload.imageUrl,
    placement: placementCode(payload.placement),
    placementLabel: payload.placement,
    startDate: payload.startDate,
    endDate: payload.endDate,
    isActive,
    status,
    ...(payload.actionUrl
      ? {
          actionUrl: payload.actionUrl,
          redirectUrl: payload.actionUrl,
          linkUrl: payload.actionUrl,
        }
      : {}),
    ...(typeof payload.openInNewTab === "boolean"
      ? { openInNewTab: payload.openInNewTab, openNewTab: payload.openInNewTab }
      : {}),
    ...(payload.bannerType ? { bannerType: payload.bannerType, type: payload.bannerType } : {}),
  };
};

const normalizeDate = (value: unknown): string => {
  if (!value) return "";
  const text = String(value);
  return text.length >= 10 ? text.slice(0, 10) : text;
};

const toLocalDateKey = (value: Date): string => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeStatus = (value: unknown): BannerStatus => {
  if (typeof value === "boolean") return value ? "Active" : "Inactive";
  if (typeof value === "number") return value === 0 ? "Inactive" : "Active";

  const normalized = String(value ?? "").trim();
  if (!normalized) return "Inactive";

  const lower = normalized.toLowerCase();
  if (lower === "inactive" || lower === "disabled" || lower === "false" || lower === "0") {
    return "Inactive";
  }
  if (lower === "active" || lower === "enabled" || lower === "true" || lower === "1") {
    return "Active";
  }
  return normalized;
};

const toNumberOrNull = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const asArray = (value: unknown): any[] => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const maybeItems = (value as { items?: unknown; data?: unknown }).items ?? (value as { items?: unknown; data?: unknown }).data;
    if (Array.isArray(maybeItems)) return maybeItems;
  }
  return [];
};

export const normalizeBanner = (raw: any): Banner => ({
  id: String(raw?.id ?? ""),
  title: String(raw?.title ?? ""),
  description: String(raw?.subtitle ?? raw?.description ?? ""),
  imageUrl: String(raw?.imageUrl ?? raw?.image ?? ""),
  placement: placementValue(raw?.placement),
  startDate: normalizeDate(raw?.startDate),
  endDate: normalizeDate(raw?.endDate),
  status: normalizeStatus(raw?.status ?? raw?.isActive),
  bannerType: raw?.bannerType ?? raw?.type ?? raw?.kind ?? undefined,
  actionUrl: raw?.actionUrl ?? raw?.redirectUrl ?? raw?.linkUrl ?? undefined,
  openInNewTab: raw?.openInNewTab ?? raw?.openNewTab ?? undefined,
  priority: toNumberOrNull(raw?.priority ?? raw?.displayOrder ?? raw?.sortOrder),
});

export const isBannerVisible = (
  banner: Banner,
  placement: BannerPlacement,
  now: Date = new Date()
): boolean => {
  if (banner.placement !== placement) return false;
  if (String(banner.status).toLowerCase() !== "active") return false;
  if (!banner.startDate || !banner.endDate) return false;

  const today = toLocalDateKey(now);
  return banner.startDate <= today && banner.endDate >= today;
};

export const sortBannersForDisplay = (banners: Banner[]): Banner[] =>
  [...banners].sort((a, b) => {
    const aPriority = a.priority;
    const bPriority = b.priority;

    if (typeof aPriority === "number" && typeof bPriority === "number") {
      if (aPriority !== bPriority) return aPriority - bPriority;
    } else if (typeof aPriority === "number") {
      return -1;
    } else if (typeof bPriority === "number") {
      return 1;
    }

    return 0;
  });

export const getBanners = async (): Promise<Banner[]> => {
  const { data } = await api.get("/banners");
  return asArray(data).map((banner) => normalizeBanner(banner));
};

export const getBannerById = async (id: string): Promise<Banner | null> => {
  try {
    const { data } = await api.get(`/banners/${id}`);
    return normalizeBanner(data?.data ?? data);
  } catch {
    return null;
  }
};

export const createBanner = async (payload: {
  title: string;
  subtitle?: string;
  imageUrl: string;
  placement: BannerPlacement;
  startDate: string;
  endDate: string;
  status?: BannerStatus | boolean | number;
  actionUrl?: string;
  openInNewTab?: boolean;
  bannerType?: string;
}): Promise<Banner> => {
  const { data } = await api.post("/banners", buildBannerRequestBody(payload));

  return normalizeBanner(data?.data ?? data);
};

export const updateBanner = async (
  id: string,
  payload: {
    title: string;
    subtitle?: string;
    imageUrl: string;
    placement: BannerPlacement;
    startDate: string;
    endDate: string;
    status: BannerStatus | boolean | number;
    actionUrl?: string;
    openInNewTab?: boolean;
    bannerType?: string;
  }
): Promise<Banner> => {
  const { data } = await api.put(`/banners/${id}`, buildBannerRequestBody(payload));

  return normalizeBanner(data?.data ?? data);
};

export const uploadBannerImage = async (file: File): Promise<string> => {
  const upload = async (url: string, fieldName: "File" | "file") => {
    const formData = new FormData();
    formData.append(fieldName, file);
    return api.post<{ imageUrl?: string; profileImageUrl?: string; ProfileImageUrl?: string }>(url, formData);
  };

  try {
    const { data } = await upload("/banners/upload-image", "File");
    return data.imageUrl ?? data.profileImageUrl ?? data.ProfileImageUrl ?? "";
  } catch (err: any) {
    const status = err?.response?.status;
    const shouldFallback = status === 404 || status === 405 || status === 415;
    if (!shouldFallback) throw err;

    const fallbacks = [
      { url: "/auth/profile/upload-image", field: "File" as const },
      { url: "/auth/profile/upload-image", field: "file" as const },
      { url: "/banners/upload-image", field: "file" as const },
    ];

    for (const fallback of fallbacks) {
      try {
        const { data } = await upload(fallback.url, fallback.field);
        const resolved = data.imageUrl ?? data.profileImageUrl ?? data.ProfileImageUrl ?? "";
        if (resolved) return resolved;
      } catch (fallbackErr: any) {
        const fallbackStatus = fallbackErr?.response?.status;
        if (fallbackStatus !== 404 && fallbackStatus !== 405 && fallbackStatus !== 415) {
          throw fallbackErr;
        }
      }
    }

    throw err;
  }
};

export const deleteBanner = async (id: string): Promise<void> => {
  await api.delete(`/banners/${id}`);
};
