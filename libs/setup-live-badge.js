const badgen = require('badgen')
const liveFns = require('./live-fns/_index.js')

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
  const params = paramsPath.split('/')
  const logKey = `#${scope} ${paramsPath}`
  return timeout(fn(...params), 30000, logKey)
}

function timeout (task, period, logKey) {
  console.time(logKey)
  const timer = new Promise((resolve, reject) => setTimeout(reject, period))
  return Promise.race([task, timer]).catch(e => {
    console.error(e)
    return {}
  }).then(result => {
    console.timeEnd(logKey)
    return result
  })
}
