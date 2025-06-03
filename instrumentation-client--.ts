import * as Sentry from "@sentry/nextjs"

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

if (SENTRY_DSN) {

    const { NOW_GITHUB_COMMIT_REF, NOW_GITHUB_COMMIT_SHA } = process.env

    Sentry.init({
      dsn: process.env.SENTRY_DSN,

      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0,

      // Note: if you want to override the automatic release value, do not set a
      // `release` value here - use the environment variable `SENTRY_RELEASE`, so
      // that it will also get attached to your source maps
      release: `${NOW_GITHUB_COMMIT_REF || '-'}@${NOW_GITHUB_COMMIT_SHA || '-'}`
    })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart