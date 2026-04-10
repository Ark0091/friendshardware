import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const userId = (session.user as { id: string; role?: string }).id;
    const userRole = (session.user as { role?: string }).role;

    const query = userRole === 'admin' ? { _id: id } : { _id: id, user: userId };
    const order = await Order.findOne(query).populate('items.product', 'name images sku').lean();

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const userId = (session.user as { id: string; role?: string }).id;
    const userRole = (session.user as { role?: string }).role;

    await connectDB();

    const { id } = await params;
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (userRole !== 'admin') {
      if (order.user?.toString() !== userId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
      }
      if (body.status !== 'cancelled') {
        return NextResponse.json({ success: false, error: 'Customers can only cancel orders' }, { status: 403 });
      }
      if (!['pending', 'processing'].includes(order.status)) {
        return NextResponse.json({ success: false, error: 'Order cannot be cancelled' }, { status: 400 });
      }
    }

    if (body.status) {
      order.statusHistory.push({ status: body.status, timestamp: new Date(), note: body.note });
      order.status = body.status;
    }

    if (body.trackingNumber) order.trackingNumber = body.trackingNumber;
    if (body.trackingUrl) order.trackingUrl = body.trackingUrl;
    if (body.paymentStatus) order.paymentStatus = body.paymentStatus;
    if (body.paymentId) order.paymentId = body.paymentId;
    if (body.adminNote) order.notes = { ...order.notes, admin: body.adminNote };

    await order.save();

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
