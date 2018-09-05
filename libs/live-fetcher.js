// Cache ongoing fetching, prevent redundant request
const pool = require('./live-pool.js')
const raven = require('./raven.js')

module.exports = async (scope, fn, paramsPath) => {
  const fetchKey = `#${scope}/${paramsPath}`
  if (pool.has(fetchKey)) return pool.get(fetchKey)

  const fetchStart = new Date()
  const fetcher = fn(...paramsPath.split('/')).then(
    result => {
      const timeSpan = String(new Date() - fetchStart).padStart(4, ' ')
      console.log(`${timeSpan}ms ${fetchKey}`)
      return typeof result === 'object' ? result : { failed: true }
    },
    err => errorHandler(scope, paramsPath, err)
  ).finally(() => {
    pool.delete(fetchKey)
  })
  pool.set(fetchKey, fetcher)

  return fetcher
}

const errorHandler = (scope, paramsPath, err) => {
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

const printError = (serviceKey, status, err) => {
  let details = err.message
  if (status === 'unknown') {
    details += `\n ${err.stack}`.replace(/^/mg, '   ')
  }
  const url = (err.config && err.config.url) || ''
  console.error(`LIVE_FN_ERR <${status}> ${serviceKey} > ${url}\n`, details)
}
