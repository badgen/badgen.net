const url = require('url')
const PathParser = require('path-parser').default

const serve404 = require('./serve-404.js')
const serveHelp = require('./serve-help.js')
const serveBadge = require('./serve-badge.js')

module.exports = function badgenServe (handlers, { help = '', examples = [] } = {}) {
  return async function httpHandler (req, res) {
    const { pathname, query } = url.parse(req.url, true)

    // serve favicon
    if (pathname === '/favicon.ico') {
      return res.end()
    }

    // serve help message
    if (pathname.startsWith('/help')) {
      return serveHelp(req, res, help, examples)
    }

    // Lookup handler
    let matchedArgs
    const matchedScheme = Object.keys(handlers).find(scheme => {
      matchedArgs = new PathParser(scheme).test(pathname)
      return matchedArgs !== null
    })

    if (matchedScheme) {
      const params = await handlers[matchedScheme](matchedArgs)
      return serveBadge(req, res, { params, query })
    } else {
      return serve404(req, res)
    }
  }
}
