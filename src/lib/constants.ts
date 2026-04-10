export const SITE_CONFIG = {
  name: 'Friends Hardware',
  tagline: 'Your Trusted Construction Materials Partner',
  description:
    'Friends Hardware - Premium quality construction materials including TMT Rebars, Cement, Steel, Paints, Sanitary Ware, Plywood, Roof Panels and House Interior Wares.',
  domain: 'friendshardware.store',
  url: 'https://friendshardware.store',
  email: 'info@friendshardware.store',
  phone: '+91 98765 43210',
  address: {
    street: '123 Hardware Market',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    country: 'India',
  },
  social: {
    facebook: 'https://facebook.com/friendshardware',
    instagram: 'https://instagram.com/friendshardware',
    twitter: 'https://twitter.com/friendshardware',
    youtube: 'https://youtube.com/friendshardware',
    whatsapp: 'https://wa.me/919876543210',
  },
};

export const PRODUCT_CATEGORIES = [
  {
    id: 'tmt-rebars',
    name: 'TMT Rebars',
    slug: 'tmt-rebars',
    description:
      'High-strength Thermo-Mechanically Treated steel bars for construction reinforcement',
    icon: '🏗️',
    image: '/images/categories/tmt-rebars.jpg',
  },
  {
    id: 'cements',
    name: 'Cements',
    slug: 'cements',
    description: 'Premium quality OPC and PPC cements from top brands for all construction needs',
    icon: '🏚️',
    image: '/images/categories/cements.jpg',
  },
  {
    id: 'ms-structural-steel',
    name: 'MS Structural Steel',
    slug: 'ms-structural-steel',
    description:
      'Mild steel structural sections - angles, channels, beams, and plates for industrial use',
    icon: '⚙️',
    image: '/images/categories/ms-steel.jpg',
  },
  {
    id: 'paints',
    name: 'Paints',
    slug: 'paints',
    description:
      'Interior and exterior paints, primers, and coatings from leading manufacturers',
    icon: '🎨',
    image: '/images/categories/paints.jpg',
  },
  {
    id: 'sanitary-ware',
    name: 'Sanitary Ware',
    slug: 'sanitary-ware',
    description:
      'Complete bathroom solutions including toilets, basins, showers, and fittings',
    icon: '🚿',
    image: '/images/categories/sanitary-ware.jpg',
  },
  {
    id: 'plywood',
    name: 'Plywood',
    slug: 'plywood',
    description: 'Commercial and marine grade plywood, block boards, and laminates',
    icon: '🪵',
    image: '/images/categories/plywood.jpg',
  },
  {
    id: 'roof-panels',
    name: 'Roof Panels',
    slug: 'roof-panels',
    description: 'Durable roofing solutions including metal sheets, tiles, and waterproofing',
    icon: '🏠',
    image: '/images/categories/roof-panels.jpg',
  },
  {
    id: 'house-interior-wares',
    name: 'House Interior Wares',
    slug: 'house-interior-wares',
    description: 'Complete interior hardware including doors, windows, handles, and fixtures',
    icon: '🪟',
    image: '/images/categories/interior-wares.jpg',
  },
];

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'returned', label: 'Returned', color: 'bg-gray-100 text-gray-800' },
];

export const PAYMENT_METHODS = [
  { value: 'stripe', label: 'Credit/Debit Card (Stripe)', icon: '💳' },
  { value: 'razorpay', label: 'Razorpay (UPI/Cards/Wallets)', icon: '📱' },
  { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export const TAX_RATE = 0.18; // 18% GST
export const FREE_SHIPPING_THRESHOLD = 5000; // Free shipping above ₹5000
export const SHIPPING_CHARGE = 299; // Standard shipping charge
export const ITEMS_PER_PAGE = 12;
