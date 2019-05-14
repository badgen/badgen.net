import fs from 'fs'
import path from 'path'
import http from 'http'

import serve404 from './libs/serve-404'

const badgeHandlers = fs.readdirSync(path.join(__dirname, 'endpoints'))
  .filter(name => !name.startsWith('_'))
  .map(name => name.replace(/\.ts$/, ''))

module.exports = http.createServer(async (req, res) => {
  const handler = badgeHandlers.find(h => req.url!.startsWith(`/${h}`))

  if (handler) {
    return import(path.join(__dirname, 'endpoints', handler)).then(h => {
      h.default(req, res)
    })
  } else {
    return serve404(req, res)
  }
})

if (require.main) {
  module.exports.listen(3000)
}

process.on('unhandledRejection', err => console.error(err.message, err.stack))
