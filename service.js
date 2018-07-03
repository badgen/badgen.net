const http = require('http')
const cors = require('@amio/micro-cors')()
const router = require('find-my-way')()
const serveIndex = require('./libs/serve-index.js')
const setupLiveBadge = require('./libs/setup-live-badge.js')
const setupStaticBadge = require('./libs/setup-static-badge.js')

setupLiveBadge(router)
setupStaticBadge(router)

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
