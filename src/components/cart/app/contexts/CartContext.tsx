import React, { createContext, useContext, useState, useEffect,  } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../../../context/useAuth';
import { addToCart as syncAddToCart, clearCart as syncClearCart, getCart, removeCartItem, updateCartItem as syncUpdateCartItem } from '../../../../services/cartService';
import { getListingById } from '../../../../services/Vendor/listingService';
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
  backendId?: string;
  quantity: number;
  guestCount?: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

const cartItemKey = (item: CartItem) =>
  item.backendId ?? `${item.id}:${item.startDate}:${item.endDate}`;

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
  addToCart: (item: BookingItem, quantity: number, startDate: string, endDate: string, guestCount?: number) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, quantity: number, startDate: string, endDate: string, guestCount?: number) => void;
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
  const { isAuthenticated, user } = useAuth();
  const [cartUserKey, setCartUserKey] = useState('guest');
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('bookingCart:guest');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`bookingCart:${cartUserKey}`, JSON.stringify(cart));
  }, [cart, cartUserKey]);

  useEffect(() => {
    const nextUserKey = isAuthenticated
      ? String(user?.userId ?? user?.id ?? user?.email ?? 'authenticated').toLowerCase()
      : 'guest';
    setCartUserKey(nextUserKey);
    if (!isAuthenticated) {
      const savedCart = localStorage.getItem('bookingCart:guest');
      setCart(savedCart ? JSON.parse(savedCart) : []);
      return;
    }

    let cancelled = false;
    const loadBackendCart = async () => {
      try {
        const backendCart = await getCart();
        if (cancelled) return;
        if (backendCart.items.length === 0) {
          setCart([]);
          return;
        }

        const hydratedItems = await Promise.all(
          backendCart.items.map(async (backendItem) => {
            const listing = await getListingById(backendItem.listingId);
            const startDate = backendItem.startDate?.split('T')[0] ?? new Date().toISOString().split('T')[0];
            const endDate = backendItem.endDate?.split('T')[0] ?? new Date(Date.now() + 86400000).toISOString().split('T')[0];

            return {
              id: listing.id,
              backendId: backendItem.id,
              name: listing.title,
              category: listing.categoryName,
              price: listing.price,
              image: listing.primaryImage ?? listing.images[0] ?? '',
              description: listing.description ?? '',
              priceUnit: 'per day',
              location: listing.location,
              quantity: backendItem.quantity,
              guestCount: backendItem.guestCount,
              startDate,
              endDate,
              totalPrice: backendItem.totalPrice,
            } satisfies CartItem;
          }),
        );

        if (!cancelled) setCart(hydratedItems);
      } catch (error) {
        console.error('Failed to load backend cart:', error);
      }
    };

    void loadBackendCart();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.email, user?.id, user?.userId]);

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
    endDate: string,
    guestCount = 1,
  ) => {
    const days = calculateDays(startDate, endDate);
    const totalPrice = item.price * quantity * guestCount * days;

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
      updatedCart[existingItemIndex].guestCount = guestCount;
      updatedCart[existingItemIndex].totalPrice =
        item.price * updatedCart[existingItemIndex].quantity * guestCount * days;
      setCart(updatedCart);
    } else {
      // Add new item
      const cartItem: CartItem = {
        ...item,
        quantity,
        guestCount,
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
      syncAddToCart(item.id, quantity, guestCount, startDate, endDate)
        .then((backendCart) => {
          const backendItem = backendCart.items.find((cartItem) =>
            cartItem.listingId === item.id &&
            cartItem.startDate?.split('T')[0] === startDate &&
            cartItem.endDate?.split('T')[0] === endDate,
          );
          if (!backendItem) return;
          setCart((current) => current.map((cartItem) =>
            cartItem.id === item.id && cartItem.startDate === startDate && cartItem.endDate === endDate
              ? { ...cartItem, backendId: backendItem.id }
              : cartItem,
          ));
        })
        .catch((err) => console.error('Failed to sync cart item to backend:', err));
    }
  };

  const removeFromCart = (id: string) => {
    const item = cart.find((cartItem) => cartItemKey(cartItem) === id);
    if (!item) return;

    setCart(cart.filter((cartItem) => cartItemKey(cartItem) !== id));
    if (isAuthenticated && item.backendId) {
      void removeCartItem(item.backendId)
        .catch((error) => console.error('Failed to sync cart removal:', error));
    }
  };

  const updateCartItem = (
    id: string,
    quantity: number,
    startDate: string,
    endDate: string,
    guestCount = 1,
  ) => {
    const updatedCart = cart.map((item) => {
      if (cartItemKey(item) === id) {
        const days = calculateDays(startDate, endDate);
        const totalPrice = item.price * quantity * (item.guestCount ?? 1) * days;
        return {
          ...item,
          quantity,
          guestCount,
          startDate,
          endDate,
          totalPrice,
        };
      }
      return item;
    });
    setCart(updatedCart);
    if (isAuthenticated) {
      const backendId = cart.find((item) => cartItemKey(item) === id)?.backendId;
      if (backendId) {
        void syncUpdateCartItem(backendId, quantity, guestCount, startDate, endDate)
          .catch((error) => console.error('Failed to sync cart update:', error));
      }
    }
  };

  const clearCart = () => {
    setCart([]);
    if (isAuthenticated) {
      void syncClearCart().catch((error) => console.error('Failed to clear backend cart:', error));
    }
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