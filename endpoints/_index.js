const fs = require('fs')
const path = require('path')
const http = require('http')

const serve404 = require('../libs/serve-404.js')

const badgeHandlers = fs.readdirSync(__dirname)
  .filter(name => !name.startsWith('_'))
  .map(name => name.replace(/\.js$/, ''))

module.exports = http.createServer((req, res) => {
  const handler = badgeHandlers.find(h => req.url.startsWith(`/${h}`))

  if (handler) {
    return require(path.join(__dirname, handler))(req, res)
  } else {
    return serve404(req, res)
  }
})

if (require.main) {
  module.exports.listen(3000)
}

process.on('unhandledRejection', err => console.error(err.message, err.stack))
