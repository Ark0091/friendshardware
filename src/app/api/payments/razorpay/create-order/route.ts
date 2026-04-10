import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createOrder } from '@/services/razorpay';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, orderId } = await request.json();
    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }

    const userId = (session.user as { id: string }).id;
    const razorpayOrder = await createOrder(amount, 'INR', `order_${orderId || Date.now()}`, {
      userId,
      orderId: orderId || '',
    });

    return NextResponse.json({ success: true, data: razorpayOrder });
  } catch (error) {
    console.error('Razorpay create order error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create Razorpay order' }, { status: 500 });
  }
}
