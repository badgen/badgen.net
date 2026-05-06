import { badgen } from 'badgen'
import icons from 'badgen-icons'
import originalUrl from 'original-url'

import { IncomingMessage, ServerResponse } from 'http'
import { BadgenParams } from './types'
import { createBadgeCacheControlHeader, resolveBadgeCacheMaxAge } from './badge-cache-control'

type ServeBadgeOptions = {
  code?: number
  sMaxAge?: number,
  query?: { [key: string]: string | undefined },
  params: BadgenParams
}

export default async function (req: IncomingMessage, res: ServerResponse, options: ServeBadgeOptions) {
  const { code = 200, sMaxAge = 21600, query = {}, params } = options

  const { subject, status, color } = params
  const { label, labelColor, icon, iconWidth, list, scale, cache } = query
  const _icon = await resolveIcon(icon, iconWidth)

  // TODO: review usage of list
  list && console.log(`FEAT-LIST ${req.url}`)

  const badge = badgen({
    labelColor,
    subject: typeof label !== 'undefined' ? label : subject,
    status: transformStatus(status, { list }),
    color: query.color || color,
    style: autoBadgeStyle(req, query.style),
    icon: _icon.src,
    iconWidth: parseInt(iconWidth || _icon.width || '13', 10),
    scale: parseFloat(scale || '1'),
  })

  const cacheMaxAge = resolveBadgeCacheMaxAge(cache, sMaxAge)
  res.setHeader('Cache-Control', createBadgeCacheControlHeader(cacheMaxAge))
  res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8')
  res.statusCode = code
  res.end(badge)
}

type BadgeStyle = 'flat' | undefined

function autoBadgeStyle (req: IncomingMessage, fallbackValue?: string): BadgeStyle {
  const isFlat = (fallbackValue || process.env.BADGE_STYLE === 'flat')
    || originalUrl(req).hostname.includes('flat')
  return isFlat ? 'flat' : undefined
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

async function resolveIcon (icon: string | undefined, width?: string): Promise<ResolvedIcon> {
  if (!icon) {
    return {}
  }

  const builtinIcon = icons[icon]
  if (builtinIcon) {
    return {
      src: builtinIcon.base64,
      width: width || builtinIcon.width
    }
  }

  const { getSiIcon } = await import('./simple-icons')
  const siIcon = await getSiIcon(icon)
  if (siIcon) {
    const svg = siIcon.svg.replace('<svg', '<svg fill="white"')
    return {
      src: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
      width: width || '13'
    }
  }

  if (icon.startsWith('data:image/')) {
    return { src: icon, width }
  }

  return {}
}
