import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { orderSchema } from '@/lib/validators';
import { TAX_RATE, SHIPPING_CHARGE, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { sendOrderConfirmation } from '@/services/sendgrid';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = (session.user as { id: string; role?: string }).id;

    await connectDB();

    const query = { user: userId };
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = orderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.success === false ? validation.error.issues[0].message : 'Validation error' },
        { status: 400 }
      );
    }

    const { items, shippingAddress, paymentMethod, couponCode, notes } = validation.data;

    await connectDB();

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return NextResponse.json(
          { success: false, error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemPrice = product.price;
      subtotal += itemPrice * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url,
        price: itemPrice,
        quantity: item.quantity,
        sku: product.sku,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const tax = Math.round(subtotal * TAX_RATE);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
    const total = subtotal + tax + shipping;

    const userId = (session.user as { id: string }).id;

    const order = await Order.create({
      user: userId,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      discount: 0,
      total,
      status: 'pending',
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      shippingAddress,
      couponCode,
      notes: notes ? { customer: notes } : undefined,
    });

    // Clear cart after order
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    // Send confirmation email
    const user = session.user as { name?: string; email?: string };
    if (user.email) {
      sendOrderConfirmation(
        {
          orderNumber: order.orderNumber,
          items: orderItems.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
          total: order.total,
          shippingAddress,
        },
        { name: user.name || 'Customer', email: user.email }
      ).catch(console.error);
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
