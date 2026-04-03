import mongoose, { Document, Schema } from 'mongoose';
import { OrderStatus, PaymentStatus } from '@/types';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  sku?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId;
  guestEmail?: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  paymentDetails?: Record<string, unknown>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  couponCode?: string;
  couponDiscount?: number;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: Date;
  notes?: {
    customer?: string;
    admin?: string;
  };
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' },
});

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    guestEmail: { type: String },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        sku: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentId: { type: String },
    paymentDetails: { type: Schema.Types.Mixed },
    shippingAddress: { type: addressSchema, required: true },
    billingAddress: { type: addressSchema },
    couponCode: { type: String },
    couponDiscount: { type: Number, default: 0 },
    trackingNumber: { type: String },
    trackingUrl: { type: String },
    estimatedDelivery: { type: Date },
    notes: {
      customer: { type: String },
      admin: { type: String },
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

orderSchema.pre('save', function (next) {
  if (this.isNew) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `FH-${timestamp}-${random}`;
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
export default Order;
