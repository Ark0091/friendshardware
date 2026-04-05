// Sample product data used as fallback when MongoDB is unavailable (e.g. local preview)

export interface SampleCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface SampleProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: SampleCategory;
  brand: string;
  price: number;
  comparePrice: number;
  images: { url: string; alt: string; isPrimary: boolean }[];
  stock: number;
  sku: string;
  specifications: { key: string; value: string }[];
  ratings: { average: number; count: number };
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  bulkPricing: { minQuantity: number; price: number }[];
  createdAt: string;
  updatedAt: string;
}

export const SAMPLE_CATEGORIES: SampleCategory[] = [
  { _id: 'cat-tmt', name: 'TMT Rebars', slug: 'tmt-rebars' },
  { _id: 'cat-cement', name: 'Cements', slug: 'cements' },
  { _id: 'cat-steel', name: 'MS Structural Steel', slug: 'ms-structural-steel' },
  { _id: 'cat-paints', name: 'Paints', slug: 'paints' },
  { _id: 'cat-sanitary', name: 'Sanitary Ware', slug: 'sanitary-ware' },
  { _id: 'cat-plywood', name: 'Plywood', slug: 'plywood' },
  { _id: 'cat-roof', name: 'Roof Panels', slug: 'roof-panels' },
  { _id: 'cat-interior', name: 'House Interior Wares', slug: 'house-interior-wares' },
];

