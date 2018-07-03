const liveFns = require('./live-fns/index.js')
const { cache, listCache, clearCache } = require('./lru-cache-live.js')

module.exports = function (router) {
  Object.entries(liveFns).forEach(([name, fn]) => {
    router.get(`/${name}/*`, async (req, res, params) => {
      const {
        subject = name,
        status = 'unknown',
        color = 'grey'
      } = await fetchLiveParams(name, fn, params['*'])

      res.writeHead(302, {
        Location: `/badge/${subject}/${status}/${color}`
      })
      res.end()
    })
  })

  router.get('/list-cache-live', listCache)
  router.get('/clear-cache-live', clearCache)
}

async function fetchLiveParams (scope, fn, paramsPath) {
  const cached = cache.get(paramsPath)
  if (cached) {
    return cached
  } else {
    const cacheKey = `#${scope} ${paramsPath}`
    console.time(cacheKey)
    return timeout(fn(...paramsPath.split('/')), 30000)
      .then(fetched => {
        // Update cache if deleted (after got stale)
        cache.has(paramsPath) || cache.set(cacheKey, fetched)
        return fetched
      }, e => {
        console.error(e)
        return {}
      }).then(result => {
        console.timeEnd(cacheKey)
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
