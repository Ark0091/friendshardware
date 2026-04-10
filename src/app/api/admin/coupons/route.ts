import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Coupon from '@/models/Coupon';
import { couponSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    await connectDB();
    const skip = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      Coupon.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Coupon.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: coupons,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Coupons fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const validation = couponSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.issues[0].message }, { status: 400 });
    }

    await connectDB();
    const coupon = await Coupon.create(validation.data);

    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (error) {
    console.error('Create coupon error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create coupon' }, { status: 500 });
  }
}
