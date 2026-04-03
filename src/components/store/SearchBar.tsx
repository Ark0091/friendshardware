'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import axios from 'axios';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/products?search=${encodeURIComponent(query)}&limit=5`);
        if (data.success) {
          setResults(data.data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for TMT Bars, Cement, Paints..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-10 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          {query && (
            <button type="button" onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {isOpen && (results.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border bg-white shadow-xl">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
          ) : (
            <>
              {results.map((product) => (
                <button
                  key={product.id}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-orange-50"
                  onClick={() => { router.push(`/product/${product.slug || product.id}`); setIsOpen(false); setQuery(''); }}
                >
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                    {product.images?.[0] && (
                      <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-orange-500 font-medium">{formatPrice(product.price)}</p>
                  </div>
                </button>
              ))}
              <div className="border-t px-4 py-2">
                <button onClick={() => { router.push(`/products?search=${query}`); setIsOpen(false); }}
                  className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                  See all results for &quot;{query}&quot; →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
