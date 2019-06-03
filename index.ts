import fs from 'fs'
import path from 'path'
import http from 'http'
import serveHandler from 'serve-handler'

import serve404 from './libs/serve-404'
import serveDocs from './endpoints/docs'

const sendError = (req, res, error) => {
  res.statusCode = 500
  res.end(error.message)
}

const badgeHandlers = fs.readdirSync(path.join(__dirname, 'endpoints'))
  .filter(name => !name.startsWith('_'))
  .map(name => name.replace(/\.ts$/, ''))

const isStatic = (url) => {
  if (url === '/') return true
  if (url.startsWith('/static/')) return true
  if (url.startsWith('/_next/')) return true
  return false
}

const server = http.createServer(async (req, res) => {
  // handle statics
  if (isStatic(req.url)) {
    return serveHandler(req, res, { public: path.join(__dirname, 'dist') })
  }

  // handle `/docs/:name`
  if (req.url!.startsWith('/docs/')) {
    return serveDocs(req, res)
  }

  // handle endpoints
  const handlerName = badgeHandlers.find(h => req.url!.startsWith(`/${h}/`))

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

// Auto run
if (require.main === module) {
  server.listen(3000)
}

process.on('unhandledRejection', e => {
  console.error(500, e)
})

export default server
