const fs = require('fs')
const path = require('path')
const { send } = require('micro')
const { router, get } = require('micro-fork')
const liveFunctions = require('./live-fns/_index.js')
const liveFetcher = require('./live-fetcher.js')
const serveStats = require('./serve-stats.js')

const CACHE_CONTROL = `public, max-age=60, stale-while-revalidate=86400, stale-if-error=86400`
const sMaxAges = {
  'github': '240'
}

const apiHandlers = Object.entries(liveFunctions).map(([name, fn]) => {
  return get(`/${name}/*`, async (req, res) => {
    res.setHeader('Cache-Control', `${CACHE_CONTROL}, s-maxage=${sMaxAges[name] || '120'}`)
    send(res, 200, await liveFetcher(name, fn, req.params['*']))
  })
})

const indexContent = fs.readFileSync(path.join(__dirname, 'index-api.md'), 'utf8')
const serveIndex = (req, res) => send(res, 200, indexContent)

module.exports = router()(
  get('/', serveIndex),
  get('/_stats', serveStats),
  ...apiHandlers
)
