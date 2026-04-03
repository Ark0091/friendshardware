import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function createPaymentIntent(
  amount: number,
  currency: string = 'inr',
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
}

export async function createCheckoutSession(
  order: {
    id: string;
    items: Array<{ name: string; quantity: number; price: number; image?: string }>;
    total: number;
  },
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  return stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { orderId: order.id },
  });
}

export async function retrievePaymentIntent(id: string): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.retrieve(id);
}

export function constructWebhookEvent(
  body: string | Buffer,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
}

export default stripe;
