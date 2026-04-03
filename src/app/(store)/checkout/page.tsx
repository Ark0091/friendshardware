'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { TAX_RATE, SHIPPING_CHARGE, FREE_SHIPPING_THRESHOLD, PAYMENT_METHODS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const checkoutSchema = z.object({
  street: z.string().min(5, 'Street address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  country: z.string().default('India'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const tax = Math.round(total * TAX_RATE);
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const finalTotal = total + tax + shipping;

  const onSubmit = async (shippingAddress: CheckoutForm) => {
    if (!session) {
      router.push('/login?redirect=/checkout');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      const { data: orderData } = await axios.post('/api/orders', {
        items: orderItems,
        shippingAddress: { ...shippingAddress, country: 'India' },
        paymentMethod,
      });

      if (!orderData.success) {
        toast.error(orderData.error || 'Failed to create order');
        return;
      }

      const orderId = orderData.data._id;

      if (paymentMethod === 'cod') {
        await clearCart();
        router.push(`/order-confirmation/${orderId}`);
        return;
      }

      if (paymentMethod === 'razorpay') {
        const { data: rpOrder } = await axios.post('/api/payments/razorpay/create-order', {
          amount: finalTotal,
          orderId,
        });

        if (!rpOrder.success) {
          toast.error('Failed to create payment');
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: rpOrder.data.amount,
          currency: rpOrder.data.currency,
          name: 'Friends Hardware',
          description: `Order ${orderData.data.orderNumber}`,
          order_id: rpOrder.data.id,
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            const { data: verifyData } = await axios.post('/api/payments/razorpay/verify', {
              ...response,
              orderId,
            });
            if (verifyData.success) {
              await clearCart();
              router.push(`/order-confirmation/${orderId}`);
            } else {
              toast.error('Payment verification failed');
            }
          },
          theme: { color: '#f97316' },
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window as unknown as { Razorpay: new (opts: typeof options) => { open: () => void } }).Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="mb-4 text-gray-600">Please login to proceed with checkout</p>
        <Button onClick={() => router.push('/login?redirect=/checkout')} className="bg-orange-500 hover:bg-orange-600">
          Login to Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Shipping + Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Street Address *</label>
                    <Input {...register('street')} placeholder="House/Flat No., Street, Area" />
                    {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">City *</label>
                      <Input {...register('city')} placeholder="City" />
                      {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">State *</label>
                      <Input {...register('state')} placeholder="State" />
                      {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Pincode *</label>
                      <Input {...register('pincode')} placeholder="6-digit pincode" maxLength={6} />
                      {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode.message}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Country</label>
                      <Input value="India" disabled className="bg-gray-50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">Payment Method</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label key={method.value} className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition ${paymentMethod === method.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-orange-500"
                      />
                      <span className="text-lg">{method.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="rounded-lg bg-white p-6 shadow-sm h-fit">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Order Summary</h2>
              <div className="mb-4 divide-y">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between py-2 text-sm">
                    <span className="text-gray-600 truncate max-w-[60%]">{item.product?.name} × {item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm border-t pt-3">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">GST (18%)</span><span>{formatPrice(tax)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                <div className="border-t pt-2 flex justify-between font-bold text-base">
                  <span>Total</span><span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
              <Button type="submit" className="mt-6 w-full bg-orange-500 hover:bg-orange-600" size="lg" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : `Place Order - ${formatPrice(finalTotal)}`}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
