const waitings = {} // Cache ongoing fetching, prevent redundant request

module.exports = async (scope, fn, paramsPath) => {
  const fetchKey = `#${scope} ${paramsPath}`
  if (waitings[fetchKey]) return waitings[fetchKey]

  console.time(fetchKey)
  waitings[fetchKey] = fn(...paramsPath.split('/')).catch(e => {
    let status = 'unknown'

    if (e.response && e.response.status === 404) {
      status = 'not found'
    } else if (e.code === 'ECONNABORTED') {
      status = 'timeout'
    }

    console.error(fetchKey, `LIVEFN_ERR<${status}>`, e.message)
    return { status, failed: true }
  }).then(result => {
    console.timeEnd(fetchKey)
    waitings[fetchKey] = undefined
    if (typeof result === 'object') {
      return result
    } else {
      return { failed: true }
    }
  })

  return waitings[fetchKey]
}
