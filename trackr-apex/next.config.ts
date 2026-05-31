import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {},
  // Allow webpack configurations to fall back to Turbopack
  turbopack: {},
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
};

export default nextConfig;
