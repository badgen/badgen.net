import url from 'url'
import PathParser from 'path-parser'

import serve404 from './serve-404.js'
import serveHelp from './serve-help.js'
import serveBadge from './serve-badge.js'

type BadgenParams = {
  subject: string
  status: string
  color: string
}

type BadgenServeOptions = {
  help?: string
  examples?: string[]
}

export type BadgenServeHandlerArgs = { [key: string]: string }
export type BadgenServeHandler = (args: BadgenServeHandlerArgs) => Promise<BadgenParams>
export type BadgenServeHandlers = { [key: string]: BadgenServeHandler }

export function badgenServe (
  handlers: BadgenServeHandlers,
  options: BadgenServeOptions
): Function {
  const { help = '', examples = [] } = options
  return async function httpHandler (req, res) {
    const { pathname = '/', query } = url.parse(req.url, true)

    // serve favicon
    if (pathname === '/favicon.ico') {
      return res.end()
    }

    // serve help message
    if (pathname.startsWith('/help')) {
      return serveHelp(req, res, help, examples)
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
