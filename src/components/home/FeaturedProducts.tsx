'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Product } from '@/types';
import ProductGrid from '@/components/store/ProductGrid';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/products/featured')
      .then(({ data }) => {
        if (data.success) {
          const mapped = data.data.map((p: { _id: string } & Omit<Product, 'id'>) => ({ ...p, id: p._id }));
          setProducts(mapped);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return <ProductGrid products={products} loading={loading} skeletonCount={8} />;
}
