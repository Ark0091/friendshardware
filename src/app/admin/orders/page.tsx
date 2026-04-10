'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<{ _id: string; orderNumber: string; user?: { name: string; email: string }; total: number; status: string; paymentStatus: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { axios.get('/api/admin/orders').then(r => setOrders(r.data.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Orders</h1>
      <div className="rounded-lg bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{['Order #','Customer','Total','Status','Payment','Date'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan={6} className="py-8 text-center text-gray-400">Loading...</td></tr> :
              orders.map(o => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">#{o.orderNumber}</td>
                  <td className="px-4 py-3 text-gray-600">{o.user?.name || 'Guest'}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3"><span className="rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 capitalize">{o.status}</span></td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{o.paymentStatus}</span></td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(o.createdAt)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
