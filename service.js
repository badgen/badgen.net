const micro = require('micro')
const { router, get } = require('micro-fork')
const serveFavicon = require('./libs/serve-favicon.js')
const serveIndex = require('./libs/serve-index.js')
const serve404 = require('./libs/serve-404.js')
const serveDocs = require('./libs/serve-docs.js')
const serveBadge = require('./libs/serve-badge.js')
const liveHandlers = require('./libs/live-handlers.js')
const serveCache = require('./libs/serve-cache.js')

const main = router()(
  get('/*', serve404),
  get('/', serveIndex),
  get('/docs/:topic', serveDocs),
  get('/favicon.ico', serveFavicon),
  get('/favicon.svg', serveFavicon),
  get('/badge/:subject/:status', (req, res) => serveBadge(req, res)),
  get('/badge/:subject/:status/:color', (req, res) => serveBadge(req, res)),
  ...liveHandlers
)

module.exports = function (req, res) {
  switch (req.headers.host) {
    case 'api.badgen.net':
    case '127.0.0.1:3000':
      return serveCache(req, res)
    default:
      return main(req, res)
  }
}

if (require.main === module) {
  micro(module.exports).listen(3000)
}
