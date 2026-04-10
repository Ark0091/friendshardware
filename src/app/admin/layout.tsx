'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart2, Tag } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/promotions', label: 'Promotions', icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-56 bg-gray-900 text-white flex flex-col py-4">
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-orange-500 flex items-center justify-center text-xs font-bold">FH</div>
            <span className="text-sm font-semibold">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 px-2 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition ${pathname === href ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
              <Icon className="h-4 w-4" />{label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
