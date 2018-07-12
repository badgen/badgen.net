const http = require('http')
const fmw = require('find-my-way')
const setupRedirectBadge = require('./libs/setup-redirect-badge.js')
const setupLiveBadge = require('./libs/setup-live-badge.js')
const serveFavicon = require('./libs/serve-favicon.js')
const serveIndex = require('./libs/serve-index.js')
const serve404 = require('./libs/serve-404.js')
const { serveBadge, serveListBadge } = require('./libs/serve-badge.js')

const router = fmw({ defaultRoute: serve404 })

// Setup routes for serving statics
router.get('/', serveIndex)
router.get('/favicon.ico', serveFavicon)
router.get('/badge/:subject/:status', serveBadge)
router.get('/badge/:subject/:status/:color', serveBadge)
router.get('/list/:subject/:status', serveListBadge)
router.get('/list/:subject/:status/:color', serveListBadge)

// Setup routes for serving redirects
setupLiveBadge(router)
setupRedirectBadge(router)

http.createServer((req, res) => {
  try {
    router.lookup(req, res)
  } catch (ex) {
    console.error('CRITICAL', ex)
    res.statusCode = 500
    res.end()
  }
}).listen(3000)
