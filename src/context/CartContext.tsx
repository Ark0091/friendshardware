'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!session) {
      // Load from localStorage for guests
      try {
        const stored = localStorage.getItem('cart');
        if (stored) setItems(JSON.parse(stored));
      } catch { /* ignore */ }
      return;
    }

    try {
      const { data } = await axios.get('/api/cart');
      if (data.success && data.data?.items) {
        const mappedItems = data.data.items.map((item: { _id: string; product: Product; quantity: number; price: number }) => ({
          productId: item._id,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
        }));
        setItems(mappedItems);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
    }
  }, [session]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId: string, quantity = 1) => {
    setIsLoading(true);
    try {
      if (session) {
        const { data } = await axios.post('/api/cart', { productId, quantity });
        if (data.success) {
          await fetchCart();
          toast.success('Added to cart!');
        }
      } else {
        setItems((prev) => {
          const existing = prev.find((item) => item.productId === productId);
          const updated = existing
            ? prev.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item)
            : [...prev, { productId, quantity, price: 0 }];
          localStorage.setItem('cart', JSON.stringify(updated));
          return updated;
        });
        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      if (session) {
        const item = items.find((i) => i.productId === productId);
        if (!item) return;
        await axios.delete(`/api/cart/${productId}`);
        await fetchCart();
      } else {
        const updated = items.filter((item) => item.productId !== productId);
        setItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
      }
      toast.success('Removed from cart');
    } catch (error) {
      console.error('Remove from cart error:', error);
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }
    try {
      if (session) {
        const item = items.find((i) => i.productId === productId);
        if (!item) return;
        await axios.patch(`/api/cart/${productId}`, { quantity });
        await fetchCart();
      } else {
        const updated = items.map((item) => item.productId === productId ? { ...item, quantity } : item);
        setItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Update quantity error:', error);
    }
  };

  const clearCart = async () => {
    try {
      if (session) {
        await axios.delete('/api/cart');
      }
      setItems([]);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
