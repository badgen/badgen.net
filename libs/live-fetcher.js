// Cache ongoing fetching, prevent redundant request
const { waitings } = require('./live-pool.js')

module.exports = async (scope, fn, paramsPath) => {
  const fetchKey = `#${scope} ${paramsPath}`
  if (waitings[fetchKey]) return waitings[fetchKey]

  console.time(fetchKey)
  waitings[fetchKey] = fn(...paramsPath.split('/')).then(
    result => typeof result === 'object' ? result : { failed: true },
    err => {
      let status = 'unknown'

      if (err.response && err.response.status === 404) {
        status = 'not found'
      } else if (err.code === 'ECONNABORTED') {
        status = 'timeout'
      }

      const info = status === 'unknown' ? err.stack : err.message
      console.error(fetchKey, `LIVEFN_ERR<${status}>`, info)

      return { status, failed: true }
    }).finally(() => {
    console.timeEnd(fetchKey)
    waitings[fetchKey] = undefined
  })

  return waitings[fetchKey]
}
