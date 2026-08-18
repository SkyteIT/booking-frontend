import React, { createContext, useContext, useState, useEffect,  } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../../../context/useAuth';
import { addToCart as syncAddToCart } from '../../../../services/cartService';
import { calculatePricingTotal } from '../../../../utils/pricingCalculator';
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
  listingUnitId?: string; // specific room type/seat/fleet unit/time slot chosen, if the listing has any defined
  pricingUnit?: string; // PerNight | PerHour | PerPerson | PerDay | FixedPrice, from the listing's Category
}

export interface CartItem extends BookingItem {
  quantity: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

// A cart line isn't uniquely identified by `id` alone - the same listing
// can appear twice with different date ranges (addToCart's own merge
// check already keys on id+startDate+endDate). Selection needs a key
// that's actually unique per line, or selecting one date-range of a
// listing would silently select every other date-range of it too.
const getCartItemKey = (item: Pick<CartItem, 'id' | 'startDate' | 'endDate'>): string =>
  `${item.id}::${item.startDate}::${item.endDate}`;

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
  // Selection - which cart lines checkout should actually act on. Defaults
  // to "everything selected" so existing single-item-cart flows behave
  // exactly as before.
  selectedCart: CartItem[];
  isItemSelected: (item: CartItem) => boolean;
  toggleItemSelected: (item: CartItem) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  getSelectedTotal: () => number;
  // Removes only the given lines (e.g. after a successful checkout of the
  // selected subset) - unlike clearCart(), leaves everything else in the
  // cart untouched.
  removeCartItems: (items: CartItem[]) => void;
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

  // Tracks *deselected* lines (keyed by getCartItemKey) rather than
  // selected ones, so "select everything" is the implicit default with
  // no separate effect needed to keep it in sync as lines are added or
  // removed - a line just falls out of this set the moment it's gone
  // from the cart, and a brand-new line is selected by construction
  // (its key was never added here).
  const [deselectedKeys, setDeselectedKeys] = useState<Set<string>>(() => new Set());

  const calculateItemTotal = calculatePricingTotal;

  const addToCart = (
    item: BookingItem,
    quantity: number,
    startDate: string,
    endDate: string
  ) => {
    const totalPrice = calculateItemTotal(item.price, quantity, startDate, endDate, item.pricingUnit);

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
      updatedCart[existingItemIndex].totalPrice = calculateItemTotal(
        item.price,
        updatedCart[existingItemIndex].quantity,
        startDate,
        endDate,
        item.pricingUnit
      );
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
        const totalPrice = calculateItemTotal(item.price, quantity, startDate, endDate, item.pricingUnit);
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

  const isItemSelected = (item: CartItem) => !deselectedKeys.has(getCartItemKey(item));

  const toggleItemSelected = (item: CartItem) => {
    const key = getCartItemKey(item);
    setDeselectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const selectAllItems = () => setDeselectedKeys(new Set());
  const deselectAllItems = () => setDeselectedKeys(new Set(cart.map(getCartItemKey)));

  const selectedCart = cart.filter(isItemSelected);

  const getSelectedTotal = () => selectedCart.reduce((total, item) => total + item.totalPrice, 0);

  const removeCartItems = (items: CartItem[]) => {
    const keysToRemove = new Set(items.map(getCartItemKey));
    setCart((prev) => prev.filter((item) => !keysToRemove.has(getCartItemKey(item))));
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
        selectedCart,
        isItemSelected,
        toggleItemSelected,
        selectAllItems,
        deselectAllItems,
        getSelectedTotal,
        removeCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};