const badgen = require('badgen')

function serveBadge (req, res, params) {
  res.writeHead(200, {
    'Content-Type': 'image/svg+xml;charset=utf-8',
    'Cache-Control': 'public, max-age=360, s-maxage=86400'
  })
  res.end(badgen(params))
}

function serveListBadge (req, res, params) {
  const { subject, status, color } = params
  serveBadge(req, res, { subject, status: status.replace(/,/g, ' | '), color })
}

module.exports = {
  serveBadge,
  serveListBadge
}
