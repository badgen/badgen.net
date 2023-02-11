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

    const badgeRedirects = [
      { source: '/badge/:path*', destination: '/api/static' },
      { source: '/badge', destination: '/api/static' },
    ]

    const badgeApis = [
      '/static',
      '/winget',
      '/xo',
    ]

    badgeApis.forEach(b => {
      badgeRedirects.push({ source: `${b}/:path*`, destination: `/api${b}` }) // badges
      badgeRedirects.push({ source: b, destination: `/api${b}` }) // doc pages
    })

    // const badgeRedirects = liveBadgeRedirects.concat(staticBadgeRedirects)

    return badgeRedirects
  },
}

module.exports = nextConfig
