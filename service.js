const http = require('http')
const cors = require('@amio/micro-cors')()
const router = require('find-my-way')()
const badgen = require('badgen')
const LRU = require('lru-cache')

const cache = new LRU({ max: 1000 })

function serveBadge (req, res, params) {
  res.writeHead(200, { 'Content-Type': 'image/svg+xml;charset=utf-8' })

  const cached = cache.get(req.url)
  if (cached) {
    res.end(cached)
  } else {
    const created = badgen(params)
    cache.set(req.url, created)
    res.end(created)
  }
}

function serveListBadge (req, res, params) {
  const { subject, status, color } = params
  serveBadge(req, res, { subject, status: status.replace(/,/g, ' | '), color })
}

function redirect (req, res) {
  res.writeHead(302, { 'Location': 'https://amio.github.io/badgen' })
  res.end()
}

router.get('/badge/:subject/:status', serveBadge)
router.get('/badge/:subject/:status/:color', serveBadge)
router.get('/list/:subject/:status', serveListBadge)
router.get('/list/:subject/:status/:color', serveListBadge)
router.get('/', redirect)

const handler = cors((req, res) => router.lookup(req, res))
const server = http.createServer(handler)
server.listen(3000)
