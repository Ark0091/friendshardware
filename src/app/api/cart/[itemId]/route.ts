import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';

export async function PATCH(request: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { quantity } = await request.json();
    if (!quantity || quantity < 1) {
      return NextResponse.json({ success: false, error: 'Invalid quantity' }, { status: 400 });
    }

    await connectDB();
    const userId = (session.user as { id: string }).id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json({ success: false, error: 'Cart not found' }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      (item: { _id: { toString: () => string } }) => item._id.toString() === params.itemId
    );

    if (itemIndex === -1) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product', 'name images price stock sku');

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error('Update cart item error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update cart item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as { id: string }).id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json({ success: false, error: 'Cart not found' }, { status: 404 });
    }

    cart.items = cart.items.filter(
      (item: { _id: { toString: () => string } }) => item._id.toString() !== params.itemId
    );
    await cart.save();
    await cart.populate('items.product', 'name images price stock sku');

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error('Remove cart item error:', error);
    return NextResponse.json({ success: false, error: 'Failed to remove cart item' }, { status: 500 });
  }
}
