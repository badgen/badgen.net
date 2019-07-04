import fs from 'fs'
import path from 'path'
import http from 'http'
import serveHandler from 'serve-handler'

import serve404 from './libs/serve-404'

const sendError = (res: http.ServerResponse, error: Error) => {
  res.statusCode = 500
  res.end(error.message)
}

const sendRedirection = (res: http.ServerResponse, code: number, dest: string) => {
  res.statusCode = code
  res.setHeader('Location', dest)
  res.end()
}

const badgeHandlers = fs.readdirSync(path.join(__dirname, 'endpoints'))
  .filter(name => /\.[jt]s$/.test(name))
  .map(name => name.replace(/\.[jt]s$/, ''))

const isStatic = (url) => {
  if (url === '/') return true
  if (url.startsWith('/_next/')) return true
  if (url.startsWith('/static/')) return true
  if (url.startsWith('/builder')) return true
  return false
}

const serveStaticHeaders = [
  {
    source: "**/*",
    headers: [{
      key: "Cache-Control",
      value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400"
    }]
  }
]

const { PUB_DIR = '.' } = process.env
const server = http.createServer(async (req, res) => {
  const url = req.url || '/'

  // handle statics
  if (isStatic(url)) {
    return serveHandler(req, res, {
      public: path.resolve(__dirname, PUB_DIR),
      headers: serveStaticHeaders
    })
  }

  // handle `/docs/:name`
  if (url.startsWith('/docs/')) {
    return sendRedirection(res, 301, url.replace('/docs', ''))
  }

  // handle endpoints
  const handlerName = badgeHandlers.find(h => url.startsWith(`/${h}`))

  try {
    if (handlerName) {
      const handlerPath = path.join(__dirname, 'endpoints', handlerName)
      const { default: handler } = await import(handlerPath)
      return handler(req, res, handlerName)
    }
  } catch (error) {
    console.error(error)
    return sendError(res, error)
  }

  return serve404(req, res)
})

// Auto run
if (require.main === module) {
  const port = process.env.PORT || 3000
  server.listen(port)
  console.log(`Badgen listening on port ${port}`)
}

process.on('unhandledRejection', e => {
  console.error('REJECTION', e)
})

export default server
