'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import axios from 'axios';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/loading';

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      axios.get('/api/orders')
        .then(({ data }) => {
          if (data.success) setOrders(data.data.map((o: { _id: string } & Omit<Order, 'id'>) => ({ ...o, id: o._id })));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  if (!session) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="mb-4 text-gray-600">Please login to view your orders</p>
      <Link href="/login"><Button className="bg-orange-500 hover:bg-orange-600">Login</Button></Link>
    </div>
  );

  if (loading) return <PageLoader />;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">My Orders</h1>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="mb-4 h-16 w-16 text-gray-300" />
            <h2 className="mb-2 text-xl font-semibold text-gray-700">No orders yet</h2>
            <p className="mb-6 text-gray-500">Start shopping to see your orders here</p>
            <Link href="/products"><Button className="bg-orange-500 hover:bg-orange-600">Browse Products</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = ORDER_STATUSES.find(s => s.value === order.status);
              return (
                <div key={order.id} className="rounded-lg bg-white p-5 shadow-sm">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-gray-800">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusConfig?.color || 'bg-gray-100 text-gray-700'}`}>
                      {statusConfig?.label || order.status}
                    </span>
                  </div>
                  <div className="mb-3 text-sm text-gray-600">
                    {order.items.slice(0, 2).map((item, i) => (
                      <span key={i}>{i > 0 && ', '}{item.name} × {item.quantity}</span>
                    ))}
                    {order.items.length > 2 && <span className="text-gray-400"> +{order.items.length - 2} more</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                    <Link href={`/order-confirmation/${order.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
