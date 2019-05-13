const fs = require('fs')
const http = require('http')

const serve404 = require('../libs/serve-404.js')

const files = fs.readDirSync(__dirname)
const badgeHandlers = files.filter(name => !name.startsWith('_'))

const server = http.createServer((req, res) => {
  const handler = badgeHandlers.find(h => req.url.startsWith(`/${h}`))

  if (handler) {
    return require(`./${handler}`)(req, res)
  } else {
    return serve404(req, res)
  }
})
