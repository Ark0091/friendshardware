import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(8)
      .lean();

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Featured products error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch featured products' }, { status: 500 });
  }
}
