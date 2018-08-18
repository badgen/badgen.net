// Cache ongoing fetching, prevent redundant request
const pool = require('./live-pool.js')
const raven = require('./raven.js')

module.exports = async (scope, fn, paramsPath) => {
  const fetchKey = `#${scope} ${paramsPath}`
  if (pool.has(fetchKey)) return pool.get(fetchKey)

  console.time(fetchKey)
  const fetcher = fn(...paramsPath.split('/')).then(
    result => typeof result === 'object' ? result : { failed: true },
    err => {
      let status = 'unknown'

      if (err.response && err.response.status === 404) {
        status = 'not found'
      } else if (err.code === 'ECONNABORTED') {
        status = 'timeout'
      }

      errorLogger(fetchKey, err, status)

      return { status, failed: true }
    }).finally(() => {
    console.timeEnd(fetchKey)
    pool.delete(fetchKey)
  })
  pool.set(fetchKey, fetcher)

  return fetcher
}

const errorLogger = (fetchKey, err, status) => {
  try {
    if (status === 'unknown') {
      raven && raven.captureException(err, {
        tags: { fetchKey, status, service: fetchKey.split(' ')[0] }
      })
      // log details err info
      const resData = JSON.stringify(err.response.data, null, 2)
      const details = err.stack + '\n' + resData.replace(/^/mg, '    >   ')
      return console.error(fetchKey, `LIVEFN_ERR<${status}>`, details)
    } else {
      return console.error(fetchKey, `LIVEFN_ERR<${status}>`, err.message)
    }
  } catch (e) {
    console.error(fetchKey, `LIVEFN_ERR<${status}>`, err.message)
    console.error(e.message)
  }
}
