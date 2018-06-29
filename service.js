const http = require('http')
const cors = require('@amio/micro-cors')()
const router = require('find-my-way')()
const handlers = require('./libs/handlers.js')
const serveIndex = require('./libs/serve-index.js')

router.get('/badge/:subject/:status', handlers.serveBadge)
router.get('/badge/:subject/:status/:color', handlers.serveBadge)
router.get('/list/:subject/:status', handlers.serveListBadge)
router.get('/list/:subject/:status/:color', handlers.serveListBadge)

router.get('/clean-cache', handlers.cleanCache)
router.get('/list-cache', handlers.listCache)

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
