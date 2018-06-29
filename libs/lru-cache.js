const LRU = require('lru-cache')

const cache = new LRU({ max: 1000 })

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
  cache,
  listCache,
  cleanCache
}
