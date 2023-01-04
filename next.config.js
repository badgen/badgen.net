/** @type {import('next').NextConfig} */

const badgeList = require('./public/.meta/badges.json')

const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: false,

  experimental: {
    appDir: false,
    forceSwcTransforms: true,
  },

  async rewrites() {
    const liveBadgeRedirects = badgeList.live.map(badge => {
      return {
        source: `/${badge.id}/:path*`,
        destination: `/api/${badge.id}/:path*`,
      }
    })
    const staticBadgeRedirects = [{
      source: `/badge/:path*`,
      destination: `/api/badge/:path*`,
    }]

    const badgeRedirects = liveBadgeRedirects.concat(staticBadgeRedirects)

    return badgeRedirects
  },
}

module.exports = nextConfig
