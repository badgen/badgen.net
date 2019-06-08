import badgen from 'badgen'
import icons from 'badgen-icons'

import { BadgenParams } from './types'

type ServeBadgeOptions = {
  code?: number
  sMaxAge?: number,
  query?: { [key: string]: any },
  params: BadgenParams
}

export default function (req, res, options: ServeBadgeOptions) {
  const { code = 200, sMaxAge = 10800, query = {}, params } = options

  const { subject, status, color } = params
  const { style, label, list, icon, iconWidth, color: queryColor } = query
  const _icon = icons[icon === '' ? subject : icon] || {
    base64: icon,
    width: iconWidth
  }

  const badge = badgen({
    subject: typeof label !== 'undefined' ? label : subject,
    status: String(list ? status.replace(/,/g, ' | ') : status),
    color: queryColor || color,
    style: style,
    icon: _icon.base64,
    iconWidth: _icon.width
  })

  const staleControl = `stale-while-revalidate=604800, stale-if-error=604800`
  const cacheControl = `public, max-age=30, s-maxage=${sMaxAge}, ${staleControl}`
  res.setHeader('Cache-Control', cacheControl)
  res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8')
  res.statusCode = code
  res.end(badge)
}
