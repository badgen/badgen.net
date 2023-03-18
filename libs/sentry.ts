import * as Sentry from "@sentry/nextjs"

// Importing @sentry/tracing patches the global hub for tracing to work.
import "@sentry/tracing"

if (process.env.SENTRY_DSN) {

  const { NOW_GITHUB_COMMIT_REF, NOW_GITHUB_COMMIT_SHA } = process.env

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    release: `${NOW_GITHUB_COMMIT_REF || '-'}@${NOW_GITHUB_COMMIT_SHA || '-'}`
  })
}

export default Sentry
