import url from 'url'
import matchRoute from 'my-way'

import fetchIcon from './fetch-icon'
import serveBadge from './serve-badge'
import serveDocs from './serve-docs'
import serve404 from './serve-404'
import sentry from './sentry'

import { BadgenParams } from './types'

export type BadgenServeMeta = {
  title: string
  examples: { [url: string]: string }
  help?: string
}

export type BadgenServeHandlerArgs = { [key: string]: string }
export type BadgenServeHandlerResult = Promise<BadgenParams | undefined>
export type BadgenServeHandler = (args: BadgenServeHandlerArgs) => BadgenServeHandlerResult
export type BadgenServeHandlers = { [key: string]: BadgenServeHandler }

export function badgenServe (handlers: BadgenServeHandlers): Function {
  return async function Handler (req, res, name) {
    const { pathname = '/', query } = url.parse(req.url, true)

    // Serve favicon
    if (pathname === '/favicon.ico' || pathname === null) {
      return res.end()
    }

    // Serve docs
    if (matchRoute(`/${name}`, pathname)) {
      return serveDocs(req, res, name)
    }

    // Find handler
    let matchedArgs
    const matchedScheme = Object.keys(handlers).find(scheme => {
      matchedArgs = matchRoute(scheme, decodeURI(pathname))
      return matchedArgs !== null
    })

    const defaultLabel = pathname.split('/')[1]
    const defaultParams = {
      subject: defaultLabel,
      status: 'unknown',
      color: 'grey'
    }

    if (matchedScheme) {
      try {
        const paramsPromise = handlers[matchedScheme](matchedArgs)

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
          paramsPromise
        ])

        params.subject = simpleDecode(params.subject)
        params.status = simpleDecode(params.status)

        if (icon !== undefined) {
          query.icon = icon === '' ? params.subject : icon
        }

        if (query.style === undefined) {
          const host = req.headers['x-forwarded-host'] || req.headers.host
          if (host.startsWith('flat')) {
            query.style = 'flat'
          }
        }

        return serveBadge(req, res, { params, query: query as any })
      } catch (error) {
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
          console.error(`APIE${error.statusCode} ${req.url} ${errorInfo}`)
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
          scope.setTag('path', req.url)
          scope.setTag('service', defaultLabel)
        })
        sentry.captureException(error)

        // uncatched error
        console.error(`UCE ${req.url}`, error.message, error)
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
    } else {
      return serve404(req, res)
    }
  }
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

function simpleDecode (str: any): string {
  return String(str).replace(/%2F/g, '/')
}
