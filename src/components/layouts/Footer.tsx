import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { PRODUCT_CATEGORIES, SITE_CONFIG } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500 text-white font-bold text-sm">FH</div>
              <div>
                <div className="text-base font-bold text-white leading-tight">Friends Hardware</div>
                <div className="text-xs text-orange-400 leading-tight">Your Trusted Partner</div>
              </div>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-400">
              Premium quality construction materials for all your building needs. Trusted by contractors and homeowners across India.
            </p>
            <div className="flex gap-3">
              {[
                { href: SITE_CONFIG.social.facebook, label: 'F' },
                { href: SITE_CONFIG.social.instagram, label: 'I' },
                { href: SITE_CONFIG.social.twitter, label: 'X' },
                { href: SITE_CONFIG.social.youtube, label: 'Y' },
              ].map(({ href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-gray-300 text-xs font-bold transition hover:bg-orange-500 hover:text-white">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'All Products' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/orders', label: 'Track Order' },
                { href: '/account', label: 'My Account' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 transition hover:text-orange-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Categories</h3>
            <ul className="space-y-2 text-sm">
              {PRODUCT_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/products?category=${cat.slug}`} className="text-gray-400 transition hover:text-orange-400">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact Us</h3>
            <ul className="mb-6 space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-400" />
                <span>{SITE_CONFIG.address.street}, {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state} - {SITE_CONFIG.address.pincode}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4 flex-shrink-0 text-orange-400" />
                <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-orange-400">{SITE_CONFIG.phone}</a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4 flex-shrink-0 text-orange-400" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-orange-400">{SITE_CONFIG.email}</a>
              </li>
            </ul>
            <div>
              <h4 className="mb-2 text-xs font-semibold text-white">Newsletter</h4>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-xs text-gray-300 focus:border-orange-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-md bg-orange-500 px-3 py-2 text-xs font-medium text-white hover:bg-orange-600"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-gray-800 pt-8 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Friends Hardware. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-orange-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-orange-400">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-orange-400">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
