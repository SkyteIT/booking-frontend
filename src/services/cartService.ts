import api from "./api";

export interface CartItemDto {
  id: string;
  listingId: string;
  quantity: number;
}

export interface CartDto {
  id: string;
  userId: string;
  totalPrice: number;
  currency: string;
  itemCount: number;
  createdAt: string;
  updatedAt?: string;
  items: CartItemDto[];
}

export const getCart = async (): Promise<CartDto> => {
  const res = await api.get<CartDto>("/api/cart");
  return res.data;
};

export const addToCart = async (listingId: string, quantity = 1): Promise<CartDto> => {
  const res = await api.post<CartDto>("/api/cart/items", { listingId, quantity });
  return res.data;
};
