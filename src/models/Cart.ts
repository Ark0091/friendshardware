import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  user?: mongoose.Types.ObjectId;
  sessionId?: string;
  items: ICartItem[];
  appliedCoupon?: string;
  couponDiscount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    sessionId: { type: String },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    appliedCoupon: { type: String },
    couponDiscount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cartSchema.index({ user: 1 });
cartSchema.index({ sessionId: 1 });

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', cartSchema);
export default Cart;
