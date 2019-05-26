import badgen from 'badgen'
import icons from 'badgen-icons'

import { BadgenParams } from './types'

type ServeBadgeOptions = {
  code?: number
  sMaxAge?: number,
  query?: { [key: string]: any },
  params?: BadgenParams
}

export default function (req, res, options: ServeBadgeOptions) {
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

  const staleControl = `stale-while-revalidate=604800, stale-if-error=604800`
  const cacheControl = `public, max-age=20, s-maxage=${sMaxAge}, ${staleControl}`
  res.setHeader('Cache-Control', cacheControl)
  res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8')
  res.statusCode = code
  res.end(badge)
}
