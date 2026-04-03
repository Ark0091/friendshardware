import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { generateSlug } from '@/lib/utils';

async function requireAdmin(session: ReturnType<typeof getServerSession> extends Promise<infer T> ? T : never) {
  if (!session || (session.user as { role?: string }).role !== 'admin') {
    return false;
  }
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (search) query.$text = { $search: search };
    if (category) query.category = category;

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query).populate('category', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Admin products fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    await connectDB();

    const slug = body.slug || generateSlug(body.name);
    const product = await Product.create({ ...body, slug });
    await product.populate('category', 'name slug');

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Admin create product error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
