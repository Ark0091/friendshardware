'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Product, Review } from '@/types';
import { formatPrice, calculateDiscount, getStockStatus } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingCart, Heart, Minus, Plus, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StarRating from '@/components/store/StarRating';
import ReviewCard from '@/components/store/ReviewCard';
import { PageLoader } from '@/components/ui/loading';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`/api/products/${id}`),
          axios.get(`/api/reviews?productId=${id}`),
        ]);
        if (productRes.data.success) {
          const p = productRes.data.data;
          setProduct({ ...p, id: p._id });
        }
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.data.map((r: { _id: string } & Omit<Review, 'id'>) => ({ ...r, id: r._id })));
        }
      } catch (error) {
        console.error('Product fetch error:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return <PageLoader />;
  if (!product) return <div className="flex min-h-[400px] items-center justify-center"><p className="text-gray-500">Product not found</p></div>;

  const stockStatus = getStockStatus(product.stock);
  const discountPercent = product.comparePrice ? calculateDiscount(product.comparePrice, product.price) : 0;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async () => {
    if (product.stock === 0) return;
    setAddingToCart(true);
    await addToCart(product.id, quantity);
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    window.location.href = '/checkout';
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <span className="hover:text-orange-500 cursor-pointer" onClick={() => window.location.href = '/'}>Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-orange-500 cursor-pointer" onClick={() => window.location.href = '/products'}>Products</span>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-gray-100">
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].alt || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl text-gray-300">📦</div>
              )}
              {discountPercent > 0 && (
                <Badge className="absolute left-3 top-3 bg-orange-500 text-white text-sm border-0">
                  -{discountPercent}%
                </Badge>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition ${selectedImage === i ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.category && typeof product.category === 'object' && (
              <p className="mb-2 text-sm font-medium text-orange-500">{product.category.name}</p>
            )}
            <h1 className="mb-3 text-2xl font-bold text-gray-900 lg:text-3xl">{product.name}</h1>

            {/* Rating */}
            <div className="mb-4 flex items-center gap-3">
              <StarRating rating={product.ratings.average} size="md" />
              <span className="text-sm text-gray-500">({product.ratings.count} reviews)</span>
              {product.sku && <span className="text-xs text-gray-400 ml-auto">SKU: {product.sku}</span>}
            </div>

            {/* Price */}
            <div className="mb-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                  <Badge className="bg-green-100 text-green-700 border-0">Save {discountPercent}%</Badge>
                </>
              )}
            </div>

            {/* Stock */}
            <p className={`mb-4 text-sm font-semibold ${stockStatus.color}`}>● {stockStatus.label}</p>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="mb-5 text-sm text-gray-600 leading-relaxed">{product.shortDescription}</p>
            )}

            {/* Bulk Pricing */}
            {product.bulkPricing && product.bulkPricing.length > 0 && (
              <div className="mb-5 rounded-lg bg-blue-50 p-3">
                <p className="mb-2 text-xs font-semibold text-blue-700">Bulk Pricing</p>
                <div className="flex flex-wrap gap-2">
                  {product.bulkPricing.map((bp, i) => (
                    <div key={i} className="rounded-md bg-white px-2 py-1 text-xs border border-blue-200">
                      {bp.minQuantity}+ units: <strong>{formatPrice(bp.price)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-5 flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center rounded-md border border-gray-300">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center text-gray-500 hover:bg-gray-100">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-9 min-w-[2.5rem] items-center justify-center text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="flex h-9 w-9 items-center justify-center text-gray-500 hover:bg-gray-100">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mb-4 flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="flex-1 bg-orange-500 hover:bg-orange-600 gap-2"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4" />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button onClick={handleBuyNow} disabled={product.stock === 0} variant="outline" size="lg" className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-50">
                Buy Now
              </Button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product.id)}
                className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition ${inWishlist ? 'border-red-300 text-red-500 bg-red-50' : 'border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500'}`}
              >
                <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
                {inWishlist ? 'Saved' : 'Save'}
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-gray-400">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10">
          <div className="border-b">
            <div className="flex gap-6">
              {(['description', 'specifications', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 pb-3 text-sm font-medium capitalize transition ${activeTab === tab ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  {tab} {tab === 'reviews' && `(${reviews.length})`}
                </button>
              ))}
            </div>
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-sm text-gray-700 leading-relaxed">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                {product.specifications && product.specifications.length > 0 ? (
                  <table className="w-full max-w-lg text-sm">
                    <tbody>
                      {product.specifications.map((spec, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-2.5 font-medium text-gray-700 w-1/3">{spec.key}</td>
                          <td className="px-4 py-2.5 text-gray-600">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No specifications available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {reviews.length === 0 ? (
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
