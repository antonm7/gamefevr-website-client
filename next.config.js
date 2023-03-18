/**
 * @type {import('next').NextConfig}
 */
/* eslint-env es6 */
/* eslint-disable */
const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    domains: ['media.rawg.io', 'hatrabbits.com'],
  }
};
// eslint-disable-next-line no-undef
module.exports = nextConfig;
