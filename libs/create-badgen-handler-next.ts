import http from 'http'
// import { measure } from 'measurement-protocol'
import matchRoute from 'my-way'

import { serveBadgeNext } from './serve-badge-next'
import serveDoc from './serve-doc-next'
import fetchIcon from './fetch-icon'
import sentry from './sentry'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { BadgenParams } from './types'
import { HTTPError } from 'got'

export type PathArgs = NonNullable<ReturnType<typeof matchRoute>>
export type BadgenResponse = BadgenParams | string
export type BadgenHandler = (pathArgs: PathArgs, req: NextApiRequest, res: NextApiResponse) => Promise<BadgenResponse>

export interface BadgenServeConfig {
    title: string;
    help?: string;
    examples: { [url: string]: string };
    handlers: { [pattern: string]: BadgenHandler };
}

export function createBadgenHandler (badgenServerConfig: BadgenServeConfig) {
  const { handlers, title, help, examples } = badgenServerConfig

  async function nextHandler (req: NextApiRequest, res: NextApiResponse) {
    let { pathname } = new URL(req.url || '/', `http://${req.headers.host}`)

    if (pathname === '/favicon.ico') {
      return res.end()
    }

    if (matchRoute('/:name', pathname)) {
      return serveDoc(badgenServerConfig)(req, res)
    }

    // Fetch external icon early, before invoking badgen handler
    let externalIconPromise: Promise<string | undefined> = Promise.resolve(undefined)
    if (req.query.icon?.toString().startsWith('https://')) {
      externalIconPromise = fetchIcon(req.query.icon.toString())
    }

    // Find matched badgen handler
    let matchedArgs: PathArgs | null = null
    const matchedScheme = Object.keys(handlers).find(scheme => {
      return matchedArgs = matchRoute(scheme, decodeURI(pathname))
    })

    if (matchedArgs === null || matchedScheme === undefined) {
      res.status(404).end()
      return
    }

    // Invoke matched badgen handler
    const badgenHandler = handlers[matchedScheme]
    const badgenResponse = await badgenHandler(matchedArgs, req, res)
      .catch(error => parseBadgenHandlerError(error, req, res))

    if (typeof badgenResponse === 'string') {
      res.end(badgenResponse)
      return
    }

    // Apply external icon if available
    const externalIcon = await externalIconPromise
    if (externalIcon) {
      req.query.icon = externalIcon
    } else if (req.query.icon === '') {
      req.query.icon = badgenResponse.subject
    }

    serveBadgeNext(req, res, { params: badgenResponse })
  }

  nextHandler.meta = { title, examples, help, handlers }

  return nextHandler
}

function parseBadgenHandlerError (error: Error | HTTPError, req: NextApiRequest, res: NextApiResponse): BadgenResponse {
  sentry.captureException(error)

  console.error('BADGE_HANDLER_ERROR', req.url, error.stack || error.message)

  const badgeName = req.url?.split('/')[1]

  // Send user friendly badge response
  const errorBadgeParams = {
    subject: badgeName || 'error',
    status: '500',
    color: 'red',
  }

  if (error instanceof HTTPError) {
    errorBadgeParams.status = error.response.statusCode.toString()
  }

  if (error instanceof BadgenError) {
    errorBadgeParams.status = error.status
  }

  res.setHeader('Error-Message', error.message)

  return errorBadgeParams
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
