const fs = require('fs')
const path = require('path')
const { send } = require('micro')
const { router, get } = require('micro-fork')
const liveFunctions = require('./live-fns/_index.js')
const liveFetcher = require('./live-fetcher.js')
const serveStats = require('./serve-stats.js')

const CACHE_CONTROL = `public, max-age=60, stale-while-revalidate=86400, stale-if-error=86400`
const sMaxAges = {
  github: '240'
}

const apiHandlers = Object.entries(liveFunctions).map(([name, fn]) => {
  return get(`/${name}/*`, async (req, res) => {
    res.setHeader('Cache-Control', `${CACHE_CONTROL}, s-maxage=${sMaxAges[name] || '120'}`)
    const result = await liveFetcher(name, fn, req.params['*'])
    let status = 200
    if (result.failed) {
      switch (result.status) {
        case 'timeout':
          status = 504
          break
        case 'not found':
          status = 404
          break
        default:
          status = 500
      }
    }
    send(res, status, result)
  })
})

const indexContent = fs.readFileSync(path.join(__dirname, 'index-api.md'), 'utf8')
const serveIndex = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=86400')
  send(res, 200, indexContent)
}

module.exports = router()(
  get('/', serveIndex),
  get('/_stats', serveStats),
  ...apiHandlers
)
