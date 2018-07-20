const http = require('http')
const fmw = require('find-my-way')
const setupLiveBadge = require('./libs/setup-live-badge.js')
const serveFavicon = require('./libs/serve-favicon.js')
const serveIndex = require('./libs/serve-index.js')
const serve404 = require('./libs/serve-404.js')
const serveBadge = require('./libs/serve-badge.js')
const serveListBadge = require('./libs/serve-list-badge.js')
const serveEmojiBadge = require('./libs/serve-emoji-badge.js')

const router = fmw({ defaultRoute: serve404 })

router.get('/', serveIndex)
router.get('/favicon.ico', serveFavicon)
router.get('/favicon.svg', serveFavicon)
router.get('/badge/:subject/:status', serveBadge)
router.get('/badge/:subject/:status/:color', serveBadge)
router.get('/list/:subject/:status', serveListBadge)
router.get('/list/:subject/:status/:color', serveListBadge)
router.get('/emoji/:subject/:status', serveEmojiBadge)
router.get('/emoji/:subject/:status/:color', serveEmojiBadge)

setupLiveBadge(router)

http.createServer((req, res) => {
  try {
    router.lookup(req, res)
  } catch (ex) {
    console.error('CRITICAL', ex)
    res.statusCode = 500
    res.end()
  }
}).listen(3000, () => console.log('Listening on 3000 >'))
