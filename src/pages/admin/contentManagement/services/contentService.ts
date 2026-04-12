// src/pages/admin/contentManagement/services/contentService.ts
import { categories, banners, promotions } from "../data/mockData";

export const getCategories = async () => Promise.resolve(categories);
export const getBanners = async () => Promise.resolve(banners);
export const getPromotions = async () => Promise.resolve(promotions);
