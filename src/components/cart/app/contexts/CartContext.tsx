import React, { createContext, useContext, useState, useEffect,  } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../../../context/useAuth';
import { addToCart as syncAddToCart } from '../../../../services/cartService';
export interface BookingItem {
  id: string;
  name: string;
  category: string; // real category name/id from the admin-managed category list (services/categoryService.ts), not a fixed set
  price: number;
  image: string;
  description: string;
  priceUnit: string; // e.g., "per day", "per hour", "per night"
  location?: string;
  allowMultiple?: boolean; // Whether multiple quantities can be booked
}

export interface CartItem extends BookingItem {
  quantity: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

// Helper function to check if item allows multiple quantities.
// NOTE: matches literal category names because the real admin-managed
// Category (services/categoryService.ts) has no "allows multiple" flag —
// this needs a backend field to become category-driven instead of
// name-matched. See .claude/BACKEND-TODO-cart.md.
export const canBookMultiple = (category: string): boolean => {
  return category === 'tool' || category === 'other';
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: BookingItem, quantity: number, startDate: string, endDate: string) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, quantity: number, startDate: string, endDate: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem('bookingCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bookingCart', JSON.stringify(cart));
  }, [cart]);

  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // At least 1 day
  };

  const addToCart = (
    item: BookingItem,
    quantity: number,
    startDate: string,
    endDate: string
  ) => {
    const days = calculateDays(startDate, endDate);
    const totalPrice = item.price * quantity * days;

    const existingItemIndex = cart.findIndex(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.startDate === startDate &&
        cartItem.endDate === endDate
    );

    if (existingItemIndex > -1) {

          if (item.category === 'hotel' || item.category === 'car') {
      alert(`${item.name} is already in your cart!`);
      return;
    }

      // Update existing item
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      updatedCart[existingItemIndex].totalPrice =
        item.price * updatedCart[existingItemIndex].quantity * days;
      setCart(updatedCart);
    } else {
      // Add new item
      const cartItem: CartItem = {
        ...item,
        quantity,
        startDate,
        endDate,
        totalPrice,
      };
      setCart([...cart, cartItem]);
    }

    // Best-effort background sync for signed-in users. The backend cart has
    // mirrors listingId/quantity — it never reads from or overwrites local
    // state. Remove/update aren't synced: the backend needs its own
    // CartItemId (not the listingId we have locally) to target those calls.
    if (isAuthenticated) {
      syncAddToCart(item.id, quantity).catch((err) => {
        console.error('Failed to sync cart item to backend:', err);
      });
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateCartItem = (
    id: string,
    quantity: number,
    startDate: string,
    endDate: string
  ) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const days = calculateDays(startDate, endDate);
        const totalPrice = item.price * quantity * days;
        return {
          ...item,
          quantity,
          startDate,
          endDate,
          totalPrice,
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};