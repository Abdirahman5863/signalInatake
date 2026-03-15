/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  async rewrites() {
    return [
      {
        source: '/api/supabase/:path*',
        destination: 'https://wukrqycdlgpxlkfqwjbw.supabase.co/:path*',
      },
    ]
  },
}

module.exports = nextConfig