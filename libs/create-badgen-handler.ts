import http from 'http'
import matchRoute from 'my-way'
import urlParse from 'url-parse'
import ua from 'universal-analytics'

import fetchIcon from './fetch-icon'
import serveBadge from './serve-badge'
import serveDoc from './serve-doc'
import sentry from './sentry'

import { BadgenParams } from './types'

export type PathArgs = NonNullable<ReturnType<typeof matchRoute>>

export interface BadgeMaker {
  (pathArgs: PathArgs) : Promise<BadgenParams | undefined>;
}

export interface BadgenServeConfig {
  title: string;
  help?: string;
  examples: { [url: string]: string };
  handlers: { [pattern: string]: BadgeMaker };
}

export class BadgenError {
  public status: string // error badge param: status (required)
  public color: string  // error badge param: color
  public code: number   // status code for response

  constructor ({ status, color = 'grey', code = 500 }) {
    this.status = status
    this.color = color
    this.code = code
  }
}

export interface BadgenHandler extends http.RequestListener {
  meta: BadgenServeConfig;
}

export function createBadgenHandler (conf: BadgenServeConfig): BadgenHandler {
  async function badgenHandler (req, res) {
    const url = req.url ?? '/'
    const { pathname, query } = urlParse(url, true)

    measurementLogRequest(url, req.headers.host)

    // Serve favicon
    if (pathname === '/favicon.ico') {
      return res.end()
    }

    // Match handler
    let matchedArgs: ReturnType<typeof matchRoute> = null
    const matchedScheme = Object.keys(conf.handlers).find(scheme => {
      return matchedArgs = matchRoute(scheme, decodeURI(pathname))
    })

    // Serve docs
    if (!matchedScheme) {
      if (matchRoute('/:name', url)) {
        return serveDoc(conf)(req, res)
      } else {
        return serve404(req, res)
      }
    }

    const defaultLabel = pathname.split('/')[1]
    const defaultParams = {
      subject: defaultLabel,
      status: 'unknown',
      color: 'grey'
    }

    // Serve badge
    try {
      const badgeParamsPromise = conf.handlers[matchedScheme](matchedArgs || {})

      let iconPromise: Promise<string | undefined> = Promise.resolve(undefined)
      if (typeof query.icon === 'string') {
        if (query.icon.startsWith('https://')) {
          iconPromise = fetchIcon(query.icon).catch(e => undefined)
        } else {
          iconPromise = Promise.resolve(query.icon)
        }
      }

      const [ icon, params = defaultParams ] = await Promise.all([
        iconPromise,
        badgeParamsPromise
      ])

      params.subject = simpleDecode(params.subject)
      params.status = simpleDecode(params.status)

      if (icon !== undefined) {
        query.icon = icon === '' ? params.subject : icon
      }

      if (query.style === undefined) {
        query.style = getBadgeStyle(req)
      }

      return serveBadge(req, res, { params, query: query as any })
    } catch (error) {
      measurementLogError('error', error.code || error.statusCode , req.url)

      if (error instanceof BadgenError) {
        console.error(`BGE${error.code} "${error.status}" ${req.url}`)
        return serveBadge(req, res, {
          code: error.code,
          sMaxAge: 5,
          params: {
            subject: defaultLabel,
            status: error.status,
            color: error.color
          }
        })
      }

      // Handle timeout for `got` requests
      if (error.code === 'ETIMEDOUT') {
        console.error(`APIE504 ${req.url}`)
        return serveBadge(req, res, {
          code: 504,
          sMaxAge: 5,
          params: {
            subject: defaultLabel,
            status: 'timeout',
            color: 'grey'
          }
        })
      }

      // Handle requests errors from `got`
      if (error.statusCode) {
        const errorInfo = `${error.url} ${error.statusMessage}`
        console.error(`APIE${error.statusCode} ${url} ${errorInfo}`)
        return serveBadge(req, res, {
          code: 502,
          sMaxAge: 5,
          params: {
            subject: defaultLabel,
            status: error.statusCode,
            color: 'grey'
          }
        })
      }

      sentry.configureScope((scope) => {
        scope.setTag('path', url)
        scope.setTag('service', defaultLabel)
      })
      sentry.captureException(error)

      // uncatched error
      console.error(`UCE ${url}`, error.message, error)
      return serveBadge(req, res, {
        code: 500,
        sMaxAge: 5,
        params: {
          subject: 'badgen',
          status: 'error',
          color: 'grey'
        }
      })
    }
  }

  badgenHandler.meta = conf
  return badgenHandler
}

async function measurementLogRequest (urlPath: string, host?: string) {
  const tid = 'UA-4646421-14'
  const cid = process.env.NOW_REGION || 'unknown-region'
  ua(tid, cid).pageview(urlPath, host).send()
}

async function measurementLogError (category: string, action: string, label: string, value?: number) {
  const tid = 'UA-4646421-14'
  const cid = process.env.NOW_REGION || 'unknown-region'
  ua(tid, cid).event(category, action, label, value).send()
}

function getBadgeStyle (req: http.IncomingMessage): string | undefined {
  const host = req.headers['x-forwarded-host']?.toString() ?? req.headers.host ?? ''
  return host.startsWith('flat') ? 'flat' : undefined
}

function simpleDecode (str: string): string {
  return String(str).replace(/%2F/g, '/')
}

function serve404 (req: http.IncomingMessage, res: http.ServerResponse) {
  const params = {
    subject: 'Badgen',
    status: '404',
    color: 'orange'
  }

  const { query } = urlParse(req.url || '/', true)

  if (query.style === undefined) {
    query.style = getBadgeStyle(req)
  }

  serveBadge(req, res, { code: 404, params, query })
}
