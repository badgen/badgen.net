// Cache ongoing fetching, prevent redundant request
const pool = require('./live-pool.js')
const raven = require('./raven.js')

module.exports = async (service, fn, paramsPath) => {
  const fetchStart = new Date()
  const fetchKey = `#${service}/${paramsPath}`

  if (pool.has(fetchKey)) return pool.get(fetchKey)

  const fetcher = fn(...paramsPath.split('/')).then(
    result => {
      console.log(timeSince(fetchStart), fetchKey)
      return typeof result === 'object' ? result : { failed: true }
    },
    err => errorHandler(service, paramsPath, err)
  ).finally(() => {
    pool.delete(fetchKey)
  })

  pool.set(fetchKey, fetcher)

  return fetcher
}

const timeSince = startStamp => {
  return String(new Date() - startStamp).padStart(4, ' ') + 'ms'
}

const gotErrorHandler = (service, paramsPath, err) => {
  const serviceKey = `/${service}/${paramsPath}`

  let status = 'unknown'
  if (err.statusCode === '404') {
    status = 'not found'
  } else if (err.code === 'ETIMEDOUT') {
    status = 'timeout'
  }

  logError(serviceKey, err, status)
  sendError(serviceKey, err, status)

  return { status, failed: true }
}

const errorHandler = (scope, paramsPath, err) => {
  if (err.url) {
    return gotErrorHandler(scope, paramsPath, err)
  }

  let status = 'unknown'

  if (err.response && err.response.status === 404) {
    status = 'not found'
  } else if (err.code === 'ECONNABORTED') {
    status = 'timeout'
  }

  errorLogger(`/${scope}/${paramsPath}`, err, status)

  return { status, failed: true }
}

const errorLogger = (serviceKey, err, status) => {
  try {
    if (status === 'unknown') {
      // send to sentry
      raven && raven.captureException(err, {
        tags: {
          serviceKey,
          service: serviceKey.split(' ')[0],
          fetchUrl: err.config.url
        }
      })
    } else {
      // log known error
      printError(serviceKey, status, err)
    }
  } catch (e) {
    printError(serviceKey, status, err)
    console.error('ERR_ON_ERR', e.message)
  }
}

// log error
const logError = (serviceKey, err, status) => {
  console.error(`LIVE_FN_ERR <${status}> ${serviceKey}
    @ ${err.url}
    > [${err.statusCode || err.code}] ${err.message}`)
}

// send error to sentry
const sendError = (serviceKey, err, status) => {
  status === 'unknown' && raven && raven.captureException(err, {
    tags: {
      serviceKey,
      url: err.url
    }
  })
}

const printError = (serviceKey, status, err) => {
  let details = err.message
  if (status === 'unknown') {
    details += `\n ${err.stack}`.replace(/^/mg, '   ')
  }
  const url = (err.config && err.config.url) || ''
  console.error(`LIVE_FN_ERR <${status}> ${serviceKey} > ${url}\n`, details)
}
