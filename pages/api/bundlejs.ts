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
  
  // Determine compression type based on topic
  let compressionType = 'gzip' // default
  if (topic === 'brotli') {
    compressionType = 'brotli'
  }
  
  const config = JSON.stringify({ compression: compressionType })
  const endpoint = `https://deno.bundlejs.com/?q=${encodeURIComponent(pkg)}&config=${encodeURIComponent(config)}`
  
  try {
    const resp = await got(endpoint).json<any>()

    if (!resp || !resp.size) {
      return {
        subject: 'bundlejs',
        status: 'unknown',
        color: 'grey'
      }
    }

    // Extract size information from response
    // The API returns: { size: { rawUncompressedSize, rawCompressedSize, type, ... } }
    const sizeData = resp.size
    const uncompressedSize = sizeData.rawUncompressedSize
    const compressedSize = sizeData.rawCompressedSize

    switch (topic) {
      case 'min':
        if (typeof uncompressedSize !== 'number') {
          return { subject: 'minified size', status: 'unknown', color: 'grey' }
        }
        return {
          subject: 'minified size',
          status: size(uncompressedSize),
          color: 'blue'
        }
      case 'minzip':
        if (typeof compressedSize !== 'number') {
          return { subject: 'minzipped size', status: 'unknown', color: 'grey' }
        }
        return {
          subject: 'minzipped size',
          status: size(compressedSize),
          color: 'blue'
        }
      case 'brotli':
        if (typeof compressedSize !== 'number') {
          return { subject: 'brotli size', status: 'unknown', color: 'grey' }
        }
        return {
          subject: 'brotli size',
          status: size(compressedSize),
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
