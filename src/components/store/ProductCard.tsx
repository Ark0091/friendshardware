'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calculateDiscount, getStockStatus } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const stockStatus = getStockStatus(product.stock);
  const discountPercent = product.comparePrice ? calculateDiscount(product.comparePrice, product.price) : 0;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    setIsAddingToCart(true);
    await addToCart(product.id, 1);
    setIsAddingToCart(false);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  return (
    <Link href={`/product/${product.slug || product.id}`}>
      <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400 text-4xl">📦</div>
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {discountPercent > 0 && (
              <Badge className="bg-orange-500 text-white border-0 text-xs">-{discountPercent}%</Badge>
            )}
            {product.isNewArrival && (
              <Badge className="bg-green-500 text-white border-0 text-xs">New</Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleWishlist}
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 ${inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            >
              <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
            <Link
              href={`/product/${product.slug || product.id}`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-md transition hover:scale-110 hover:text-orange-500"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-3">
          {/* Category */}
          {product.category && typeof product.category === 'object' && (
            <p className="mb-1 text-xs text-orange-500 font-medium">{product.category.name}</p>
          )}

          {/* Name */}
          <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-800 leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          {product.ratings.count > 0 && (
            <div className="mb-2 flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-xs ${star <= Math.round(product.ratings.average) ? 'text-amber-400' : 'text-gray-300'}`}>★</span>
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.ratings.count})</span>
            </div>
          )}

          {/* Price */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>

          {/* Stock */}
          <p className={`mb-3 text-xs font-medium ${stockStatus.color}`}>{stockStatus.label}</p>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            {isAddingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
