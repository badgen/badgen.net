import byteSize from 'byte-size'
import ky from '../libs/ky'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Bundlephobia',
  examples: {
    '/bundlephobia/min/react': 'minified',
    '/bundlephobia/minzip/react': 'minified + gzip',
    '/bundlephobia/minzip/@material-ui/core': '(scoped pkg) minified + gzip',
  },
  handlers: {
    '/bundlephobia/:topic/:scope<@.*>/:name': handler,
    '/bundlephobia/:topic/:name': handler,
  }
})

// https://github.com/pastelsky/bundlephobia/issues/4

async function handler ({ topic, scope, name }: PathArgs) {
  const pkg = scope ? `${scope}/${name}` : name
  const endpoint = `https://bundlephobia.com/api/size?package=${pkg}`
  const resp = await ky(endpoint).then(res => res.json())

  if (!resp) {
    return {
      subject: 'bundlephobia',
      status: 'unknown',
      color: 'grey'
    }
  }

  const { size, gzip } = resp

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
