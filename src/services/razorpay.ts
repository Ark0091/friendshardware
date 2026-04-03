import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createOrder(
  amount: number,
  currency: string = 'INR',
  receipt: string,
  notes: Record<string, string> = {}
): Promise<{
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}> {
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt,
    notes,
  });

  return {
    id: order.id,
    amount: typeof order.amount === 'number' ? order.amount : parseInt(order.amount as string),
    currency: order.currency,
    receipt: order.receipt || receipt,
    status: order.status,
  };
}

export function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}

export async function fetchPayment(paymentId: string) {
  return razorpay.payments.fetch(paymentId);
}

export default razorpay;
