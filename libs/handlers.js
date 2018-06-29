const badgen = require('badgen')
const LRU = require('lru-cache')

const cache = new LRU({ max: 1000 })

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

function cleanCache (req, res) {
  const count = cache.length
  const keys = cache.keys().join('\n')
  cache.reset()

  res.writeHead(200)
  res.end(`Cleaned ${count}\n${keys}`)
}

function listCache (req, res) {
  res.writeHead(200)
  res.end(`Total ${cache.length}\n${cache.keys().join('\n')}`)
}

module.exports = {
  serveBadge,
  serveListBadge,
  cleanCache,
  listCache
}
