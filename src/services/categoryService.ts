// src/services/categoryService.ts
import api from "./api";

export interface ApiCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export const fetchCategories = async (): Promise<ApiCategory[]> => {
  const { data } = await api.get<any[]>("/categories");
  return data.map((c) => ({
    id: String(c.id),
    name: c.name,
    // API returns status as "Active" | "Inactive" string (not a boolean)
    isActive: c.status === "Active",
  }));
};