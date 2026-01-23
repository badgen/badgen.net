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
        return {
          subject: 'minified size',
          status: typeof bundleSize === 'number' ? size(bundleSize) : bundleSize,
          color: 'blue'
        }
      case 'minzip':
        return {
          subject: 'minzipped size',
          status: typeof gzipSize === 'number' ? size(gzipSize) : gzipSize,
          color: 'blue'
        }
      case 'brotli':
        return {
          subject: 'brotli size',
          status: typeof brotliSize === 'number' ? size(brotliSize) : brotliSize,
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
