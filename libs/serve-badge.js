const badgen = require('badgen')
const { send } = require('micro')
const icons = require('badgen-icons')

const CACHE_CONTROL = `public, max-age=10, stale-while-revalidate=604800, stale-if-error=604800`

module.exports = (req, res, options = {}) => {
  const { code = 200, sMaxAge = '604800', query = {}, params } = options

  const hostStyle = req.headers.host === 'flat.badgen.net' ? 'flat' : undefined
  const { subject, status, color } = params || req.params
  const { style, label, list, icon, iconWidth, color: queryColor } = query || req.query
  const _icon = icons[icon === '' ? subject : icon] || {
    base64: icon,
    width: iconWidth
  }

  const badge = badgen({
    subject: typeof label !== 'undefined' ? label : subject,
    status: String(list ? status.replace(/,/g, ' | ') : status),
    color: queryColor || color,
    style: style || hostStyle,
    icon: _icon.base64,
    iconWidth: _icon.width
  })

  res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8')
  res.setHeader('Cache-Control', `${CACHE_CONTROL}, s-maxage=${sMaxAge}`)
  send(res, code, badge)
}
