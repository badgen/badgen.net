import cheerio from 'cheerio'
import got from '../libs/got'
import { millify, version, versionColor } from '../libs/utils'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

// https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md
// https://github.com/npm/registry/blob/master/docs/download-counts.md
// https://unpkg.com/

export const meta: Meta = {
  title: 'npm',
  examples: {
    '/npm/v/express': 'version',
    '/npm/v/ava': 'version',
    '/npm/v/ava/next': 'version (tag)',
    '/npm/v/react/next': 'version (tag)',
    '/npm/v/@babel/core': 'version (scoped package)',
    '/npm/v/@nestjs/core/beta': 'version (scoped & tag)',
    '/npm/dw/express': 'weekly downloads',
    '/npm/dm/express': 'monthly downloads',
    '/npm/dy/express': 'yearly downloads',
    '/npm/dt/express': 'total downloads',
    '/npm/license/lodash': 'license',
    '/npm/node/next': 'node version',
    '/npm/dependents/got': 'dependents',
    '/npm/types/tslib': 'types',
    '/npm/types/react': 'types',
    '/npm/types/queri': 'types',
  }
}

export const handlers: Handlers = {
  '/npm/:topic/:scope<@.+>/:pkg/:tag?': handler,
  '/npm/:topic/:pkg/:tag?': handler
}

export default badgenServe(handlers)

async function handler ({ topic, scope, pkg, tag }: Args) {
  const npmName = scope ? `${scope}/${pkg}` : pkg

  switch (topic) {
    case 'v':
      return unpkg('version', npmName, tag)
    case 'license':
      return unpkg('license', npmName, tag)
    case 'node':
      return unpkg('node', npmName, tag)
    case 'dt':
      return download('total', npmName)
    case 'dd':
      return download('last-day', npmName) // might deprecate this
    case 'dw':
      return download('last-week', npmName)
    case 'dm':
      return download('last-month', npmName)
    case 'dy':
      return download('last-year', npmName)
    case 'dependents':
      return dependents(npmName)
    case 'types':
      return typesDefinition(npmName, tag)
    default:
      return {
        subject: 'npm',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}

async function unpkg (topic, pkg, tag = 'latest') {
  // const endpoint = `https://unpkg.com/${pkg}@${tag}/package.json`
  const endpoint = `https://cdn.jsdelivr.net/npm/${pkg}@${tag}/package.json`
  const meta = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'version': {
      return {
        subject: `npm${tag === 'latest' ? '' : '@' + tag}`,
        status: version(meta.version),
        color: tag === 'latest' ? versionColor(meta.version) : 'cyan'
      }
    }
    case 'license': {
      return {
        subject: 'license',
        status: meta.license || 'unknown',
        color: 'blue'
      }
    }
    case 'node': {
      return {
        subject: 'node',
        status: (meta.engines && meta.engines.node) || '*',
        color: 'green'
      }
    }
    default: {
      return {
        subject: 'npm',
        status: 'unknown',
        color: 'grey'
      }
    }
  }
}

const download = async (period, npmName, tag = 'latest') => {
  const endpoint = ['https://api.npmjs.org/downloads']
  const isTotal = period === 'total'

  if (isTotal) {
    endpoint.push(`range/2005-01-01:${new Date().getFullYear() + 1}-01-01`)
  } else {
    endpoint.push(`point/${period}`)
  }

  endpoint.push(npmName)
  // endpoint.push(tag)

  const { downloads } = await got(endpoint.join('/')).then(
    res => res.body,
    err => err.response && err.response.statusCode === 404 && { downloads: 0 }
  )

  const count = typeof downloads === 'number'
    ? downloads
    : downloads.reduce((accu, { downloads }) => {
      return accu + downloads
    }, 0)

  const per = isTotal ? '' : period.replace('last-', '/')

  return {
    subject: 'downloads',
    status: millify(count) + per,
    color: 'green'
  }
}

// https://github.com/astur/check-npm-dependents/blob/master/index.js
async function dependents (name) {
  const html = await got(`https://www.npmjs.com/package/${name}`, {
    // @ts-ignore
    json: false
  }).then(res => res.body)

  return {
    subject: 'dependents',
    status: parseDependents(html),
    color: 'green'
  }
}

const parseDependents = html => {
  const $ = cheerio.load(html)
  const depLink = $('a[href="?activeTab=dependents"]')
  if (depLink.length !== 1) return -1
  return depLink.text().replace(/[^0-9]/g, '')
}

async function typesDefinition(pkg: string, tag: string = 'latest') {
    const endpoint = `https://cdn.jsdelivr.net/npm/${ pkg }@${ tag }/package.json`
    let meta = await got(endpoint).then(res => res.body)

    if (typeof meta.types === 'string' || typeof meta.typings === "string") {
        return {
            subject: 'types',
            status: 'included',
            color: '0074c1'
        }
    }

    const typesPkg = '@types/' + (pkg.charAt(0) === "@" ? pkg.slice(1).replace('/', '__') : pkg)
    const typesEndpoint = `https://cdn.jsdelivr.net/npm/${ typesPkg }@latest/package.json`
    meta = await got(typesEndpoint).then(res => res.body).catch(err => false)

    return meta && meta.name === typesPkg ? {
        subject: 'types',
        status: meta.name,
        color: 'cyan',
    } : {
        subject: 'types',
        status: 'missing',
        color: 'orange',
    }
}
