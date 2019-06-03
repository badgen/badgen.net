import url from 'url'

import serve404 from './serve-404'
import serveBadge from './serve-badge'
import matchRoute from './match-route'
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
  return async function httpHandler (req, res) {
    const { pathname = '/', query } = url.parse(req.url, true)

    // serve favicon
    if (pathname === '/favicon.ico') {
      return res.end()
    }

    // Lookup handler
    let matchedArgs
    const matchedScheme = Object.keys(handlers).find(scheme => {
      matchedArgs = matchRoute(scheme, decodeURI(pathname))
      return matchedArgs !== null
    })

    const defaultLabel = pathname.split('/')[1]

    if (matchedScheme) {
      try {
        const params = await handlers[matchedScheme](matchedArgs) || {
          subject: defaultLabel,
          status: 'unknown',
          color: 'grey'
        }

        // if (req.hostname === 'api.badgen.net') {
        //   return serveApi(req, res, { params })
        // }

        if (req.headers.host.startsWith('flat.') && query.style !== undefined) {
          query.style = 'flat'
        }

        return serveBadge(req, res, { params, query })
      } catch (error) {
        // Handle requests errors from `got`
        if (error.statusCode) {
          const errorInfo = `${error.url} ${error.statusMessage}`
          console.error(`GOT:E${error.statusCode} ${req.url} ${errorInfo}`)
          // todo: send to google

          return serveBadge(req, res, {
            code: error.statusCode,
            sMaxAge: 5,
            params: {
              subject: defaultLabel,
              status: error.statusCode,
              color: 'grey'
            }
          })
        }

        // timeout for `got` requests
        if (error.code === 'ETIMEDOUT') {
          console.error(`E504 ${req.url}`)
          // todo: send to google

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

        sentry.configureScope((scope) => {
          scope.setTag('path', req.url)
          scope.setTag('service', defaultLabel)
        })
        sentry.captureException(error)

        console.error(`E500 ${req.url}`, error.message)
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
