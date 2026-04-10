'use client';

import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />}

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-white shadow-xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            Cart ({itemCount})
          </h2>
          <button onClick={onClose} className="rounded-full p-1 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="mb-3 h-12 w-12 text-gray-300" />
              <p className="text-gray-500">Your cart is empty</p>
              <Link href="/products" onClick={onClose}>
                <Button className="mt-4 bg-orange-500 hover:bg-orange-600" size="sm">Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                    {item.product?.images?.[0] && (
                      <Image src={item.product.images[0].url} alt={item.product.name || ''} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">{item.product?.name}</p>
                    <p className="text-sm font-semibold text-orange-500">{formatPrice(item.price)}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-5 w-5 items-center justify-center rounded border text-gray-500 hover:bg-gray-100">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex h-5 w-5 items-center justify-center rounded border text-gray-500 hover:bg-gray-100">
                        <Plus className="h-3 w-3" />
                      </button>
                      <button onClick={() => removeItem(item.productId)}
                        className="ml-auto text-gray-400 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-4 py-4">
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-gray-900">{formatPrice(total)}</span>
            </div>
            <p className="mb-3 text-xs text-gray-500">Shipping and taxes calculated at checkout</p>
            <Link href="/checkout" onClick={onClose}>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">Proceed to Checkout</Button>
            </Link>
            <Link href="/cart" onClick={onClose}>
              <Button variant="outline" className="mt-2 w-full">View Cart</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
