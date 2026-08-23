// src/pages/admin/contentManagement/types/contentType.ts
// Shared TypeScript interfaces for the Content Management domain.
// These types are the single source of truth consumed by the service layer,
// the useContent hook, and every component in this feature folder.
import type { ListingType } from "../../../../services/Vendor/listingService";
import type { Banner as SharedBanner } from "../../../../services/bannerService";

// ── Category ──────────────────────────────────────────────────────────────
// Represents a booking category (e.g. Hotels, Car Rentals).
// `status: true` means Active; `false` means Inactive.
// `listings` is a denormalised count returned by the API.
export interface Category {
  id: string;
  name: string;
  description?: string;
  listings: number; // Total active listings belonging to this category
  status: boolean; // true = Active, false = Inactive
  icon: string; // Emoji character or empty string
  // Which ListingType this category's listings must use - every real
  // category has one; only the internal "Uncategorized" sentinel doesn't.
  type: ListingType | null;
}

// ── Banner ────────────────────────────────────────────────────────────────
// Reuse the shared banner DTO so the admin and public areas consume the same
// backend shape.
export type Banner = SharedBanner;

// ── Promotion ─────────────────────────────────────────────────────────────
// Represents a discount promo code.
// `usageLimit: null` means unlimited uses.
// `usageCount` is server-tracked and read-only from the frontend perspective.
export interface Promotion {
  id: string;
  code: string; // e.g. "SUMMER50" - unique, uppercase
  type: "Percentage" | "Fixed Amount"; // Maps to backend promotionType enum (0 | 1)
  value: number; // Discount amount - percent or fixed dollar
  usageCount: number; // How many times this code has been redeemed
  usageLimit: number | null; // null = unlimited
  startDate: string; // ISO date string "YYYY-MM-DD"
  endDate: string; // ISO date string "YYYY-MM-DD"
  status: "Active" | "Expired" | "Draft";
}
