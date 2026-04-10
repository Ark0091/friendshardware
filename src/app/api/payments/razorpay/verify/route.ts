import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { verifyPayment } from '@/services/razorpay';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Missing payment details' }, { status: 400 });
    }

    const isValid = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 400 });
    }

    if (orderId) {
      await connectDB();
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        status: 'processing',
        paymentDetails: { razorpay_order_id, razorpay_payment_id },
        $push: { statusHistory: { status: 'processing', timestamp: new Date(), note: 'Payment verified' } },
      });
    }

    return NextResponse.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    return NextResponse.json({ success: false, error: 'Failed to verify payment' }, { status: 500 });
  }
}
