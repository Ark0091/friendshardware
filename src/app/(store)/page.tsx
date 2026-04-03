import Link from 'next/link';
import { ArrowRight, Truck, Shield, Headphones, Star } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import FeaturedProducts from '@/components/home/FeaturedProducts';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-current" />
              Trusted by 10,000+ builders across India
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Build Your Dream
              <span className="block text-amber-200">With Quality Materials</span>
            </h1>
            <p className="mb-8 text-lg text-white/90 leading-relaxed">
              Premium construction materials at the best prices. TMT Rebars, Cement, Steel, Paints and more — delivered to your site.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-semibold shadow-lg">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-amber-300/20 blur-2xl" />
      </section>

      {/* Stats Bar */}
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: 'Products', value: '500+' },
              { label: 'Happy Customers', value: '10K+' },
              { label: 'Cities Served', value: '50+' },
              { label: 'Years Experience', value: '15+' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-xl font-bold text-orange-400 md:text-2xl">{value}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="bg-gray-50 py-14">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">Shop by Category</h2>
            <p className="text-gray-600">Everything you need for construction and renovation</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`}>
                <div className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md">
                  <span className="mb-3 text-4xl transition-transform group-hover:scale-110">{cat.icon}</span>
                  <h3 className="text-center text-sm font-semibold text-gray-800 group-hover:text-orange-600">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-1 text-2xl font-bold text-gray-900 md:text-3xl">Featured Products</h2>
              <p className="text-gray-600">Handpicked quality products for your project</p>
            </div>
            <Link href="/products" className="hidden text-sm font-medium text-orange-500 hover:text-orange-600 md:flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <FeaturedProducts />
          <div className="mt-6 text-center md:hidden">
            <Link href="/products">
              <Button variant="outline" className="border-orange-500 text-orange-500">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-orange-50 py-14">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">Why Choose Friends Hardware?</h2>
            <p className="text-gray-600">We are committed to quality, value, and service</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Shield className="h-8 w-8" />, title: 'Quality Assured', desc: 'All products are sourced from certified manufacturers and meet IS standards.' },
              { icon: <Truck className="h-8 w-8" />, title: 'Fast Delivery', desc: 'Same-day dispatch for orders placed before 12 PM. Pan-India delivery.' },
              { icon: <Headphones className="h-8 w-8" />, title: '24/7 Support', desc: 'Expert technical support for all your construction queries.' },
              { icon: <Star className="h-8 w-8" />, title: 'Best Prices', desc: 'Competitive pricing with bulk discounts available for contractors.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  {icon}
                </div>
                <h3 className="mb-2 font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">What Our Customers Say</h2>
            <p className="text-gray-600">Trusted by thousands of builders and contractors</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { name: 'Rajesh Kumar', role: 'Civil Contractor', text: 'Excellent quality TMT bars and cement. Prices are competitive and delivery was on time. Highly recommended!', rating: 5 },
              { name: 'Priya Sharma', role: 'Homeowner', text: 'Ordered for my home renovation. Great range of products and the customer support was very helpful. Will buy again!', rating: 5 },
              { name: 'Mohammed Ali', role: 'Builder', text: 'Been buying in bulk for 2 years. Quality is consistent and bulk pricing is great. Friends Hardware is my go-to.', rating: 5 },
            ].map(({ name, role, text, rating }) => (
              <div key={name} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-3 flex">
                  {Array.from({ length: rating }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <p className="mb-4 text-sm text-gray-600 leading-relaxed italic">&quot;{text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-semibold text-sm">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{name}</p>
                    <p className="text-xs text-gray-500">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-900 py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">Stay Updated</h2>
          <p className="mb-6 text-gray-400">Get the latest product updates, deals, and construction tips</p>
          <form className="mx-auto flex max-w-md gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-gray-300 focus:border-orange-400 focus:outline-none"
            />
            <Button className="bg-orange-500 hover:bg-orange-600 px-6">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
