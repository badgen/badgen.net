/** @type {import('next').NextConfig} */

const { withSentryConfig } = require('@sentry/nextjs/config')
const { listed, unlisted } = require('./libs/service-registry.json')

const nextConfig = {
  reactStrictMode: true,
  output: process.env.BUILD_STANDALONE === '1' ? 'standalone' : undefined,

  async rewrites() {
    const badgeApis = [...listed, ...unlisted].map(service => `/${service}`)

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
