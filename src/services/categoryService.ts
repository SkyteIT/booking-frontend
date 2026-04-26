// src/services/categoryService.ts
import api from "./api";

export interface ApiCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export const fetchCategories = async (): Promise<ApiCategory[]> => {
  const { data } = await api.get<ApiCategory[]>("/categories");
  return data;
};