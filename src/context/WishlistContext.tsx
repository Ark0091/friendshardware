'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Product } from '@/types';

interface WishlistContextType {
  items: Product[];
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!session) {
      try {
        const stored = localStorage.getItem('wishlist');
        if (stored) setItems(JSON.parse(stored));
      } catch { /* ignore */ }
      return;
    }

    try {
      const { data } = await axios.get('/api/wishlist');
      if (data.success) setItems(data.data);
    } catch (error) {
      console.error('Fetch wishlist error:', error);
    }
  }, [session]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addItem = async (productId: string) => {
    setIsLoading(true);
    try {
      if (session) {
        await axios.post('/api/wishlist', { productId });
        await fetchWishlist();
      } else {
        toast.error('Please login to save to wishlist');
        return;
      }
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Add to wishlist error:', error);
      toast.error('Failed to add to wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      if (session) {
        await axios.delete('/api/wishlist', { data: { productId } });
        await fetchWishlist();
      } else {
        const updated = items.filter((item) => item.id !== productId);
        setItems(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
      }
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId: string) => items.some((item) => item.id === productId);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
