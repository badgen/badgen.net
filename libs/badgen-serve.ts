import url from 'url'
import PathParser from 'path-parser'

import serve404 from './serve-404'
import serveBadge from './serve-badge'

import { BadgenParams } from './types'

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
      matchedArgs = new PathParser(scheme).test(pathname)
      return matchedArgs !== null
    })

    if (matchedScheme) {
      const params = await handlers[matchedScheme](matchedArgs)
      return serveBadge(req, res, { params, query })
    } else {
      return serve404(req, res)
    }
  }
}
