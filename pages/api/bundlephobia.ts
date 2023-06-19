import got from '../../libs/got'
import { size } from '../../libs/utils'

import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

export default createBadgenHandler({
  title: 'Bundlephobia',
  examples: {
    '/bundlephobia/min/react': 'minified',
    '/bundlephobia/minzip/react': 'minified + gzip',
    '/bundlephobia/minzip/@material-ui/core': '(scoped pkg) minified + gzip',
    '/bundlephobia/dependency-count/react': 'dependency count',
    '/bundlephobia/tree-shaking/react-colorful': 'tree-shaking support',
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
  const resp = await got(endpoint).json<any>()

  if (!resp) {
    return {
      subject: 'bundlephobia',
      status: 'unknown',
      color: 'grey'
    }
  }

  const {
    size: bundleSize,
    gzip: gzipBundleSize,
    dependencyCount,
    hasJSModule,
    hasJSNext
  } = resp

  // Tree-shaking detection condition is copied from bundlephobia.com website. See:
  // https://github.com/pastelsky/bundlephobia/blob/bundlephobia/pages/result/ResultPage.js
  const isTreeShakeable = hasJSModule || hasJSNext

  switch (topic) {
    case 'min':
      return {
        subject: 'minified size',
        status: size(bundleSize),
        color: 'blue'
      }
    case 'minzip':
      return {
        subject: 'minzipped size',
        status: size(gzipBundleSize),
        color: 'blue'
      }
    case 'dependency-count':
      return {
        subject: 'dependency count',
        status: dependencyCount,
        color: 'blue'
      }
    case 'tree-shaking':
      return {
        subject: 'tree shaking',
        status: isTreeShakeable ? 'supported' : 'not supported',
        color: isTreeShakeable ? 'green' : 'red'
      }
    default:
      return {
        subject: 'bundlephobia',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}
