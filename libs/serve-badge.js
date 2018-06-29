const badgen = require('badgen')
const { cache } = require('./lru-cache.js')

function serveBadge (req, res, params) {
  const result = cache.get(req.url) || badgen(params)
  res.writeHead(200, {
    'Content-Type': 'image/svg+xml;charset=utf-8',
    'Cache-Control': 'public, max-age=360'
  })
  res.end(result)

  // Cache if not
  cache.has(req.url) || cache.set(req.url, result)
}

function serveListBadge (req, res, params) {
  const { subject, status, color } = params
  serveBadge(req, res, { subject, status: status.replace(/,/g, ' | '), color })
}

module.exports = {
  serveBadge,
  serveListBadge
}
