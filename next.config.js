/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Allow Three.js and other canvas-based libs
    config.externals = config.externals || [];
    return config;
  },
  images: {
    remotePatterns: [],
    // local images in /public served normally
  },
};

module.exports = nextConfig;
