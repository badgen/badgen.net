const url = require('url')
const PathParser = require('path-parser').default

const serve404 = require('./serve-404.js')
const serveBadge = require('./serve-badge.js')

module.exports = function createHandler (schemes, handler, { help, examples }) {
  const matchers = schemes.map(scheme => new PathParser(scheme))

  return async function httpHandler (req, res) {
    const { pathname, query } = url.parse(req.url, true)

    console.log(matchers)
    if (pathname === '/favicon.ico') {
      return serve404(req, res)
    }

    let matchedArgs
    matchers.find(m => (matchedArgs = m.test(pathname)))

    if (matchedArgs) {
      const params = await handler(matchedArgs)
      return serveBadge(req, res, { params, query })
    }

    return serve404(req, res)
  }
}
