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
}

export default nextConfig
