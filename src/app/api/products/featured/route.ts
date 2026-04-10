import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getFeaturedProducts } from '@/lib/sampleData';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(8)
      .lean();

    return NextResponse.json({ success: true, data: products });
  } catch {
    // MongoDB unavailable — fall back to sample data for preview
    return NextResponse.json({ success: true, data: getFeaturedProducts() });
  }
}
