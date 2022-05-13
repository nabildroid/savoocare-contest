/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["savoocare.com", "localhost"],
  },
  experimental: { images: { layoutRaw: true } },
};

module.exports = nextConfig;
