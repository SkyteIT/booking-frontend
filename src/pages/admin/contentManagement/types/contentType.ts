
export interface Category {
  id: number;
  name: string;
  listings: number;
  status: boolean;
  icon: string;
}

export interface Banner {
  id: number;
  title: string;
  description: string;
  placement: "Homepage Hero" | "Homepage Banner" | "Category Pages" | string;
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive";
}

export interface Promotion {
  id: number;
  code: string;
  type: "Percentage" | "Fixed Amount";
  value: number;
  usageCount: number;
  usageLimit: number | null; // null = unlimited
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Draft";
}