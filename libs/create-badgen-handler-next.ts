import matchRoute from 'my-way'
import { HTTPError } from './http'

import { serveBadgeNext } from './serve-badge-next'
import serveDoc from './serve-doc-next'
import fetchIcon from './fetch-icon'
import sentry from './sentry'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { BadgenParams } from './types'

export type PathArgs = NonNullable<ReturnType<typeof matchRoute>>
export type BadgenResponse = BadgenParams | string
export type BadgenHandler = (pathArgs: PathArgs, req: NextApiRequest, res: NextApiResponse) => Promise<BadgenResponse>

export interface BadgenServeConfig {
  title: string;
  help?: string;
  examples: { [url: string]: string };
  handlers: { [pattern: string]: BadgenHandler };
  sMaxAge?: number;
}

// Own the full HTTP lifecycle so routing, upstream and rendering failures share
// the same status/cache policy. Services may still own successful cache headers.
export function createBadgenHandler (badgenServerConfig: BadgenServeConfig) {
  const { handlers, sMaxAge } = badgenServerConfig

  async function nextHandler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
      res.setHeader('Access-Control-Allow-Origin', '*')
      return res.status(204).end()
    }

    try {
      const { pathname } = new URL(req.url || '/', 'http://badgen.net')
      const decodedPathname = decodeURI(pathname)

      if (pathname === '/favicon.ico') {
        return res.end()
      }

      if (matchRoute('/:name', decodedPathname)) {
        return await serveDoc(badgenServerConfig)(req, res)
      }

      let matchedArgs: PathArgs | null = null
      const matchedScheme = Object.keys(handlers).find(scheme => {
        return matchedArgs = matchRoute(scheme, decodedPathname)
      })

      if (matchedArgs === null || matchedScheme === undefined) {
        throw new BadgenError({ status: '404', code: 404 })
      }

      const query = { ...req.query }
      const externalIcon = typeof query.icon === 'string' && query.icon.startsWith('https://')
        ? fetchIcon(query.icon)
        : undefined
      const badgenResponse = await handlers[matchedScheme](matchedArgs, req, res)
      if (typeof badgenResponse === 'string') {
        return res.end(badgenResponse)
      }

      if (externalIcon) {
        query.icon = await externalIcon
      } else if (query.icon === '') {
        query.icon = String(badgenResponse.subject)
      }

      return await serveBadgeNext(req, res, { params: badgenResponse, query, sMaxAge })
    } catch (error) {
      if (!(error instanceof URIError) && !(error instanceof BadgenError && error.code < 500)) {
        sentry.captureException(error)
        const detail = error instanceof Error ? error.stack || error.message : typeof error === 'string' ? error : 'Unknown error'
        console.error('BADGE_HANDLER_ERROR', req.url, detail)
      }

      const { code, status, color } = describeError(error)
      const message = error instanceof Error ? error.message : String(error)
      res.setHeader('Error-Message', message.replace(/[^\x20-\x7e]/g, ' '))
      // Error policy must override both service headers and success query settings.
      res.setHeader('Cache-Control', 'public, max-age=5, s-maxage=5')
      return await serveBadgeNext(req, res, {
        code,
        query: {},
        params: { subject: req.url?.split('/')[1]?.split('?')[0] || 'error', status, color }
      })
    }
  }

  const { title, help, examples } = badgenServerConfig
  nextHandler.meta = { title, help, examples, handlers }
  return nextHandler
}

function describeError (error: unknown): { code: number, status: string, color: string } {
  if (error instanceof BadgenError) {
    return { code: error.code, status: String(error.status), color: error.color }
  }
  // Our upstream requests only abort on their deadline. Depending on the Node
  // version, body consumption reports the timeout as TimeoutError or AbortError.
  if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError' || ('code' in error && error.code === 'ETIMEDOUT'))) {
    return { code: 504, status: 'timeout', color: 'grey' }
  }
  if (error instanceof HTTPError) {
    return { code: 502, status: String(error.status), color: 'grey' }
  }
  if (error instanceof URIError) {
    return { code: 400, status: 'invalid URI', color: 'grey' }
  }
  return { code: 500, status: '500', color: 'red' }
}

export class BadgenError extends Error {
  public status: string | number
  public color: string
  public code: number

  constructor ({ status, color = 'grey', code = 500, message = '' }: {
    status: string | number,
    color?: string,
    code?: number,
    message?: string
  }) {
    super(message)
    this.name = 'BadgenError'
    this.status = status
    this.color = color
    this.code = code
  }
}
