const raven = require('raven')
const { SENTRY_URI } = process.env

if (SENTRY_URI) {
  raven.config(SENTRY_URI).install()
}

module.exports = raven
