/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensures middleware and API routes work on Vercel
  serverExternalPackages: [],
  webpack: (config) => {
    // Allow Three.js and other canvas-based libs
    config.externals = config.externals || [];
    return config;
  },
  images: {
    remotePatterns: [],
    // local images in /public served normally
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
