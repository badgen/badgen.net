import { badgen } from 'badgen'
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
  const { label, labelColor, icon, iconWidth, list, scale } = query
  const _icon = resolveIcon(icon, iconWidth)

  // TODO: review usage of list
  list && console.log(`FEAT-LIST ${req.url}`)

  const badge = badgen({
    labelColor,
    subject: typeof label !== 'undefined' ? label : subject,
    status: transformStatus(status, { list }),
    color: query.color || color,
    style: query.style || process.env.BADGE_STYLE,
    icon: _icon.src,
    iconWidth: iconWidth || _icon.width,
    scale: scale && parseInt(scale, 10) || 1,
  })

  const staleControl = `stale-while-revalidate=604800, stale-if-error=604800`
  const cacheControl = `public, max-age=60, s-maxage=${sMaxAge}, ${staleControl}`
  res.setHeader('Cache-Control', cacheControl)
  res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8')
  res.statusCode = code
  res.end(badge)
}

function transformStatus (status: any, { list }) {
  status = String(status)

  if (list !== undefined) {
    if (list === '1' || list === '') list = '|' // compatible
    status = status.replace(/,/g, ` ${list} `)
  }

  return status
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

  if (String(icon).startsWith('data:image/')) {
    return { src: icon, width }
  }

  return {}
}
