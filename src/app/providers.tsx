'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { background: '#1f2937', color: '#fff', borderRadius: '8px' },
              success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}
