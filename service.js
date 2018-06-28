const http = require('http')
const cors = require('@amio/micro-cors')()
const router = require('find-my-way')()
const badgen = require('badgen')
const LRU = require('lru-cache')
const serveMarked = require('serve-marked')

const cache = new LRU({ max: 1000 })

function serveBadge (req, res, params) {
  const result = cache.get(req.url) || badgen(params)
  res.writeHead(200, {
    'Content-Type': 'image/svg+xml;charset=utf-8',
    'Cache-Control': 'public, max-age=360'
  })
  res.end(result)

  // Cache if not
  cache.has(req.url) || cache.set(req.url, result)
}

function serveListBadge (req, res, params) {
  const { subject, status, color } = params
  serveBadge(req, res, { subject, status: status.replace(/,/g, ' | '), color })
}

function cleanCache (req, res) {
  const count = cache.length
  const keys = cache.keys().join('\n')
  cache.reset()

  res.writeHead(200)
  res.end(`Cleaned ${count}\n${keys}`)
}

function listCache (req, res) {
  res.writeHead(200)
  res.end(`Total ${cache.length}\n${cache.keys().join('\n')}`)
}

const serveIndex = serveMarked('README.md', {
  title: 'Badgen - Fast badge generating service',
  preset: 'merri',
  inlineCSS: `
    td a { font: 14px monospace; vertical-align: top; margin-left: 1em }
  `,
  googleAnalyticsID: 'UA-4646421-14'
})

router.get('/badge/:subject/:status', serveBadge)
router.get('/badge/:subject/:status/:color', serveBadge)
router.get('/list/:subject/:status', serveListBadge)
router.get('/list/:subject/:status/:color', serveListBadge)
router.get('/', serveIndex)
router.get('/clean-cache', cleanCache)
router.get('/list-cache', listCache)
router.all('/*', (req, res) => {
  res.statusCode = 404
  res.end()
})

const handler = cors((req, res) => {
  try {
    router.lookup(req, res)
  } catch (ex) {
    console.error(ex)
    res.statusCode = 500
    res.end()
  }
})
const server = http.createServer(handler)
server.listen(3000)
