/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  env: {
    // On Netlify, NEXTAUTH_URL is set via the Netlify dashboard.
    // The NETLIFY_URL / URL env var provides the deploy URL as fallback.
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || process.env.URL,
  },
};

export default nextConfig;
