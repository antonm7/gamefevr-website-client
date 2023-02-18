/**
 * @type {import('next').NextConfig}
 */
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
  },
  env: {
    key: 'e996863ffbd04374ac0586ec2bcadd55',
  },
};
// eslint-disable-next-line no-undef
module.exports = nextConfig;
