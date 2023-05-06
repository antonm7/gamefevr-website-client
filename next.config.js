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
  staticPageGenerationTimeout: 10000,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    domains: ['media.rawg.io', 'hatrabbits.com'],
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    URI: process.env.URI,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    FETCH_GAMES_KEY_GENERAL1: process.env.FETCH_GAMES_KEY_GENERAL1,
    // FETCH_GAMES_KEY_GENERAL2: process.env.FETCH_GAMES_KEY_GENERAL2,
    // BUILD_GAMES_KEY: process.env.BUILD_GAMES_KEY
  }
};
// eslint-disable-next-line no-undef
module.exports = nextConfig;
