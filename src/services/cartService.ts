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
  const res = await api.get<CartDto>("/cart");
  return res.data;
};

export const addToCart = async (listingId: string, quantity = 1): Promise<CartDto> => {
  const res = await api.post<CartDto>("/cart/items", { listingId, quantity });
  return res.data;
};

export const updateCartItem = async (cartItemId: string, quantity: number): Promise<CartDto> => {
  const res = await api.put<CartDto>("/cart/items", { cartItemId, quantity });
  return res.data;
};

export const removeCartItem = async (cartItemId: string): Promise<CartDto> => {
  const res = await api.delete<CartDto>(`/cart/items/${cartItemId}`);
  return res.data;
};

export const clearCart = async (): Promise<void> => {
  await api.delete("/cart");
};
