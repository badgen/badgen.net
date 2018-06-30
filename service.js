const http = require('http')
const cors = require('@amio/micro-cors')()
const router = require('find-my-way')()
const serveIndex = require('./libs/serve-index.js')
const { serveBadge, serveListBadge } = require('./libs/serve-badge.js')
const { listCache, cleanCache } = require('./libs/lru-cache.js')
const setupLiveBadge = require('./libs/setup-live-badge.js')

router.get('/badge/:subject/:status', serveBadge)
router.get('/badge/:subject/:status/:color', serveBadge)
router.get('/list/:subject/:status', serveListBadge)
router.get('/list/:subject/:status/:color', serveListBadge)

setupLiveBadge(router)

router.get('/clean-cache', cleanCache)
router.get('/list-cache', listCache)

router.get('/', serveIndex)

router.all('/*', (req, res) => {
  res.statusCode = 404
  res.end()
})

const rootHandler = cors((req, res) => {
  try {
    router.lookup(req, res)
  } catch (ex) {
    console.error(ex)
    res.statusCode = 500
    res.end()
  }
})

const server = http.createServer(rootHandler)
server.listen(3000)
