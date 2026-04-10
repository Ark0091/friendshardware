'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import ProductGrid from '@/components/store/ProductGrid';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const { data: session } = useSession();
  const { items } = useWishlist();

  if (!session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Heart className="mb-4 h-16 w-16 text-gray-300" />
        <p className="mb-4 text-gray-600">Please login to view your wishlist</p>
        <Link href="/login"><Button className="bg-orange-500 hover:bg-orange-600">Login</Button></Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">My Wishlist ({items.length})</h1>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="mb-4 h-16 w-16 text-gray-300" />
            <h2 className="mb-2 text-xl font-semibold text-gray-700">Your wishlist is empty</h2>
            <p className="mb-6 text-gray-500">Save products you love to buy later</p>
            <Link href="/products"><Button className="bg-orange-500 hover:bg-orange-600">Browse Products</Button></Link>
          </div>
        ) : (
          <ProductGrid products={items} />
        )}
      </div>
    </div>
  );
}
