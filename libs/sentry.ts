import * as Sentry from '@sentry/node'
import { Dedupe } from '@sentry/integrations'

if (process.env.SENTRY_URI) {
  Sentry.init({
    dsn: process.env.SENTRY_URI,
    integrations: [
      new Dedupe()
    ]
  })
}

export default Sentry
