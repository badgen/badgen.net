const { serveBadge, serveListBadge } = require('./serve-badge.js')
const { listCache, clearCache } = require('./lru-cache-static.js')

module.exports = function (router) {
  router.get('/badge/:subject/:status', serveBadge)
  router.get('/badge/:subject/:status/:color', serveBadge)
  router.get('/list/:subject/:status', serveListBadge)
  router.get('/list/:subject/:status/:color', serveListBadge)

  router.get('/list-cache-static', listCache)
  router.get('/clear-cache-static', clearCache)
}
