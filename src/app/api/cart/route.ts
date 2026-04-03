import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as { id: string }).id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name images price stock sku');

    return NextResponse.json({ success: true, data: cart || { items: [] } });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();
    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    await connectDB();
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    if (product.stock < quantity) {
      return NextResponse.json({ success: false, error: 'Insufficient stock' }, { status: 400 });
    }

    const userId = (session.user as { id: string }).id;
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item: { product: { toString: () => string } }) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    await cart.save();
    await cart.populate('items.product', 'name images price stock sku');

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as { id: string }).id;
    await Cart.findOneAndUpdate({ user: userId }, { items: [], appliedCoupon: null, couponDiscount: 0 });

    return NextResponse.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json({ success: false, error: 'Failed to clear cart' }, { status: 500 });
  }
}
