const { send } = require('micro')
const badgen = require('badgen')
const icons = require('./icons.js')

module.exports = function serveBadge (req, res, options = {}) {
  const { code = 200, maxAge = '86400' } = options

  const hostStyle = req.headers.host === 'flat.badgen.net' ? 'flat' : undefined
  const { subject, status, color } = req.params
  const { style, label, emoji, list, icon } = req.query

  const badgenParams = {
    subject: String(label || subject),
    status: String(list ? status.replace(/,/g, ' | ') : status),
    color: color,
    style: style || hostStyle,
    emoji: Boolean(emoji),
    icon: icons[icon] || icon
  }

  res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8')
  res.setHeader('Cache-Control', `public, max-age=60, s-maxage=${maxAge}`)
  send(res, code, badgen(badgenParams))
}
