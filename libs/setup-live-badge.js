const LRU = require('lru-cache')
const liveFns = require('./live-fns/index.js')

const cache = LRU({
  max: 5000,
  maxAge: 3e4,
  stale: true
})

module.exports = function (router) {
  Object.entries(liveFns).forEach(([key, fn]) => {
    router.get(`/${key}/*`, async (req, res, params) => {
      const {
        subject = key,
        status = 'unknown',
        color = 'grey'
      } = await fetchLiveParams(key, params['*'], fn)

      res.writeHead(302, {
        Location: `https://badgen.now.sh/badge/${subject}/${status}/${color}`
      })
      res.end()
    })
  })

  router.get('/list-cache-live', (req, res) => {
    res.writeHead(200)
    res.end(`Total ${cache.length}\n${cache.keys().join('\n')}`)
  })

  router.get('/clear-cache-live', (req, res) => {
    const count = cache.length
    const keys = cache.keys().join('\n')
    cache.reset()

    res.writeHead(200)
    res.end(`Cleaned ${count}\n${keys}`)
  })
}

async function fetchLiveParams (key, paramsPath, fn) {
  const cached = cache.get(paramsPath)
  if (cached) {
    return cached
  } else {
    const logStamp = `$${key} ${paramsPath}`
    console.time(logStamp)
    return timeout(fn(...paramsPath.split('/')), 30000)
      .then(fetched => {
        // Update cache if deleted (after got stale)
        cache.has(paramsPath) || cache.set(paramsPath, fetched)
        return fetched
      }, e => {
        console.error(e)
        return {}
      }).then(result => {
        console.timeEnd(logStamp)
        return result
      })
  }
}

function timeout (promise, period) {
  return Promise.race([
    new Promise((resolve, reject) => setTimeout(reject, period)),
    promise
  ])
}
