import fs from 'fs'
import path from 'path'
import http from 'http'

import serve404 from './libs/serve-404'

const sendError = (req, res, error) => {
  res.statusCode = 500
  res.end(error.message)
}

const badgeHandlers = fs.readdirSync(path.join(__dirname, 'endpoints'))
  .filter(name => !name.startsWith('_'))
  .map(name => name.replace(/\.ts$/, ''))

const server = http.createServer(async (req, res) => {
  const handlerName = badgeHandlers.find(h => req.url!.startsWith(`/${h}`))

  try {
    if (handlerName) {
      const handlerPath = path.join(__dirname, 'endpoints', handlerName)
      const { default: handler } = await import(handlerPath)
      return handler(req, res)
    }
  } catch (error) {
    console.error(error)
    return sendError(req, res, error)
  }

  return serve404(req, res)
})

if (require.main === module) {
  server.listen(3000)
}

export default server
