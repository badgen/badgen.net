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

      errorLogger(fetchKey, err, status)

      return { status, failed: true }
    }).finally(() => {
    console.timeEnd(fetchKey)
    waitings[fetchKey] = undefined
  })

  return waitings[fetchKey]
}

const errorLogger = (fetchKey, err, status) => {
  if (status === 'unknown') {
    // log details err info
    const resData = JSON.stringify(err.response.data, null, 2)
    const details = err.stack + '\n' + resData.replace(/^/mg, '    >   ')
    return console.error(fetchKey, `LIVEFN_ERR<${status}>`, details)
  } else {
    return console.error(fetchKey, `LIVEFN_ERR<${status}>`, err.message)
  }
}
