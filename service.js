const micro = require('micro')
const { router, get } = require('micro-fork')
const serveFavicon = require('./libs/serve-favicon.js')
const serveIndex = require('./libs/serve-index.js')
const serve404 = require('./libs/serve-404.js')
const serveDocs = require('./libs/serve-docs.js')
const serveBadge = require('./libs/serve-badge.js')
const liveBadgeHandlers = require('./libs/live-badge-handlers.js')

module.exports = router()(
  get('/*', serve404),
  get('/', serveIndex),
  get('/docs/:topic', serveDocs),
  get('/favicon.ico', serveFavicon),
  get('/favicon.svg', serveFavicon),
  get('/badge/:subject/:status', (req, res) => serveBadge(req, res)),
  get('/badge/:subject/:status/:color', (req, res) => serveBadge(req, res)),
  ...liveBadgeHandlers
)

if (require.main === module) {
  micro(module.exports).listen(3000)
}
