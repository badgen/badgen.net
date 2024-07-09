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
    const badgeApis = [
      '/static',
      '/github',
      '/gitlab',
      '/https',
      '/memo',
      // registry
      '/amo',
      '/npm',
      '/crates',
      '/winget',
      '/docker',
      '/open-vsx',
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
      '/coveralls',
      '/travis',
      '/circleci',
      '/xo',
      // social network
      '/discord',
      '/gitter',
      '/matrix',
      '/runkit',
      '/peertube',
      // utilities
      '/liberapay',
      // discontinued
      '/apm',
      '/lgtm',
      '/david',
    ]

    let badgeRedirects = [
      { source: '/badge/:path*', destination: '/api/static' },
      { source: '/badge', destination: '/api/static' },
    ]

    badgeRedirects = badgeRedirects
      .concat(badgeApis.map(badge => ({ source: `${badge}/:path*`, destination: `/api${badge}` }))) // badges
      .concat(badgeApis.map(badge => ({ source: badge, destination: `/api${badge}` }))) // doc pages

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
