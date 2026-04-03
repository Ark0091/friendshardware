'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Product } from '@/types';
import ProductGrid from '@/components/store/ProductGrid';
import CategoryFilter from '@/components/store/CategoryFilter';
import { SORT_OPTIONS, ITEMS_PER_PAGE } from '@/lib/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        params.set('limit', String(ITEMS_PER_PAGE));
        const { data } = await axios.get(`/api/products?${params.toString()}`);
        if (data.success) {
          const mapped = data.data.map((p: { _id: string } & Omit<Product, 'id'>) => ({ ...p, id: p._id }));
          setProducts(mapped);
          setTotal(data.pagination.total);
          setTotalPages(data.pagination.pages);
        }
      } catch (error) {
        console.error('Fetch products error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.delete('page');
    window.history.pushState({}, '', `/products?${params.toString()}`);
    window.dispatchEvent(new Event('popstate'));
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    window.location.href = `/products?${params.toString()}`;
  };

  const searchQuery = searchParams.get('search');
  const categorySlug = searchParams.get('category');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `Search: "${searchQuery}"` : categorySlug ? categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'All Products'}
            </h1>
            {!loading && <p className="text-sm text-gray-500">{total} products found</p>}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-orange-400 focus:outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <CategoryFilter />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <ProductGrid products={products} loading={loading} />

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="flex h-8 w-8 items-center justify-center rounded-md border text-gray-600 disabled:opacity-40 hover:bg-gray-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm ${currentPage === page ? 'bg-orange-500 text-white border-orange-500' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-md border text-gray-600 disabled:opacity-40 hover:bg-gray-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
