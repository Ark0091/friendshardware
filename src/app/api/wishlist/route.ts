import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as { id: string }).id;
    const user = await User.findById(userId).populate('wishlist', 'name slug images price comparePrice ratings isActive stock');

    return NextResponse.json({ success: true, data: user?.wishlist || [] });
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    await connectDB();
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const userId = (session.user as { id: string }).id;
    await User.findByIdAndUpdate(userId, { $addToSet: { wishlist: productId } });

    return NextResponse.json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();
    const userId = (session.user as { id: string }).id;

    await connectDB();
    await User.findByIdAndUpdate(userId, { $pull: { wishlist: productId } });

    return NextResponse.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json({ success: false, error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}
