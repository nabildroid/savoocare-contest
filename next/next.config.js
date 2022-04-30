/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["savoocare.com"],
  },
  experimental: { images: { layoutRaw: true } },
};

module.exports = nextConfig;
