const http = require('http')
const router = require('find-my-way')()
const setupStaticBadge = require('./libs/setup-static-badge.js')
const setupLiveBadge = require('./libs/setup-live-badge.js')
const setupRedirectBadge = require('./libs/setup-redirect-badge.js')
const serveIndex = require('./libs/serve-index.js')

setupStaticBadge(router)
setupLiveBadge(router)
setupRedirectBadge(router)

router.get('/', serveIndex)

router.all('/*', (req, res) => {
  res.statusCode = 404
  res.end()
})

const rootHandler = (req, res) => {
  try {
    router.lookup(req, res)
  } catch (ex) {
    console.error(ex)
    res.statusCode = 500
    res.end()
  }
}

const server = http.createServer(rootHandler)
server.listen(3000)
