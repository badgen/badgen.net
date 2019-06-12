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
  const { label, list, icon, iconWidth } = query
  const _icon = resolveIcon(icon === '' ? subject : icon, iconWidth)

  const badge = badgen({
    subject: typeof label !== 'undefined' ? label : subject,
    status: list ? String(status).replace(/,/g, ' | ') : String(status),
    color: query.color || color,
    style: query.style || process.env.BADGE_STYLE,
    icon: _icon.src,
    iconWidth: iconWidth || _icon.width
  })

  const staleControl = `stale-while-revalidate=604800, stale-if-error=604800`
  const cacheControl = `public, max-age=30, s-maxage=${sMaxAge}, ${staleControl}`
  res.setHeader('Cache-Control', cacheControl)
  res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8')
  res.statusCode = code
  res.end(badge)
}

type ResolvedIcon = {
  src?: string
  width?: string
}

function resolveIcon (icon: string | undefined, width: string): ResolvedIcon {
  const builtinIcon = icons[icon]
  if (builtinIcon) {
    return {
      src: builtinIcon.base64,
      width: width || builtinIcon.width
    }
  }

  if (String(icon).startsWith('https://')) {
    return { src: icon, width }
  }

  return {}
}
