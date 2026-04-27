export interface Category {
  id: string;
  name: string;
  listings: number;
  status: boolean;
  icon: string;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  placement: "Homepage Hero" | "Homepage Banner" | "Category Pages" | string;
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive";
}

export interface Promotion {
  id: string;
  code: string;
  type: "Percentage" | "Fixed Amount";
  value: number;
  usageCount: number;
  usageLimit: number | null;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Draft";
}
