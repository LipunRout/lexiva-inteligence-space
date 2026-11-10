import path from 'node:path';
import { fileURLToPath } from 'node:url';
import withSerwistInit from '@serwist/next';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withSerwist = withSerwistInit({
  additionalPrecacheEntries: [{ url: '/offline', revision: Date.now().toString() }],
  disable: process.env.NODE_ENV === 'development',
  swDest: 'public/sw.js',
  swSrc: 'src/app/sw.ts',
});

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  images: {
    domains: ['designmd.me'],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
};

export default withSerwist(nextConfig);
