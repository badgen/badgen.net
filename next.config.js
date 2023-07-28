/** @type {import('next').NextConfig} */

const { withSentryConfig } = require('@sentry/nextjs')

const badgeList = require('./public/.meta/badges.json')

const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: false,

  experimental: {
    appDir: false,
    forceSwcTransforms: true,
  },

  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: true,
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
      '/github',
      // registry
      '/amo',
      '/npm',
      '/crates',
      '/winget',
      '/chrome-web-store',
      '/vs-marketplace',
      '/hackage',
      '/ppm',
      '/pub',
      '/pypi',
      // analysis
      '/bundlephobia',
      '/packagephobia',
      '/codeclimate',
      '/codecov',
      '/travis',
      '/xo',
      // social network
      '/discord',
      '/matrix',
      '/runkit',
      '/peertube',
      // discontinued
      '/apm',
      '/lgtm',
      '/david',
    ]

    badgeApis.forEach(badge => {
      badgeRedirects.push({ source: `${badge}/:path*`, destination: `/api${badge}` }) // badges
      badgeRedirects.push({ source: badge, destination: `/api${badge}` }) // doc pages
    })

    // const badgeRedirects = liveBadgeRedirects.concat(staticBadgeRedirects)

    return badgeRedirects
  },
}


const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  dryRun: process.env.VERCEL_ENV !== "production"

  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
