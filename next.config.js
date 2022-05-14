/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  images: {
    domains: ['media.rawg.io'],
  },
  env: {
    key:'e996863ffbd04374ac0586ec2bcadd55'
  }
}

module.exports = nextConfig
