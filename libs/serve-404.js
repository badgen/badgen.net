const badgen = require('badgen')

module.exports = function serve404 (req, res) {
  res.writeHead(404, {
    'Content-Type': 'image/svg+xml;charset=utf-8',
    'Cache-Control': 'public, max-age=360, s-maxage=86400'
  })
  res.end(badgen({
    subject: 'Badgen',
    status: '404',
    color: 'red'
  }))
}
