import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { registerSchema } from '@/lib/validators';
import { sendWelcomeEmail } from '@/services/sendgrid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = validation.data;

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || undefined,
      role: 'customer',
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ name: user.name, email: user.email }).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        data: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
