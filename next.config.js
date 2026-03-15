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
        source: '/supabase/:path*',
        destination: 'https://flwsppivkfgzjwzlbssh.supabase.co/:path*',
      },
    ]
  },
}

module.exports = nextConfig