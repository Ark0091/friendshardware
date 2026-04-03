import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createPaymentIntent } from '@/services/stripe';

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
    const paymentIntent = await createPaymentIntent(amount, 'inr', {
      orderId: orderId || '',
      userId,
    });

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create payment intent' }, { status: 500 });
  }
}
