import byteSize from 'byte-size'
import got from '../libs/got'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Bundlephobia',
  examples: {
    '/bundlephobia/min/react': 'minified',
    '/bundlephobia/minzip/react': 'minified + gzip',
    '/bundlephobia/minzip/@material-ui/core': '(scoped pkg) minified + gzip',
  }
}

export const handlers: Handlers = {
  '/bundlephobia/:topic/:scope<@.*>/:name': handler,
  '/bundlephobia/:topic/:name': handler,
}

export default badgenServe(handlers)

// https://github.com/pastelsky/bundlephobia/issues/4

async function handler ({ topic, scope, name }: Args) {
  const pkg = scope ? `${scope}/${name}` : name
  const endpoint = `https://bundlephobia.com/api/size?package=${pkg}`
  const { size, gzip } = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'min':
      return {
        subject: 'minified size',
        status: byteSize(size, { units: 'iec' }).toString().replace(/iB\b/, 'B'),
        color: 'blue'
      }
    case 'minzip':
      return {
        subject: 'minzipped size',
        status: byteSize(gzip, { units: 'iec' }).toString().replace(/iB\b/, 'B'),
        color: 'blue'
      }
    default:
      return {
        subject: 'bundlephobia',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}
