// src/pages/admin/contentManagement/hooks/useContent.ts
import { useEffect, useState } from "react";
import { getCategories, getBanners, getPromotions } from "../services/contentService";
import type { Category, Banner, Promotion } from "../types/contentType";

export const useContent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
    getBanners().then(setBanners);
    getPromotions().then(setPromotions);
  }, []);

  return { categories, banners, promotions };
};
