const { get } = require('micro-fork')
const liveFns = require('./live-fns/_index.js')
const serveBadge = require('./serve-badge.js')
const waitings = {} // Cache ongoing fetching, prevent redundant request

module.exports = Object.entries(liveFns).map(([name, fn]) => {
  return get(`/${name}/*`, async (req, res) => {
    const style = req.headers.host === 'flat.badgen.net' ? 'flat' : undefined
    const {
      subject = name,
      status = 'unknown',
      color = 'grey',
      failed = false
    } = await fetchLiveParams(name, fn, req.params['*'])

    req.params = { subject, status, color, style }
    serveBadge(req, res, {
      maxAge: failed ? '0' : (Math.random() * 60 + 60).toFixed()
    })
  })
})

async function fetchLiveParams (scope, fn, paramsPath) {
  const fetchKey = `#${scope} ${paramsPath}`
  if (waitings[fetchKey]) return waitings[fetchKey]

  console.time(fetchKey)
  waitings[fetchKey] = fn(...paramsPath.split('/')).catch(e => {
    console.error(fetchKey, 'LIVE_ERROR', e.message)
    return { failed: true }
  }).then(result => {
    console.timeEnd(fetchKey)
    waitings[fetchKey] = undefined
    return result || { failed: true }
  })

  return waitings[fetchKey]
}
