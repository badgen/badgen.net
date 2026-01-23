import got from '../../libs/got'
import { size } from '../../libs/utils'

import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

export default createBadgenHandler({
  title: 'BundleJS',
  examples: {
    '/bundlejs/min/react': 'minified',
    '/bundlejs/minzip/react': 'minified + gzip',
    '/bundlejs/minzip/@noble/hashes': '(scoped pkg) minified + gzip',
    '/bundlejs/brotli/react': 'minified + brotli',
  },
  handlers: {
    '/bundlejs/:topic/:scope<@.*>/:name': handler,
    '/bundlejs/:topic/:name': handler,
  }
})

async function handler ({ topic, scope, name }: PathArgs) {
  const pkg = scope ? `${scope}/${name}` : name
  const endpoint = `https://deno.bundlejs.com/?q=${encodeURIComponent(pkg)}`
  
  try {
    const resp = await got(endpoint).json<any>()

    if (!resp) {
      return {
        subject: 'bundlejs',
        status: 'unknown',
        color: 'grey'
      }
    }

    // Extract size information from response
    const bundleSize = resp.size
    const gzipSize = resp.gzip
    const brotliSize = resp.brotli

    switch (topic) {
      case 'min':
        if (typeof bundleSize !== 'number' || !bundleSize) {
          return { subject: 'minified size', status: 'unknown', color: 'grey' }
        }
        return {
          subject: 'minified size',
          status: size(bundleSize),
          color: 'blue'
        }
      case 'minzip':
        if (typeof gzipSize !== 'number' || !gzipSize) {
          return { subject: 'minzipped size', status: 'unknown', color: 'grey' }
        }
        return {
          subject: 'minzipped size',
          status: size(gzipSize),
          color: 'blue'
        }
      case 'brotli':
        if (typeof brotliSize !== 'number' || !brotliSize) {
          return { subject: 'brotli size', status: 'unknown', color: 'grey' }
        }
        return {
          subject: 'brotli size',
          status: size(brotliSize),
          color: 'blue'
        }
      default:
        return {
          subject: 'bundlejs',
          status: 'unknown topic',
          color: 'grey'
        }
    }
  } catch (error) {
    return {
      subject: 'bundlejs',
      status: 'error',
      color: 'red'
    }
  }
}
