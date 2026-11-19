'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { formatKES } from '@/lib/utils';

interface CartItem {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock: number;
    is_available: boolean;
    featured?: boolean;
  };
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  addItem: (product: CartItem['product'], quantity?: number) => void;
  removeItem: (product: CartItem['product']) => void;
  updateQuantity: (product: CartItem['product'], quantity: number) => void;
  clearCart: () => void;
  syncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const { user } = useAuth();

  // Load cart from localStorage for guest users
  useEffect(() => {
    if (user) return;
    try {
      const stored = localStorage.getItem('gift-shisha-cart');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {}
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    let cancelled = false;
    setSyncing(true);
    const loadCart = async () => {
      try {
        const { data, error } = await getSupabaseAdmin()
          .from('cart_items')
          .select('*, product:products(*)')
          .eq('user_id', user.id);
        if (error) throw error;
        if (!cancelled && data) {
          const loaded: CartItem[] = data.map((row: any) => ({
            product: row.product,
            quantity: row.quantity,
          }));
          setItems(loaded);
        }
      } catch (err) {
        console.error('Failed to load cart:', err);
      } finally {
        if (!cancelled) setSyncing(false);
      }
    };
    loadCart();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // Persist guest cart to localStorage on every change
  useEffect(() => {
    if (user) return;
    try { localStorage.setItem('gift-shisha-cart', JSON.stringify(items)); } catch {}
  }, [items, user?.id]);

  const persistCart = useCallback(async (newItems: CartItem[]) => {
    if (!user) return;
    try {
      const { error: deleteError } = await getSupabaseAdmin()
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
      if (deleteError) throw deleteError;
      if (newItems.length > 0) {
        const rows = newItems.map((item) => ({
          user_id: user.id,
          product_id: item.product.id,
          quantity: item.quantity,
        }));
        const { error: insertError } = await getSupabaseAdmin()
          .from('cart_items')
          .insert(rows);
        if (insertError) throw insertError;
      }
    } catch (err) {
      console.error('Failed to persist cart:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      persistCart(items);
    }, 500);
    return () => clearTimeout(timer);
  }, [items, user?.id, persistCart]);

  const addItem = (product: CartItem['product'], quantityToAdd: number = 1) => {
    const qty = Math.max(1, quantityToAdd);
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      } else {
        updated = [...prev, { product, quantity: qty }];
      }
      if (!user) {
        try { localStorage.setItem('gift-shisha-cart', JSON.stringify(updated)); } catch {}
      }
      return updated;
    });
  };

  const removeItem = (product: CartItem['product']) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.product.id !== product.id);
      if (!user) {
        try { localStorage.setItem('gift-shisha-cart', JSON.stringify(updated)); } catch {}
      }
      return updated;
    });
  };

  const updateQuantity = (product: CartItem['product'], quantity: number) => {
    if (quantity <= 0) {
      removeItem(product);
      return;
    }
    setItems((prev) => {
      const updated = prev.map((i) =>
        i.product.id === product.id ? { ...i, quantity } : i
      );
      if (!user) {
        try { localStorage.setItem('gift-shisha-cart', JSON.stringify(updated)); } catch {}
      }
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    if (!user) {
      try { localStorage.removeItem('gift-shisha-cart'); } catch {}
    }
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, cartCount, subtotal, addItem, removeItem, updateQuantity, clearCart, syncing }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCartContext must be used within CartProvider');
  return context;
}
