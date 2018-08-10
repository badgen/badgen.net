const badgen = require('badgen')
const { send } = require('micro')
const { builtin } = require('./icons.js')

const CACHE_CONTROL = `public, max-age=60, stale-while-revalidate=86400, stale-if-error=86400`

module.exports = (req, res, options = {}) => {
  const { code = 200, maxAge = '86400' } = options

  const hostStyle = req.headers.host === 'flat.badgen.net' ? 'flat' : undefined
  const { subject, status, color } = req.params
  const { style, label, emoji, list, icon } = req.query

  const badge = badgen({
    subject: typeof label !== 'undefined' ? label : subject,
    status: String(list ? status.replace(/,/g, ' | ') : status),
    color: color,
    style: style || hostStyle,
    emoji: Boolean(emoji),
    icon: builtin[icon]
  })

  res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8')
  res.setHeader('Cache-Control', `${CACHE_CONTROL}, s-maxage=${maxAge}`)
  send(res, code, badge)
}
