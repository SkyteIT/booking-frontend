import { describe, expect, it } from "vitest";
import {
  isBannerVisible,
  sortBannersForDisplay,
  type Banner,
} from "./bannerService";

const today = new Date("2026-08-22T10:00:00.000Z");

const makeBanner = (overrides: Partial<Banner> & Pick<Banner, "id" | "placement" | "startDate" | "endDate" | "status">): Banner => ({
  id: overrides.id,
  title: "Banner",
  description: "Description",
  imageUrl: "https://example.com/banner.jpg",
  placement: overrides.placement,
  startDate: overrides.startDate,
  endDate: overrides.endDate,
  status: overrides.status,
  bannerType: "Hero",
  actionUrl: "https://example.com",
  openInNewTab: true,
  priority: overrides.priority ?? null,
});

describe("banner visibility helpers", () => {
  it("shows an active banner only in the matching placement during its schedule", () => {
    const banner = makeBanner({
      id: "1",
      placement: "Explore",
      startDate: "2026-08-01",
      endDate: "2026-08-31",
      status: "Active",
    });

    expect(isBannerVisible(banner, "Explore", today)).toBe(true);
    expect(isBannerVisible(banner, "Home", today)).toBe(false);
  });

  it("hides future, expired, and inactive banners", () => {
    const futureBanner = makeBanner({
      id: "2",
      placement: "Explore",
      startDate: "2026-08-23",
      endDate: "2026-08-30",
      status: "Active",
    });
    const expiredBanner = makeBanner({
      id: "3",
      placement: "Explore",
      startDate: "2026-08-01",
      endDate: "2026-08-21",
      status: "Active",
    });
    const inactiveBanner = makeBanner({
      id: "4",
      placement: "Explore",
      startDate: "2026-08-01",
      endDate: "2026-08-31",
      status: "Inactive",
    });

    expect(isBannerVisible(futureBanner, "Explore", today)).toBe(false);
    expect(isBannerVisible(expiredBanner, "Explore", today)).toBe(false);
    expect(isBannerVisible(inactiveBanner, "Explore", today)).toBe(false);
  });

  it("keeps priority ordering when multiple banners are visible", () => {
    const banners = sortBannersForDisplay([
      makeBanner({
        id: "low",
        placement: "Home",
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        status: "Active",
        priority: 20,
      }),
      makeBanner({
        id: "high",
        placement: "Home",
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        status: "Active",
        priority: 1,
      }),
      makeBanner({
        id: "no-priority",
        placement: "Home",
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        status: "Active",
      }),
    ]);

    expect(banners.map((banner) => banner.id)).toEqual(["high", "low", "no-priority"]);
  });
});
