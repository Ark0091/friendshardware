import { Review } from '@/types';
import { formatDate, getInitials } from '@/lib/utils';
import StarRating from './StarRating';
import { CheckCircle } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-semibold text-sm">
            {review.user?.name ? getInitials(review.user.name) : '?'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{review.user?.name || 'Anonymous'}</p>
            <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        {review.isVerified && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Verified Purchase</span>
          </div>
        )}
      </div>

      <StarRating rating={review.rating} size="sm" className="mb-2" />

      {review.title && (
        <h4 className="mb-1 text-sm font-semibold text-gray-800">{review.title}</h4>
      )}
      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
    </div>
  );
}
