'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="mb-4 text-6xl">⚠️</div>
      <h2 className="mb-3 text-xl font-bold text-gray-800">Something went wrong</h2>
      <p className="mb-6 max-w-sm text-sm text-gray-500">
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} className="bg-orange-500 hover:bg-orange-600">Try Again</Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>Go Home</Button>
      </div>
    </div>
  );
}
