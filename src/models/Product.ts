import mongoose, { Document, Schema } from 'mongoose';

export interface IProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface ISpecification {
  key: string;
  value: string;
}

export interface IBulkPricing {
  minQuantity: number;
  price: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: mongoose.Types.ObjectId;
  brand?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  images: IProductImage[];
  stock: number;
  sku: string;
  barcode?: string;
  specifications: ISpecification[];
  ratings: {
    average: number;
    count: number;
  };
  tags: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  bulkPricing: IBulkPricing[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    costPrice: { type: Number, min: 0 },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true },
    barcode: { type: String },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    tags: [{ type: String }],
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    bulkPricing: [
      {
        minQuantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
export default Product;
