import { SITE_CONFIG } from '@/lib/constants';
import { Shield, Truck, Users, Award } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description: 'Learn about Friends Hardware - your trusted construction materials partner',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-600 to-amber-500 py-16 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">About Friends Hardware</h1>
          <p className="mx-auto max-w-xl text-white/90">Your trusted partner for quality construction materials since 2009</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-14">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Our Story</h2>
          <p className="mb-4 text-gray-600 leading-relaxed">
            Founded in 2009, Friends Hardware has grown from a small local store to one of the most trusted construction materials suppliers in South India. We started with a simple mission: to provide quality building materials at fair prices, backed by expert advice and exceptional service.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Today, we serve thousands of contractors, builders, and homeowners across India, offering a comprehensive range of products including TMT Rebars, Cement, Structural Steel, Paints, Sanitary Ware, Plywood, Roof Panels, and Interior Hardware.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-14">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">Our Values</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Shield />, title: 'Quality First', desc: 'All products meet IS standards and are sourced from certified manufacturers.' },
              { icon: <Truck />, title: 'Reliable Delivery', desc: 'On-time delivery across India with real-time tracking.' },
              { icon: <Users />, title: 'Customer Focus', desc: 'Dedicated support team to help you with technical queries.' },
              { icon: <Award />, title: 'Expert Advice', desc: '15+ years of industry expertise at your service.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl bg-white p-6 shadow-sm text-center">
                <div className="mb-3 flex justify-center text-orange-500">{icon}</div>
                <h3 className="mb-2 font-bold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-14">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Get In Touch</h2>
          <p className="mb-6 text-gray-600">Have questions? We are here to help.</p>
          <div className="space-y-3 text-sm text-gray-700">
            <p>📍 {SITE_CONFIG.address.street}, {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state}</p>
            <p>📞 <a href={`tel:${SITE_CONFIG.phone}`} className="text-orange-500 hover:underline">{SITE_CONFIG.phone}</a></p>
            <p>✉️ <a href={`mailto:${SITE_CONFIG.email}`} className="text-orange-500 hover:underline">{SITE_CONFIG.email}</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
