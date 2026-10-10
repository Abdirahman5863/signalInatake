/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: { root: __dirname },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
}

module.exports = nextConfig
