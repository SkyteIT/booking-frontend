// src/pages/admin/contentManagement/types/contentType.ts
// Shared TypeScript interfaces for the Content Management domain.
// These types are the single source of truth consumed by the service layer,
// the useContent hook, and every component in this feature folder.

// ── Category ─────────────────────────────────────────────
// Represents a booking category (e.g. Hotels, Car Rentals).
// `status: true` means Active; `false` means Inactive.
// `listings` is a denormalised count returned by the API.
export interface Category {
  id: string;
  name: string;
  listings: number; // Total active listings belonging to this category
  status: boolean;  // true = Active, false = Inactive
  icon: string;     // Emoji character or empty string
}

// ── Banner ───────────────────────────────────────────────
// Represents a promotional banner displayed on the platform.
// `placement` is normalised to a human-readable label by contentService
// (see placementLabel helper) before being stored here.
export interface Banner {
  id: string;
  title: string;
  description: string; // Maps to the "subtitle" field on the backend DTO
  imageUrl: string;
  placement: "Homepage Hero" | "Homepage Banner" | "Category Pages" | string;
  startDate: string; // ISO date string "YYYY-MM-DD"
  endDate: string;   // ISO date string "YYYY-MM-DD"
  status: "Active" | "Inactive";
}

// ── Promotion ────────────────────────────────────────────
// Represents a discount promo code.
// `usageLimit: null` means unlimited uses.
// `usageCount` is server-tracked and read-only from the frontend perspective.
export interface Promotion {
  id: string;
  code: string;                        // e.g. "SUMMER50" — unique, uppercase
  type: "Percentage" | "Fixed Amount"; // Maps to backend promotionType enum (0 | 1)
  value: number;                       // Discount amount — percent or fixed dollar
  usageCount: number;                  // How many times this code has been redeemed
  usageLimit: number | null;           // null = unlimited
  startDate: string;                   // ISO date string "YYYY-MM-DD"
  endDate: string;                     // ISO date string "YYYY-MM-DD"
  status: "Active" | "Expired" | "Draft";
}