import http from 'http'
// import { measure } from 'measurement-protocol'
import matchRoute from 'my-way'

import { serveBadgeNext } from './serve-badge-next'
import serveDoc from './serve-doc'
import sentry from './sentry'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { BadgenParams } from './types'
import { HTTPError } from 'got'

export type PathArgs = NonNullable<ReturnType<typeof matchRoute>>
export type BadgenResult = Promise<BadgenParams>

export interface BadgenServeConfig {
    title: string;
    help?: string;
    examples: { [url: string]: string };
    handlers: { [pattern: string]: (pathArgs: PathArgs) => BadgenResult };
  }

export function createBadgenHandler (badgenServerConfig: BadgenServeConfig) {
  const { handlers, title, help, examples } = badgenServerConfig

  async function nextHandler (req: NextApiRequest, res: NextApiResponse) {
    let { pathname } = new URL(req.url || '/', `http://${req.headers.host}`)

    if (pathname === '/favicon.ico') {
      return res.end()
    }

    // Match badge handlers
    let matchedArgs: PathArgs | null = null
    const matchedScheme = Object.keys(handlers).find(scheme => {
      return matchedArgs = matchRoute(scheme, decodeURI(pathname))
    })

    // Invoke badge handler
    if (matchedArgs !== null && matchedScheme !== undefined) {
      return await handlers[matchedScheme](matchedArgs).then(params => {
        return serveBadgeNext(req, res, { params })
      }).catch(error => {
        const meta = { matchedArgs, matchedScheme }
        return onBadgeHandlerError(meta, error, req, res)
      })
    }

    if (matchRoute('/:name', pathname)) {
      return serveDoc(badgenServerConfig)(req, res)
    }

    res.status(404).end()
  }

  nextHandler.meta = { title, examples, help, handlers }

  return nextHandler
}

function onBadgeHandlerError (meta: any, err: Error | HTTPError, req: NextApiRequest, res: NextApiResponse) {
  sentry.captureException(err)

  console.error('BADGE_HANDLER_ERROR', err.message, req.url)

  // Send user friendly response
  const errorBadgeParams = {
    subject: 'error',
    status: '500',
    color: 'red',
  }

  if (err instanceof HTTPError) {
    errorBadgeParams.status = err.response.statusCode.toString()
  }

  if (err instanceof BadgenError) {
    errorBadgeParams.status = err.status
  }

  res.setHeader('Error-Message', err.message)
  return serveBadgeNext(req, res, {
    code: 200,
    params: errorBadgeParams,
  })
}

function getBadgeStyle (req: http.IncomingMessage): string | undefined {
  const host = req.headers['x-forwarded-host']?.toString() ?? req.headers.host ?? ''
  return host.startsWith('flat') ? 'flat' : undefined
}

function simpleDecode (str: string): string {
  return String(str).replace(/%2F/g, '/')
}

export class BadgenError {
  public status: string   // error badge param: status (required)
  public color: string    // error badge param: color
  public code: number     // status code for response
  public message: string

  constructor ({ status, color = 'grey', code = 500, message = '' }) {
    this.status = status
    this.color = color
    this.code = code
    this.message = message
  }
}
