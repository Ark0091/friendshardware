import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@friendshardware.store';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'Friends Hardware';

interface OrderUser {
  name: string;
  email: string;
}

interface OrderData {
  orderNumber: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  shippingAddress: { street: string; city: string; state: string; pincode: string };
  status?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export async function sendOrderConfirmation(order: OrderData, user: OrderUser): Promise<void> {
  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
        </tr>`
    )
    .join('');

  const msg = {
    to: user.email,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: `Order Confirmed - ${order.orderNumber} | Friends Hardware`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f97316; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Friends Hardware</h1>
        </div>
        <div style="background: #fff; border: 1px solid #e5e7eb; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #111827;">Order Confirmed! 🎉</h2>
          <p>Dear ${user.name},</p>
          <p>Thank you for your order. We've received your order and will start processing it shortly.</p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <strong>Order Number:</strong> ${order.orderNumber}
          </div>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #f97316;">₹${order.total.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>
          <div style="margin-top: 20px;">
            <strong>Shipping to:</strong>
            <p>${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
          </div>
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            You can track your order on our website. If you have any questions, contact us at info@friendshardware.store
          </p>
        </div>
      </div>
    `,
  };

  await sgMail.send(msg);
}

export async function sendShipmentNotification(order: OrderData, user: OrderUser): Promise<void> {
  const msg = {
    to: user.email,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: `Your Order ${order.orderNumber} Has Been Shipped! | Friends Hardware`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f97316; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Friends Hardware</h1>
        </div>
        <div style="background: #fff; border: 1px solid #e5e7eb; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2>Your Order Is On The Way! 🚚</h2>
          <p>Dear ${user.name},</p>
          <p>Great news! Your order <strong>${order.orderNumber}</strong> has been shipped.</p>
          ${order.trackingNumber ? `<div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;"><strong>Tracking Number:</strong> ${order.trackingNumber}</div>` : ''}
          ${order.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery}</p>` : ''}
          <p style="margin-top: 30px; color: #6b7280;">Thank you for shopping with Friends Hardware!</p>
        </div>
      </div>
    `,
  };

  await sgMail.send(msg);
}

export async function sendPasswordReset(email: string, token: string): Promise<void> {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const msg = {
    to: email,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: 'Password Reset Request | Friends Hardware',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f97316; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Friends Hardware</h1>
        </div>
        <div style="background: #fff; border: 1px solid #e5e7eb; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #f97316; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  await sgMail.send(msg);
}

export async function sendWelcomeEmail(user: { name: string; email: string }): Promise<void> {
  const msg = {
    to: user.email,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: 'Welcome to Friends Hardware! 🏗️',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f97316; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Friends Hardware</h1>
        </div>
        <div style="background: #fff; border: 1px solid #e5e7eb; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2>Welcome, ${user.name}! 🎉</h2>
          <p>Thank you for creating an account with Friends Hardware - your trusted construction materials partner.</p>
          <p>Explore our wide range of products:</p>
          <ul>
            <li>TMT Rebars & Structural Steel</li>
            <li>Premium Cements</li>
            <li>Paints & Coatings</li>
            <li>Sanitary Ware</li>
            <li>Plywood & Roof Panels</li>
            <li>House Interior Wares</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/products" style="background: #f97316; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">Start Shopping</a>
          </div>
        </div>
      </div>
    `,
  };

  await sgMail.send(msg);
}

export async function sendNewsletterEmail(
  subscribers: string[],
  subject: string,
  content: string
): Promise<void> {
  const messages = subscribers.map((email) => ({
    to: email,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject,
    html: content,
  }));

  await sgMail.send(messages);
}
