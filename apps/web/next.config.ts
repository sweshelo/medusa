import path from 'path'

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
    ],
  },
  webpack: config => {
    config.resolve.alias['@shared'] = path.resolve(__dirname, '../../packages/shared')
    config.resolve.alias['tailwind-config'] = path.resolve(
      __dirname,
      '../../packages/shared/tailwind.config.ts'
    )
    return config
  },
}

export default nextConfig
