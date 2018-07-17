const badgen = require('badgen')
const liveFns = require('./live-fns/_index.js')
const waitings = {} // Cache ongoing fetching, prevent redundant request

module.exports = function (router) {
  Object.entries(liveFns).forEach(([name, fn]) => {
    router.get(`/${name}/*`, async (req, res, params) => {
      const style = req.headers.host === 'flat.badgen.net' ? 'flat' : undefined
      const {
        subject = name,
        status = 'unknown',
        color = 'grey',
        fail = false
      } = await fetchLiveParams(name, fn, params['*'])

      const sharedMaxAge = fail ? '0' : (Math.random() * 60 + 60).toFixed()
      res.writeHead(200, {
        'Content-Type': 'image/svg+xml;charset=utf-8',
        'Cache-Control': 'public, max-age=20, s-maxage=' + sharedMaxAge
      })
      res.end(badgen({subject, status, color, style}))
    })
  })
}

async function fetchLiveParams (scope, fn, paramsPath) {
  const fetchKey = `#${scope} ${paramsPath}`
  if (waitings[fetchKey]) return waitings[fetchKey]

  console.time(fetchKey)
  waitings[fetchKey] = fn(...paramsPath.split('/')).catch(e => {
    console.error(fetchKey, 'LIVE_ERROR', e.message)
    return { fail: true }
  }).then(result => {
    console.timeEnd(fetchKey)
    waitings[fetchKey] = undefined
    return result
  })

  return waitings[fetchKey]
}
