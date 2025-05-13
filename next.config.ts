import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          canvas: false,
        },
      }
    }
    return config
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Set the limit to 10 MB (adjust as needed)
    },
  },
}

export default nextConfig
