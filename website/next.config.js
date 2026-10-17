/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  turbopack: { root: require('node:path').resolve(__dirname, '..') },
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: { unoptimized: true },
};
module.exports = nextConfig;
