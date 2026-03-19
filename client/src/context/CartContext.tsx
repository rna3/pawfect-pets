import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types';
import { STORAGE_KEYS } from '../constants';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  addServiceBooking: (item: Omit<CartItem, 'quantity' | 'itemType'> & { bookingDetails: NonNullable<CartItem['bookingDetails']> }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
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
  const normalizeCartItems = (savedItems: any[]): CartItem[] =>
    savedItems.map((item) => ({
      ...item,
      itemType: item.itemType || 'product',
    }));

  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    if (!saved) return [];
    try {
      return normalizeCartItems(JSON.parse(saved));
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prevItems) => {
      const itemType = item.itemType || 'product';
      const existingItem = prevItems.find((i) => i.id === item.id && (i.itemType || 'product') === itemType);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id && (i.itemType || 'product') === itemType ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, itemType, quantity: 1 }];
    });
  };

  const addServiceBooking: CartContextType['addServiceBooking'] = (item) => {
    setItems((prevItems) => [
      ...prevItems,
      {
        ...item,
        itemType: 'service',
        quantity: 1,
      },
    ]);
  };

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  // Centralized cart UI state so navbar and pages can open the same drawer.
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addServiceBooking,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

