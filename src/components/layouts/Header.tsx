'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown, User, Package, LogOut, Settings } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-orange-600 py-1 text-center text-xs text-white">
        Free shipping on orders above ₹5,000 | Call us: +91 98765 43210
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500 text-white font-bold text-sm">FH</div>
              <div>
                <div className="text-base font-bold leading-tight text-gray-900">Friends</div>
                <div className="text-xs font-medium text-orange-500 leading-tight">Hardware</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/" className="text-gray-700 transition hover:text-orange-500">Home</Link>

            {/* Categories Dropdown */}
            <div className="relative" onMouseEnter={() => setCategoryMenuOpen(true)} onMouseLeave={() => setCategoryMenuOpen(false)}>
              <button className="flex items-center gap-1 text-gray-700 transition hover:text-orange-500">
                Products <ChevronDown className="h-4 w-4" />
              </button>
              {categoryMenuOpen && (
                <div className="absolute left-0 top-full z-50 w-64 rounded-md bg-white py-2 shadow-xl border">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t mt-1 pt-1">
                    <Link href="/products" className="flex items-center px-4 py-2 text-sm text-orange-600 font-medium hover:bg-orange-50">
                      View All Products →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/about" className="text-gray-700 transition hover:text-orange-500">About</Link>
            <Link href="/contact" className="text-gray-700 transition hover:text-orange-500">Contact</Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden flex-1 max-w-xs md:flex">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-orange-500">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-orange-500">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-md p-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-medium">
                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="hidden h-3 w-3 md:block" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md bg-white py-1 shadow-xl border">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b">
                      {session.user?.email}
                    </div>
                    <Link href="/account" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                      <User className="h-4 w-4" /> My Account
                    </Link>
                    <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                      <Package className="h-4 w-4" /> My Orders
                    </Link>
                    {(session.user as { role?: string }).role === 'admin' && (
                      <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50" onClick={() => setUserMenuOpen(false)}>
                        <Settings className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t">
                      <button
                        onClick={() => { signOut({ callbackUrl: '/' }); setUserMenuOpen(false); }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">Register</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="p-2 text-gray-600 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm focus:border-orange-400 focus:outline-none"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            <Link href="/" className="rounded-md px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/products" className="rounded-md px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600" onClick={() => setMobileMenuOpen(false)}>All Products</Link>
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="rounded-md px-6 py-1.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
            <Link href="/about" className="rounded-md px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600" onClick={() => setMobileMenuOpen(false)}>About</Link>
            {!session && (
              <div className="mt-2 flex gap-2">
                <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">Register</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
