import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from './api';

export type CartItem = { product: Product; quantity: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: Product) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (product: Product) =>
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { product, quantity: 1 }];
    });

  const increment = (id: number) =>
    setItems((prev) => prev.map((i) => (i.product.id === id ? { ...i, quantity: i.quantity + 1 } : i)));

  const decrement = (id: number) =>
    setItems((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    );

  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.product.id !== id));

  const clear = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, subtotal, add, increment, decrement, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans <CartProvider>');
  return ctx;
}
