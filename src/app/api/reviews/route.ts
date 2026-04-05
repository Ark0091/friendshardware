import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { reviewSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!productId) {
    return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
  }

  try {
    await connectDB();
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ product: productId, isApproved: true })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments({ product: productId, isApproved: true }),
    ]);

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch {
    // MongoDB unavailable — return empty reviews for preview
    return NextResponse.json({
      success: true,
      data: [],
      pagination: { page, limit, total: 0, pages: 0 },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = reviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.issues[0].message }, { status: 400 });
    }

    const { productId, rating, title, comment } = validation.data;
    const userId = (session.user as { id: string }).id;

    await connectDB();

    const existingReview = await Review.findOne({ product: productId, user: userId });
    if (existingReview) {
      return NextResponse.json({ success: false, error: 'You have already reviewed this product' }, { status: 409 });
    }

    const review = await Review.create({ product: productId, user: userId, rating, title, comment });

    // Update product ratings
    const reviews = await Review.find({ product: productId, isApproved: true });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      'ratings.average': Math.round(avgRating * 10) / 10,
      'ratings.count': reviews.length,
    });

    await review.populate('user', 'name avatar');
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create review' }, { status: 500 });
  }
}
