const sendStats = require('./send-stats.js')

module.exports = async (service, fn, paramsPath) => {
  const fetchStart = new Date()
  const fetchKey = `#${service}/${paramsPath}`

  const fetcher = fn(...paramsPath.split('/')).then(
    result => {
      console.log(timeSince(fetchStart), fetchKey)
      sendStats('stats', service, fetchKey, new Date() - fetchStart)
      return typeof result === 'object' ? result : { failed: true }
    },
    err => gotErrorHandler(service, paramsPath, err)
  )

  return fetcher
}

const timeSince = startStamp => {
  return String(new Date() - startStamp).padStart(4, ' ') + 'ms'
}

const gotErrorHandler = (service, paramsPath, err) => {
  const serviceKey = `/${service}/${paramsPath}`

  let status = 'unknown'
  if (err.code === 'ETIMEDOUT') {
    status = 'timeout'
  } else if (err.statusCode === 404) {
    status = 'not found'
  } else if (err.statusCode === 503) {
    status = 'unavailable'
  }

  logError(serviceKey, status, err)
  sendStats('error', status, serviceKey)

  return { status, failed: true }
}

// log error
const logError = (serviceKey, status, err) => {
  console.error(`\x1b[91mLIVE_FN_ERR <${status}> ${serviceKey}\x1b[0m`)
  if (status === 'unknown') {
    console.error(err)
  } else {
    console.error(`    @ ${err.url} [${err.statusCode || err.code || err.message}]`)
  }
}
