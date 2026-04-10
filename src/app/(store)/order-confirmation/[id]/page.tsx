'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/loading';

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`/api/orders/${id}`)
        .then(({ data }) => {
          if (data.success) setOrder({ ...data.data, id: data.data._id });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <PageLoader />;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto max-w-2xl px-4 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">Order Confirmed!</h1>
        <p className="mb-6 text-gray-600">Thank you for your order. We will send you an email confirmation shortly.</p>

        {order && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-sm text-left">
            <div className="mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              <span className="font-bold text-gray-800">Order #{order.orderNumber}</span>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Order Date</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p className="font-medium capitalize">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-500">Order Total</p>
                <p className="font-bold text-orange-500">{formatPrice(order.total)}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-medium capitalize text-amber-600">{order.status}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="mb-2 text-sm font-medium text-gray-700">Items Ordered:</p>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span className="text-gray-600">{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/orders">
            <Button variant="outline" className="w-full sm:w-auto">Track Orders</Button>
          </Link>
          <Link href="/products">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 sm:w-auto">
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
