import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="mb-6 text-8xl font-black text-orange-200">404</div>
      <h1 className="mb-3 text-2xl font-bold text-gray-800">Page Not Found</h1>
      <p className="mb-8 max-w-sm text-gray-600">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button className="bg-orange-500 hover:bg-orange-600">Back to Home</Button>
      </Link>
    </div>
  );
}
