'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatPrice } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<{ _id: string; name: string; price: number; stock: number; isActive: boolean; category?: { name: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/products').then(r => setProducts(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button className="bg-orange-500 hover:bg-orange-600 gap-2"><Plus className="h-4 w-4" />Add Product</Button>
      </div>
      <div className="rounded-lg bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{['Name','Category','Price','Stock','Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan={5} className="py-8 text-center text-gray-400">Loading...</td></tr> :
              products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.category?.name || '-'}</td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3"><span className={p.stock <= 10 ? 'text-red-500 font-medium' : ''}>{p.stock}</span></td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
