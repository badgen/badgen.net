const liveFns = require('./live-fns/index.js')
const { cache, listCache, clearCache } = require('./lru-cache-live.js')

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

  router.get('/list-cache-live', listCache)
  router.get('/clear-cache-live', clearCache)
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
