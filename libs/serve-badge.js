const badgen = require('badgen')

module.exports = function serveBadge (req, res, options = {}) {
  const { code = 200, maxAge = '86400' } = options

  const hostStyle = req.headers.host === 'flat.badgen.net' ? 'flat' : undefined
  const { subject, status, color } = req.params
  const { style, label, emoji, list } = req.query

  const badgenParams = {
    subject: label || subject,
    status: list ? status.replace(/,/g, ' | ') : status,
    color: color,
    style: style || hostStyle,
    emoji: !!emoji
  }

  res.writeHead(code, {
    'Content-Type': 'image/svg+xml;charset=utf-8',
    'Cache-Control': `public, max-age=60, s-maxage=${maxAge}`
  })
  res.end(badgen(badgenParams))
}
