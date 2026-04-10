'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { User, Package, Heart, LogOut, MapPin, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccountPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');

  if (!session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="mb-4 text-gray-600">Please login to view your account</p>
        <Link href="/login"><Button className="bg-orange-500 hover:bg-orange-600">Login</Button></Link>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'orders', label: 'Orders', icon: <Package className="h-4 w-4" />, href: '/orders' },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="h-4 w-4" />, href: '/wishlist' },
    { id: 'addresses', label: 'Addresses', icon: <MapPin className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">My Account</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-3 border-b pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-lg">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{session.user?.name}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  tab.href ? (
                    <Link key={tab.id} href={tab.href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600">
                      {tab.icon} {tab.label}
                    </Link>
                  ) : (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition ${activeTab === tab.id ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}>
                      {tab.icon} {tab.label}
                    </button>
                  )
                ))}
                <button onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold">Profile Information</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 rounded-md bg-gray-50 p-3">
                      <span className="w-24 font-medium text-gray-600">Name:</span>
                      <span>{session.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-md bg-gray-50 p-3">
                      <span className="w-24 font-medium text-gray-600">Email:</span>
                      <span>{session.user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-md bg-gray-50 p-3">
                      <span className="w-24 font-medium text-gray-600">Role:</span>
                      <span className="capitalize">{(session.user as { role?: string }).role || 'Customer'}</span>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'addresses' && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold">Saved Addresses</h2>
                  <p className="text-sm text-gray-500">No saved addresses yet.</p>
                </div>
              )}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold">Notifications</h2>
                  <p className="text-sm text-gray-500">No notifications.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
