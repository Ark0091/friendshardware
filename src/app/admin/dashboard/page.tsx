'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatPrice } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ShoppingBag, Users, Package } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<{ stats: { totalRevenue: number; totalOrders: number; totalCustomers: number; totalProducts: number }; revenueByDay: { _id: string; revenue: number }[]; recentOrders: { _id: string; orderNumber: string; total: number; status: string }[]; lowStockProducts: { _id: string; name: string; stock: number; sku: string }[] } | null>(null);

  useEffect(() => { axios.get('/api/admin/analytics').then(r => setData(r.data.data)).catch(console.error); }, []);

  const stats = [
    { label: 'Total Revenue', value: data ? formatPrice(data.stats.totalRevenue) : '...', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
    { label: 'Total Orders', value: data?.stats.totalOrders ?? '...', icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { label: 'Customers', value: data?.stats.totalCustomers ?? '...', icon: Users, color: 'text-purple-600 bg-purple-50' },
    { label: 'Products', value: data?.stats.totalProducts ?? '...', icon: Package, color: 'text-orange-600 bg-orange-50' },
  ];

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-lg bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex rounded-full p-2 ${color}`}><Icon className="h-5 w-5" /></div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>
      {(data?.revenueByDay?.length ?? 0) > 0 && (
        <div className="mb-6 rounded-lg bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800">Revenue (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.revenueByDay}>
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatPrice(v)} />
              <Bar dataKey="revenue" fill="#f97316" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-gray-800">Recent Orders</h2>
          <div className="space-y-2">
            {data?.recentOrders?.slice(0,5).map((o) => (
              <div key={o._id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                <span className="text-gray-700">#{o.orderNumber}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{o.status}</span>
                <span className="font-medium">{formatPrice(o.total)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-gray-800">Low Stock Alert</h2>
          <div className="space-y-2">
            {data?.lowStockProducts?.map((p) => (
              <div key={p._id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                <span className="text-gray-700 truncate max-w-[60%]">{p.name}</span>
                <span className={`font-bold ${p.stock <= 5 ? 'text-red-500' : 'text-amber-500'}`}>{p.stock} left</span>
              </div>
            ))}
            {!data?.lowStockProducts?.length && <p className="text-sm text-gray-500">No low stock items</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
