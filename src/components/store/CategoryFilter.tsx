'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [openSections, setOpenSections] = useState({ categories: true, price: true, stock: true });

  const selectedCategory = searchParams.get('category');
  const inStock = searchParams.get('inStock') === 'true';

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const applyFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (priceRange.min) params.set('minPrice', priceRange.min);
    else params.delete('minPrice');
    if (priceRange.max) params.set('maxPrice', priceRange.max);
    else params.delete('maxPrice');
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/products');
    setPriceRange({ min: '', max: '' });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-gray-800">
          <Filter className="h-4 w-4" />
          Filters
        </h2>
        <button onClick={clearFilters} className="text-xs text-orange-500 hover:text-orange-600">
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-4 border-t pt-4">
        <button className="mb-3 flex w-full items-center justify-between text-sm font-semibold text-gray-700"
          onClick={() => toggleSection('categories')}>
          Categories
          {openSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {openSections.categories && (
          <div className="space-y-1">
            <button
              onClick={() => applyFilter('category', null)}
              className={`flex w-full items-center rounded-md px-3 py-2 text-sm transition ${!selectedCategory ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              All Categories
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => applyFilter('category', cat.slug)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition ${selectedCategory === cat.slug ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-4 border-t pt-4">
        <button className="mb-3 flex w-full items-center justify-between text-sm font-semibold text-gray-700"
          onClick={() => toggleSection('price')}>
          Price Range
          {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {openSections.price && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={priceRange.min}
                onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-orange-400 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={priceRange.max}
                onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-orange-400 focus:outline-none"
              />
            </div>
            <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600" onClick={applyPriceFilter}>
              Apply
            </Button>
          </div>
        )}
      </div>

      {/* In Stock */}
      <div className="border-t pt-4">
        <button className="mb-3 flex w-full items-center justify-between text-sm font-semibold text-gray-700"
          onClick={() => toggleSection('stock')}>
          Availability
          {openSections.stock ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {openSections.stock && (
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => applyFilter('inStock', e.target.checked ? 'true' : null)}
              className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
            />
            <span className="text-sm text-gray-600">In Stock Only</span>
          </label>
        )}
      </div>
    </div>
  );
}
