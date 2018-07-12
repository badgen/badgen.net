const LRU = require('lru-cache')

const cache = LRU({
  max: 5000,
  maxAge: 12e4, // 2 minutes
  stale: true
})

function listCache (req, res) {
  res.writeHead(200)
  res.end(`Total ${cache.length}\n${cache.keys().join('\n')}`)
}

function clearCache (req, res) {
  const count = cache.length
  const keys = cache.keys().join('\n')
  cache.reset()

  res.writeHead(200)
  res.end(`Cleared ${count}\n${keys}`)
}

module.exports = {
  cache,
  listCache,
  clearCache
}
