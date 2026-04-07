import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        { key: 'Content-Security-Policy', value: "frame-src 'self' https://app.powerbi.com" },
      ]
    }]
  },
}

export default nextConfig
