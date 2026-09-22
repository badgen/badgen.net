import { badgen } from 'badgen'
import icons from 'badgen-icons'
import originalUrl from 'original-url'

import { BadgenParams } from './types'
import { createBadgeCacheControlHeader, resolveBadgeCacheMaxAge } from './badge-cache-control'

import type { NextApiRequest, NextApiResponse } from 'next'

type ServeBadgeOptions = {
  code?: number
  sMaxAge?: number,
  query?: NextApiRequest['query'],
  params: BadgenParams
}

export async function serveBadgeNext (req: NextApiRequest, res: NextApiResponse, options: ServeBadgeOptions) {
  const { code = 200, sMaxAge = 3600, query = req.query, params } = options
  const { subject, status, color } = params

  const { list, scale, cache } = query
  const iconMeta = await resolveIcon(query.icon, query.iconWidth)

  const badgeParams = {
    labelColor: resolveColor(query.labelColor, '555'),
    subject: formatSVGText(typeof query.label === 'string' ? query.label : subject),
    status: formatSVGText(transformStatus(status, { list })),
    color: resolveColor(query.color || color, 'blue'),
    style: resolveBadgeStyle(req, query.style),
    icon: iconMeta.src,
    iconWidth: iconMeta.width,
    scale: parseFloat(String(scale)) || 1,
  }

  const badgeSVGString = badgen(badgeParams)

  // Explicit service cache headers take precedence over successful query defaults.
  if (res.getHeader('cache-control') === undefined) {
    const cacheMaxAge = resolveBadgeCacheMaxAge(cache, sMaxAge)
    res.setHeader('cache-control', createBadgeCacheControlHeader(cacheMaxAge))
  }

  res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8')
  res.setHeader('Access-Control-Allow-Origin', '*')

  res.statusCode = code
  res.send(badgeSVGString)
}

function resolveBadgeStyle (req: NextApiRequest, style?: string | string[]): 'flat' | 'classic' {
  if (style === 'flat') {
    return 'flat'
  }

  if (process.env.BADGE_STYLE === 'flat') {
    return 'flat'
  }

  try {
    return originalUrl(req).hostname?.includes('flat') ? 'flat' : 'classic'
  } catch {
    // Invalid proxy metadata must not prevent an error badge from rendering.
    return 'classic'
  }
}

function formatSVGText (text: string | number): string {
  return String(text)
    .replace(/%2F/g, '/') // simple decode
}

function transformStatus (status: any, { list }): string {
  status = String(status)

  if (list !== undefined) {
    if (list === '1' || list === '') list = '|' // compatible
    status = status.replace(/,/g, ` ${list} `)
  }

  return status
}

function resolveColor (color: string | string[] | undefined, defaultColor: string): string {

  if (color !== undefined) {
    return String(color)
  }

  return defaultColor
}

type ResolvedIcon = {
  src?: string
  width?: number
}

async function resolveIcon (icon?: string | string[], width?: string | string[]): Promise<ResolvedIcon> {
  if (typeof icon !== 'string' || !icon) {
    return {}
  }

  const iconArg = icon

  const widthNum = parseInt(String(width))

  const builtinIcon = icons[iconArg]
  if (builtinIcon) {
    return {
      src: builtinIcon.base64,
      width: widthNum || parseInt(builtinIcon.width)
    }
  }

  const { getSiIcon } = await import('./simple-icons')
  const siIcon = await getSiIcon(iconArg)
  if (siIcon) {
    const svg = siIcon.svg.replace('<svg', '<svg fill="white"')
    return {
      src: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
      width: widthNum || 13
    }
  }

  if (iconArg.startsWith('data:image/')) {
    return { src: iconArg, width: widthNum || 13 }
  }

  return {}
}
