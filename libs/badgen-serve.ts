import url from 'url'

import serve404 from './serve-404'
import serveBadge from './serve-badge'
import matchRoute from './match-route'

import { BadgenParams } from './types'

export type BadgenServeMeta = {
  title: string
  examples: { [url: string]: string }
  help?: string
}

export type BadgenServeHandlerArgs = { [key: string]: string }
export type BadgenServeHandler = (args: BadgenServeHandlerArgs) => Promise<BadgenParams>
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

    if (matchedScheme) {
      try {
        const params = await handlers[matchedScheme](matchedArgs)
        return serveBadge(req, res, { params, query })
      } catch (error) {
        console.error(error)
        return serveBadge(req, res, {
          code: 500,
          params: {
            subject: 'badgen',
            status: 'error',
            color: 'red'
          }
        })
      }
    } else {
      return serve404(req, res)
    }
  }
}