const img = (name: string) =>
  `https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(name)}`;

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  // TMT Rebars
  {
    _id: 'prod-001',
    name: 'TATA Tiscon 500D TMT Bar 8mm',
    slug: 'tata-tiscon-500d-tmt-bar-8mm',
    description:
      'TATA Tiscon 500D TMT bars are the most preferred choice of leading contractors and builders in India. High strength Fe 500D grade bars with superior ductility and weldability.',
    shortDescription: 'High-strength Fe 500D TMT bar for RCC construction',
    category: SAMPLE_CATEGORIES[0],
    brand: 'TATA Tiscon',
    price: 5800,
    comparePrice: 6200,
    images: [{ url: img('TATA Tiscon 8mm'), alt: 'TATA Tiscon 8mm TMT Bar', isPrimary: true }],
    stock: 250,
    sku: 'TMT-TATA-8MM',
    specifications: [
      { key: 'Grade', value: 'Fe 500D' },
      { key: 'Diameter', value: '8 mm' },
      { key: 'Length', value: '12 m' },
      { key: 'Weight per piece', value: '4.74 kg' },
      { key: 'IS Standard', value: 'IS 1786:2008' },
    ],
    ratings: { average: 4.8, count: 312 },
    tags: ['tmt', 'rebar', 'tata', 'construction', '8mm'],
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    bulkPricing: [
      { minQuantity: 50, price: 5600 },
      { minQuantity: 100, price: 5400 },
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: 'prod-002',
    name: 'Kamdhenu Super TMT Bar 12mm',
    slug: 'kamdhenu-super-tmt-bar-12mm',
    description:
      'Kamdhenu Super TMT Bars are produced using the latest Tempcore technology ensuring uniform and consistent strength throughout. Ideal for residential and commercial construction.',
    shortDescription: 'Fe 500 grade TMT bar — ideal for residential buildings',
    category: SAMPLE_CATEGORIES[0],
    brand: 'Kamdhenu',
    price: 6100,
    comparePrice: 6500,
    images: [{ url: img('Kamdhenu 12mm'), alt: 'Kamdhenu 12mm TMT Bar', isPrimary: true }],
    stock: 180,
    sku: 'TMT-KAMD-12MM',
    specifications: [
      { key: 'Grade', value: 'Fe 500' },
      { key: 'Diameter', value: '12 mm' },
      { key: 'Length', value: '12 m' },
      { key: 'Weight per piece', value: '10.68 kg' },
    ],
    ratings: { average: 4.6, count: 178 },
    tags: ['tmt', 'rebar', 'kamdhenu', '12mm'],
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    bulkPricing: [{ minQuantity: 50, price: 5900 }],
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    _id: 'prod-003',
    name: 'JSW Neo Steel TMT Bar 16mm',
    slug: 'jsw-neo-steel-tmt-bar-16mm',
    description:
      'JSW Neo Steel TMT Bars with CRM technology deliver superior strength, better bonding and high corrosion resistance, making them perfect for earthquake-resistant construction.',
    shortDescription: 'CRM-technology TMT bar for earthquake-resistant structures',
    category: SAMPLE_CATEGORIES[0],
    brand: 'JSW Steel',
    price: 6350,
    comparePrice: 6800,
    images: [{ url: img('JSW Neo 16mm'), alt: 'JSW Neo Steel 16mm TMT Bar', isPrimary: true }],
    stock: 120,
    sku: 'TMT-JSW-16MM',
    specifications: [
      { key: 'Grade', value: 'Fe 550D' },
      { key: 'Diameter', value: '16 mm' },
      { key: 'Length', value: '12 m' },
      { key: 'Weight per piece', value: '18.96 kg' },
    ],
    ratings: { average: 4.7, count: 95 },
    tags: ['tmt', 'rebar', 'jsw', '16mm', 'earthquake-resistant'],
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    bulkPricing: [{ minQuantity: 25, price: 6100 }],
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },

  // Cements
  {
    _id: 'prod-004',
    name: 'UltraTech PPC Cement 50kg',
    slug: 'ultratech-ppc-cement-50kg',
    description:
      'UltraTech Portland Pozzolana Cement (PPC) is the most preferred cement brand in India. It provides high durability, better workability and excellent resistance to sulphate attack.',
    shortDescription: 'Premium Portland Pozzolana Cement for all construction needs',
    category: SAMPLE_CATEGORIES[1],
    brand: 'UltraTech',
    price: 420,
    comparePrice: 460,
    images: [{ url: img('UltraTech PPC 50kg'), alt: 'UltraTech PPC Cement 50kg', isPrimary: true }],
    stock: 800,
    sku: 'CEM-UT-PPC-50',
    specifications: [
      { key: 'Type', value: 'Portland Pozzolana Cement (PPC)' },
      { key: 'Weight', value: '50 kg' },
      { key: 'IS Standard', value: 'IS 1489 Part 1' },
      { key: 'Compressive Strength (28 days)', value: '≥ 33 MPa' },
    ],
    ratings: { average: 4.9, count: 521 },
    tags: ['cement', 'ppc', 'ultratech', 'construction'],
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    bulkPricing: [
      { minQuantity: 100, price: 405 },
      { minQuantity: 500, price: 390 },
    ],
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
  {
    _id: 'prod-005',
    name: 'Ambuja Cement OPC 53 Grade 50kg',
    slug: 'ambuja-cement-opc-53-grade-50kg',
    description:
      'Ambuja OPC 53 Grade Cement is ideal for all types of concrete work requiring high strength including pre-stressed concrete, high-rise buildings and bridges.',
    shortDescription: 'High-strength OPC 53 Grade for demanding concrete work',
    category: SAMPLE_CATEGORIES[1],
    brand: 'Ambuja',
    price: 435,
    comparePrice: 475,
    images: [{ url: img('Ambuja OPC 53'), alt: 'Ambuja OPC 53 Grade Cement 50kg', isPrimary: true }],
    stock: 600,
    sku: 'CEM-AMB-OPC53-50',
    specifications: [
      { key: 'Type', value: 'Ordinary Portland Cement (OPC)' },
      { key: 'Grade', value: '53' },
      { key: 'Weight', value: '50 kg' },
      { key: 'IS Standard', value: 'IS 269:2015' },
    ],
    ratings: { average: 4.7, count: 389 },
    tags: ['cement', 'opc', 'ambuja', 'high-strength'],
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    bulkPricing: [{ minQuantity: 100, price: 418 }],
    createdAt: '2024-01-04T00:00:00.000Z',
    updatedAt: '2024-01-04T00:00:00.000Z',
  },

  // MS Structural Steel
  {
    _id: 'prod-006',
    name: 'MS Angle Iron 50x50x6mm (6m)',
    slug: 'ms-angle-iron-50x50x6mm',
    description:
      'Mild Steel Equal Angle Iron used for structural fabrication, frames, brackets and supports. Hot-rolled with smooth finish.',
    shortDescription: 'Equal angle iron for structural fabrication and framing',
    category: SAMPLE_CATEGORIES[2],
    brand: 'SAIL',
    price: 2800,
    comparePrice: 3100,
    images: [{ url: img('MS Angle 50x50x6'), alt: 'MS Angle Iron 50x50x6mm', isPrimary: true }],
    stock: 90,
    sku: 'MSS-ANGLE-50X50X6',
    specifications: [
      { key: 'Size', value: '50 x 50 mm' },
      { key: 'Thickness', value: '6 mm' },
      { key: 'Length', value: '6 m' },
      { key: 'Weight per piece', value: '27.4 kg' },
      { key: 'Grade', value: 'IS 2062 E250' },
    ],
    ratings: { average: 4.5, count: 67 },
    tags: ['ms', 'angle', 'structural', 'steel', 'sail'],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    bulkPricing: [{ minQuantity: 20, price: 2600 }],
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z',
  },
  {
    _id: 'prod-007',
    name: 'MS Hollow Square Tube 40x40x2mm (6m)',
    slug: 'ms-hollow-square-tube-40x40x2mm',
    description:
      'Mild Steel Hollow Square Tube for gate fabrication, furniture frames and general structural applications. ERW welded with uniform thickness.',
    shortDescription: 'ERW hollow square tube for gates and furniture frames',
    category: SAMPLE_CATEGORIES[2],
    brand: 'Surya Roshni',
    price: 1950,
    comparePrice: 2200,
    images: [
      { url: img('MS Square Tube 40x40'), alt: 'MS Hollow Square Tube 40x40x2mm', isPrimary: true },
    ],
    stock: 140,
    sku: 'MSS-SQTUBE-40X40X2',
    specifications: [
      { key: 'Size', value: '40 x 40 mm' },
      { key: 'Thickness', value: '2 mm' },
      { key: 'Length', value: '6 m' },
      { key: 'Type', value: 'ERW Welded' },
    ],
    ratings: { average: 4.4, count: 44 },
    tags: ['ms', 'tube', 'hollow', 'structural', 'gate'],
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    bulkPricing: [],
    createdAt: '2024-01-06T00:00:00.000Z',
    updatedAt: '2024-01-06T00:00:00.000Z',
  },

  // Paints
  {
    _id: 'prod-008',
    name: 'Asian Paints Apex Weatherproof Exterior 20L',
    slug: 'asian-paints-apex-weatherproof-exterior-20l',
    description:
      'Asian Paints Apex is India\'s leading exterior emulsion paint with excellent weatherproofing, UV resistance and anti-algal/anti-fungal properties. Keeps walls looking new for years.',
    shortDescription: 'India\'s #1 exterior emulsion with 7-year weatherproofing warranty',
    category: SAMPLE_CATEGORIES[3],
    brand: 'Asian Paints',
    price: 3850,
    comparePrice: 4200,
    images: [
      { url: img('Asian Apex 20L'), alt: 'Asian Paints Apex Weatherproof 20L', isPrimary: true },
    ],
    stock: 55,
    sku: 'PAINT-AP-APEX-20L',
    specifications: [
      { key: 'Volume', value: '20 Litres' },
      { key: 'Coverage', value: '120–140 sq ft / litre' },
      { key: 'Finish', value: 'Smooth Sheen' },
      { key: 'Drying Time', value: '2 hours (touch dry)' },
      { key: 'Application', value: 'Exterior walls' },
    ],
    ratings: { average: 4.8, count: 203 },
    tags: ['paint', 'exterior', 'asian paints', 'weatherproof'],
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    bulkPricing: [{ minQuantity: 5, price: 3700 }],
    createdAt: '2024-01-07T00:00:00.000Z',
    updatedAt: '2024-01-07T00:00:00.000Z',
  },
  {
    _id: 'prod-009',
    name: 'Berger Silk Interior Emulsion 10L',
    slug: 'berger-silk-interior-emulsion-10l',
    description:
      'Berger Silk offers a luxurious silk-like finish with washable surface and rich pigmentation. Ideal for interior walls and ceilings.',
    shortDescription: 'Premium washable interior paint with silk-like finish',
    category: SAMPLE_CATEGORIES[3],
    brand: 'Berger',
    price: 1980,
    comparePrice: 2200,
    images: [
      { url: img('Berger Silk 10L'), alt: 'Berger Silk Interior Emulsion 10L', isPrimary: true },
    ],
    stock: 72,
    sku: 'PAINT-BG-SILK-10L',
    specifications: [
      { key: 'Volume', value: '10 Litres' },
      { key: 'Coverage', value: '130–150 sq ft / litre' },
      { key: 'Finish', value: 'Silk / Semi-gloss' },
      { key: 'Application', value: 'Interior walls & ceilings' },
    ],
    ratings: { average: 4.6, count: 142 },
    tags: ['paint', 'interior', 'berger', 'silk', 'washable'],
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    bulkPricing: [],
    createdAt: '2024-03-01T00:00:00.000Z',
    updatedAt: '2024-03-01T00:00:00.000Z',
  },

  // Sanitary Ware
  {
    _id: 'prod-010',
    name: 'Cera Wall-Hung WC with Soft-Close Seat',
    slug: 'cera-wall-hung-wc-soft-close-seat',
    description:
      'Cera wall-hung toilet with rimless design for easy cleaning and hygienic use. Includes soft-close seat cover and dual-flush cistern mechanism.',
    shortDescription: 'Rimless wall-hung WC with dual-flush and soft-close seat',
    category: SAMPLE_CATEGORIES[4],
    brand: 'Cera',
    price: 12500,
    comparePrice: 14800,
    images: [
      { url: img('Cera Wall-Hung WC'), alt: 'Cera Wall-Hung WC with Soft-Close Seat', isPrimary: true },
    ],
    stock: 18,
    sku: 'SAN-CERA-WH-WC-001',
    specifications: [
      { key: 'Type', value: 'Wall-Hung' },
      { key: 'Flush', value: 'Dual Flush (3L / 6L)' },
      { key: 'Seat', value: 'Soft-Close PP Seat' },
      { key: 'Design', value: 'Rimless' },
      { key: 'Colour', value: 'Ivory White' },
    ],
    ratings: { average: 4.7, count: 88 },
    tags: ['toilet', 'wc', 'cera', 'wall-hung', 'rimless'],
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    bulkPricing: [],
    createdAt: '2024-01-08T00:00:00.000Z',
    updatedAt: '2024-01-08T00:00:00.000Z',
  },
  {
    _id: 'prod-011',
    name: 'Jaguar Single-Lever Basin Mixer Tap',
    slug: 'jaguar-single-lever-basin-mixer-tap',
    description:
      'Jaguar Florentine single-lever basin mixer with pull-out spout and ceramic cartridge for drip-free operation. Chrome finish complements any bathroom décor.',
    shortDescription: 'Chrome basin mixer with ceramic cartridge and pull-out spout',
    category: SAMPLE_CATEGORIES[4],
    brand: 'Jaguar',
    price: 3200,
    comparePrice: 3800,
    images: [
      { url: img('Jaguar Basin Mixer'), alt: 'Jaguar Single-Lever Basin Mixer', isPrimary: true },
    ],
    stock: 35,
    sku: 'SAN-JAG-BM-FLO',
    specifications: [
      { key: 'Type', value: 'Single Lever Mixer' },
      { key: 'Finish', value: 'Chrome' },
      { key: 'Cartridge', value: 'Ceramic' },
      { key: 'Spout Reach', value: '150 mm' },
    ],
    ratings: { average: 4.5, count: 61 },
    tags: ['tap', 'mixer', 'jaguar', 'basin', 'chrome'],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    bulkPricing: [],
    createdAt: '2024-01-09T00:00:00.000Z',
    updatedAt: '2024-01-09T00:00:00.000Z',
  },

  // Plywood
  {
    _id: 'prod-012',
    name: 'Century Bond 710 Plywood 19mm (8x4 ft)',
    slug: 'century-bond-710-plywood-19mm',
    description:
      'Century Bond 710 BWP (Boiling Water Proof) plywood is ideal for kitchen cabinets, bathroom furniture and all moisture-prone applications. Zero added formaldehyde.',
    shortDescription: 'BWP/Marine grade plywood for moisture-prone applications',
    category: SAMPLE_CATEGORIES[5],
    brand: 'Century Ply',
    price: 3200,
    comparePrice: 3600,
    images: [
      { url: img('Century Bond 710 19mm'), alt: 'Century Bond 710 BWP Plywood 19mm', isPrimary: true },
    ],
    stock: 45,
    sku: 'PLY-CB710-19MM-8X4',
    specifications: [
      { key: 'Thickness', value: '19 mm' },
      { key: 'Size', value: '8 x 4 ft (2440 x 1220 mm)' },
      { key: 'Grade', value: 'BWP / Marine' },
      { key: 'Glue', value: 'Phenol Formaldehyde (BWP)' },
      { key: 'IS Standard', value: 'IS 303:1989' },
    ],
    ratings: { average: 4.8, count: 156 },
    tags: ['plywood', 'bwp', 'marine', 'century', 'kitchen'],
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    bulkPricing: [{ minQuantity: 10, price: 3050 }],
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },

  // Roof Panels
  {
    _id: 'prod-013',
    name: 'Tata BlueScope Colorbond Roofing Sheet 0.50mm',
    slug: 'tata-bluescope-colorbond-roofing-sheet-0-50mm',
    description:
      'TATA BlueScope Colorbond pre-painted galvanised steel roofing sheets with superior colour retention and corrosion resistance. Suitable for industrial and residential roofing.',
    shortDescription: 'Pre-painted Galvalume roofing sheet with 10-year colour warranty',
    category: SAMPLE_CATEGORIES[6],
    brand: 'Tata BlueScope',
    price: 580,
    comparePrice: 640,
    images: [
      { url: img('Colorbond Roofing'), alt: 'Tata BlueScope Colorbond Roofing Sheet', isPrimary: true },
    ],
    stock: 300,
    sku: 'ROOF-TB-CB-050',
    specifications: [
      { key: 'Thickness', value: '0.50 mm' },
      { key: 'Width', value: '1050 mm (effective cover)' },
      { key: 'Base Metal', value: 'Galvalume (AZ150)' },
      { key: 'Available lengths', value: '2 m – 12 m' },
      { key: 'Colour', value: 'Colorbond Manor Red / Midnight Blue / Surfmist' },
    ],
    ratings: { average: 4.6, count: 74 },
    tags: ['roofing', 'tata', 'bluescope', 'colorbond', 'galvalume'],
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    bulkPricing: [{ minQuantity: 100, price: 555 }],
    createdAt: '2024-01-11T00:00:00.000Z',
    updatedAt: '2024-01-11T00:00:00.000Z',
  },

  // House Interior Wares
  {
    _id: 'prod-014',
    name: 'Havells Crabtree Athena 6A Modular Switch Set',
    slug: 'havells-crabtree-athena-6a-modular-switch-set',
    description:
      'Havells Crabtree Athena modular switch set includes 6A sockets, 6A one-way switches and TV/telephone points. Ivory white finish with durable polycarbonate body.',
    shortDescription: 'Premium modular switch set with sockets and data points',
    category: SAMPLE_CATEGORIES[7],
    brand: 'Havells',
    price: 1450,
    comparePrice: 1700,
    images: [
      { url: img('Havells Athena Switch'), alt: 'Havells Crabtree Athena Switch Set', isPrimary: true },
    ],
    stock: 85,
    sku: 'INT-HAV-ATH-6A',
    specifications: [
      { key: 'Rating', value: '6A / 240V' },
      { key: 'Modules', value: '8-module plate' },
      { key: 'Body', value: 'Polycarbonate' },
      { key: 'Colour', value: 'Ivory White' },
      { key: 'IS Standard', value: 'IS 3854' },
    ],
    ratings: { average: 4.7, count: 113 },
    tags: ['switch', 'modular', 'havells', 'electrical', 'interior'],
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    bulkPricing: [],
    createdAt: '2024-03-15T00:00:00.000Z',
    updatedAt: '2024-03-15T00:00:00.000Z',
  },
  {
    _id: 'prod-015',
    name: 'Greenply Green Club BWR Plywood 12mm (8x4 ft)',
    slug: 'greenply-green-club-bwr-plywood-12mm',
    description:
      'Greenply Green Club BWR (Boiling Water Resistant) plywood is best suited for interior furniture applications including wardrobes and shelving.',
    shortDescription: 'BWR grade plywood for interior furniture and wardrobes',
    category: SAMPLE_CATEGORIES[5],
    brand: 'Greenply',
    price: 2100,
    comparePrice: 2400,
    images: [
      { url: img('Greenply 12mm BWR'), alt: 'Greenply Green Club BWR Plywood 12mm', isPrimary: true },
    ],
    stock: 60,
    sku: 'PLY-GPN-BWR-12MM',
    specifications: [
      { key: 'Thickness', value: '12 mm' },
      { key: 'Size', value: '8 x 4 ft' },
      { key: 'Grade', value: 'BWR' },
      { key: 'IS Standard', value: 'IS 303:1989' },
    ],
    ratings: { average: 4.5, count: 98 },
    tags: ['plywood', 'bwr', 'greenply', 'furniture', 'wardrobe'],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    bulkPricing: [{ minQuantity: 20, price: 1980 }],
    createdAt: '2024-01-12T00:00:00.000Z',
    updatedAt: '2024-01-12T00:00:00.000Z',
  },
];

/** Return featured products (those with isFeatured=true), limited to 8 */
export function getFeaturedProducts(): SampleProduct[] {
  return SAMPLE_PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);
}

