const badgen = require('badgen')
const liveFns = require('./live-fns/_index.js')
const waitings = {} // Cache ongoing fetching, prevent redundant request

module.exports = function (router) {
  Object.entries(liveFns).forEach(([name, fn]) => {
    router.get(`/${name}/*`, async (req, res, params) => {
      const {
        subject = name,
        status = 'unknown',
        color = 'grey'
      } = await fetchLiveParams(name, fn, params['*'])

      res.writeHead(200, {
        'Content-Type': 'image/svg+xml;charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=60'
      })
      res.end(badgen({subject, status, color}))
    })
  })
}

async function fetchLiveParams (scope, fn, paramsPath) {
  const fetchKey = `#${scope} ${paramsPath}`
  if (waitings[fetchKey]) return waitings[fetchKey]

  console.time(fetchKey)
  const task = fn(...paramsPath.split('/'))
  const timer = new Promise((resolve, reject) => setTimeout(reject, 30000))
  waitings[fetchKey] = Promise.race([task, timer]).catch(e => {
    console.error(e)
    return {}
  }).then(result => {
    console.timeEnd(fetchKey)
    waitings[fetchKey] = undefined
    return result
  })

  return waitings[fetchKey]
}
