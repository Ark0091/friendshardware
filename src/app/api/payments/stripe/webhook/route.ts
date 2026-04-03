import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/services/stripe';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event;
  try {
    event = constructWebhookEvent(body, signature);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  await connectDB();

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'paid',
          paymentId: paymentIntent.id,
          status: 'processing',
          $push: { statusHistory: { status: 'processing', timestamp: new Date(), note: 'Payment received' } },
        });
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
      }
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
