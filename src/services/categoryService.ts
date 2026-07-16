// src/services/categoryService.ts
import api from "./api";

export interface ApiCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export const fetchCategories = async (): Promise<ApiCategory[]> => {
  const { data } = await api.get<any[]>("/categories");
  return data
    // Only show Active/Inactive categories — this excludes __Uncategorized__,
    // soft-deleted entries, and anything with null/unexpected status values.
    // Search sidebar only shows isActive:true ones, but we fetch both here
    // so the admin toggle is reflected correctly without a second fetch.
    .filter((c) =>
      c.name !== "__Uncategorized__" &&
      (c.status === "Active" || c.status === "Inactive")
    )
    .map((c) => ({
      id: String(c.id),
      name: c.name,
      // API returns status as "Active" | "Inactive" string (not a boolean)
      isActive: c.status === "Active",
    }));
};