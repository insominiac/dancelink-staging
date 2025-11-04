/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', 'images.unsplash.com', 'danncelink.vercel.app'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['danncelink.vercel.app', 'localhost:3000']
    }
  },
  // Vercel-specific optimizations
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  async rewrites() {
    return [
      // Keep all content endpoints local
      { source: '/api/public/content/:path*', destination: '/api/public/content/:path*' },
      { source: '/api/admin/content/:path*', destination: '/api/admin/content/:path*' },
      // Proxy all others to external API
      { source: '/api/:path*', destination: 'https://dance-api-omega.vercel.app/api/:path*' }
    ]
  }
}

module.exports = nextConfig
