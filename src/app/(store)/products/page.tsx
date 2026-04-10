import { Suspense } from 'react';
import ProductsContent from './ProductsContent';

export const metadata = {
  title: 'Products',
  description: 'Browse our complete range of construction materials',
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ProductsContent />
    </Suspense>
  );
}