/** Filter/sort/paginate sample products to mirror MongoDB query behaviour */
export function queryProducts(params: {
  category?: string | null;
  search?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  brand?: string | null;
  inStock?: string | null;
  sort?: string | null;
  page?: number;
  limit?: number;
}): { products: SampleProduct[]; total: number } {
  const { category, search, minPrice, maxPrice, brand, inStock, page = 1, limit = 12 } = params;
  const sort = params.sort ?? 'newest';

  let results = SAMPLE_PRODUCTS.filter((p) => p.isActive);

  if (category) {
    results = results.filter((p) => p.category.slug === category);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }
  if (minPrice) results = results.filter((p) => p.price >= parseFloat(minPrice));
  if (maxPrice) results = results.filter((p) => p.price <= parseFloat(maxPrice));
  if (brand) results = results.filter((p) => p.brand.toLowerCase().includes(brand.toLowerCase()));
  if (inStock === 'true') results = results.filter((p) => p.stock > 0);

  const sortMap: Record<string, (a: SampleProduct, b: SampleProduct) => number> = {
    newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    rating: (a, b) => b.ratings.average - a.ratings.average,
    popular: (a, b) => b.ratings.count - a.ratings.count,
  };
  const sortFn = sortMap[sort];
  if (sortFn) results.sort(sortFn);

  const total = results.length;
  const skip = (page - 1) * limit;
  return { products: results.slice(skip, skip + limit), total };
}

/** Get a single product by id or slug */
export function getProductByIdOrSlug(idOrSlug: string): SampleProduct | null {
  return (
    SAMPLE_PRODUCTS.find((p) => p._id === idOrSlug || p.slug === idOrSlug) ?? null
  );
}
