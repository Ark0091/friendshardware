'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus, Trash2, Tag, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { TAX_RATE, SHIPPING_CHARGE, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const tax = Math.round(total * TAX_RATE);
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const finalTotal = total + tax + shipping - couponDiscount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await axios.post('/api/coupons/validate', { code: couponCode, orderAmount: total });
      if (data.success) {
        setCouponDiscount(data.data.discount);
        toast.success(`Coupon applied! Saved ${formatPrice(data.data.discount)}`);
      }
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error) ? error.response?.data?.error : 'Invalid coupon';
      toast.error(msg || 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  if (itemCount === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
        <h2 className="mb-2 text-xl font-bold text-gray-700">Your cart is empty</h2>
        <p className="mb-6 text-gray-500">Add some products to continue shopping</p>
        <Link href="/products">
          <Button className="bg-orange-500 hover:bg-orange-600">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Shopping Cart ({itemCount} items)</h1>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {item.product?.images?.[0] && (
                    <Image src={item.product.images[0].url} alt={item.product?.name || ''} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{item.product?.name}</h3>
                  <p className="text-sm text-gray-500">Unit price: {formatPrice(item.price)}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center rounded-md border border-gray-300">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-100">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="flex h-8 min-w-[2rem] items-center justify-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-100">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.productId)} className="ml-auto text-gray-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800"><Tag className="h-4 w-4" />Apply Coupon</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
                />
                <Button size="sm" onClick={applyCoupon} disabled={couponLoading} className="bg-orange-500 hover:bg-orange-600">
                  Apply
                </Button>
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-800">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">GST (18%)</span><span>{formatPrice(tax)}</span></div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span>-{formatPrice(couponDiscount)}</span></div>
                )}
                {shipping > 0 && (
                  <p className="text-xs text-gray-500">Add {formatPrice(FREE_SHIPPING_THRESHOLD - total)} more for free shipping</p>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
              <Link href="/checkout">
                <Button className="mt-4 w-full bg-orange-500 hover:bg-orange-600" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="mt-2 w-full">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
