import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    await connectDB();
    const userId = (session.user as { id: string }).id;
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notification.countDocuments({ user: userId }),
      Notification.countDocuments({ user: userId, isRead: false }),
    ]);

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { notificationIds, markAll } = await request.json();
    const userId = (session.user as { id: string }).id;

    await connectDB();

    if (markAll) {
      await Notification.updateMany({ user: userId }, { isRead: true });
    } else if (notificationIds?.length) {
      await Notification.updateMany({ _id: { $in: notificationIds }, user: userId }, { isRead: true });
    }

    return NextResponse.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Mark notifications error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update notifications' }, { status: 500 });
  }
}
