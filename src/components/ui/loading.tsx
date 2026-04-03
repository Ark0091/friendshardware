import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-orange-500 border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-gray-200', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <LoadingSkeleton className="mb-3 h-48 w-full rounded-md" />
      <LoadingSkeleton className="mb-2 h-4 w-3/4" />
      <LoadingSkeleton className="mb-3 h-4 w-1/2" />
      <LoadingSkeleton className="h-8 w-full" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
