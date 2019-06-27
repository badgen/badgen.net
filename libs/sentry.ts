import * as Sentry from '@sentry/node'
import { Dedupe } from '@sentry/integrations'

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Dedupe()
    ]
  })
}

export default Sentry
