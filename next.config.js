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
    NEXTAUTH_SECRET: 'secret_for_authentication_789_369_11_12',
    NEXTAUTH_URL: 'http://127.0.0.1:3000',
    URI: 'http://localhost:3000',
    SENDGRID_API_KEY: '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',
    MONGODB_URI: 'mongodb://0.0.0.0:27017/gameFevr',
    // # migolkoa@gmail.com
    FETCH_GAMES_KEY_GENERAL1: '39a2bd3750804b5a82669025ed9986a8',
    // #migolkoanton@gmail.com
    FETCH_GAMES_KEY_GENERAL2: '4f97c91efdb24a6e84f4688a9519c46f',
    // #gamefevrr@gmail.com
    BUILD_GAMES_KEY: '2528523b74884c4aa629a65c45bf309c',
  },
};
// eslint-disable-next-line no-undef
module.exports = nextConfig;
