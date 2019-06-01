import url from 'url'

import serve404 from './serve-404'
import serveBadge from './serve-badge'
import matchRoute from './match-route'
// import serveApi from './serve-api'

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

        if (req.hostname === 'flat.badgen.net' && query.style !== undefined) {
          query.style = 'flat'
        }

        return serveBadge(req, res, { params, query })
      } catch (error) {
        // 404 for `got` requests
        if (error.statusCode === 404) {
          return serveBadge(req, res, {
            code: 404,
            params: {
              subject: defaultLabel,
              status: '404',
              color: 'grey'
            }
          })
        }

        // timeout for `got` requests
        if (error.code === 'ETIMEDOUT') {
          console.error(`E504 ${req.url}`)
          return serveBadge(req, res, {
            code: 504,
            params: {
              subject: defaultLabel,
              status: 'timeout',
              color: 'grey'
            }
          })
        }

        console.error(`E500 ${req.url}`, error.message)
        return serveBadge(req, res, {
          code: 500,
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
