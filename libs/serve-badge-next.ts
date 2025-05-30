import { badgen } from 'badgen'
import icons from 'badgen-icons'
import originalUrl from 'original-url'

import { BadgenParams } from './types'

import type { NextApiRequest, NextApiResponse } from 'next'

type ServeBadgeOptions = {
  code?: number
  sMaxAge?: number,
  params: BadgenParams
}

export function serveBadgeNext (req: NextApiRequest, res: NextApiResponse, options: ServeBadgeOptions) {
  const { code = 200, sMaxAge = 3600, params } = options
  const { subject, status, color } = params

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.status(204).end()
  }

  const query = req.query
  const { list, scale, cache } = req.query
  const iconMeta = resolveIcon(query.icon, query.iconWidth)

  const badgeParams = {
    labelColor: resolveColor(query.labelColor, '555'),
    subject: formatSVGText(typeof query.label === 'string' ? query.label : subject),
    status: formatSVGText(transformStatus(status, { list })),
    color: resolveColor(query.color || color, 'blue'),
    style: resolveBadgeStyle(req),
    icon: iconMeta.src,
    iconWidth: iconMeta.width,
    scale: parseFloat(String(scale)) || 1,
  }

  const badgeSVGString = badgen(badgeParams)

  // Minimum s-maxage is set to 300s(5m)
  if (res.getHeader('cache-control') === undefined) {
    const cacheMaxAge = cache ? Math.max(parseInt(String(cache)), 300) : sMaxAge
    res.setHeader('cache-control', `public, max-age=86400, s-maxage=${cacheMaxAge}, stale-while-revalidate=86400`)
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

  if (originalUrl(req).hostname.includes('flat')) {
    return 'flat'
  }

  return 'classic'
}

function formatSVGText (text: string): string {
  return text
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

function resolveIcon (icon?: string | string[], width?: string | string[]): ResolvedIcon {
  const iconArg = String(icon) || ''
  const widthNum = parseInt(String(width)) || 10

  const builtinIcon = icons[icon]

  if (builtinIcon) {
    return {
      src: builtinIcon.base64,
      width: widthNum || builtinIcon.width
    }
  }

  if (iconArg.startsWith('data:image/')) {
    return { src: iconArg, width: widthNum }
  }

  return {}
}
