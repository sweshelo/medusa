import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/ranking',
      },
    ]
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'p.eagate.573.jp',
      },
      {
        protocol: 'https',
        hostname: 'eacache.s.konaminet.jp',
      },
    ],
  },
  experimental: {},
}

export default nextConfig
