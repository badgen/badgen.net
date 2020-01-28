import cheerio from 'cheerio'
import got from '../libs/got'
import { millify, version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

// https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md
// https://github.com/npm/registry/blob/master/docs/download-counts.md
// https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md
// https://unpkg.com/

export default createBadgenHandler({
  title: 'npm',
  examples: {
    '/npm/v/express': 'version',
    '/npm/v/yarn': 'version',
    '/npm/v/yarn/berry': 'version (tag)',
    '/npm/v/yarn/legacy': 'version (tag)',
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
  },
  handlers: {
    '/npm/:topic/:scope<@.+>/:pkg/:tag?': handler,
    '/npm/:topic/:pkg/:tag?': handler
  }
})

async function handler ({ topic, scope, pkg, tag }: PathArgs) {
  const npmName = scope ? `${scope}/${pkg}` : pkg

  switch (topic) {
    case 'v':
      return info('version', npmName, tag)
    case 'license':
      return info('license', npmName, tag)
    case 'node':
      return info('node', npmName, tag)
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

async function npmMetadata (pkg: string, ver = 'latest'): Promise<any> {
  // only works for ver === 'latest', none-scoped package
  const endpoint = `https://registry.npmjs.org/${pkg}/${ver}`
  return got(endpoint).json<any>()
}

async function pkgJson (pkg: string, tag = 'latest'): Promise<any> {
  // const endpoint = `https://cdn.jsdelivr.net/npm/${pkg}@${tag}/package.json`
  const endpoint = `https://unpkg.com/${pkg}@${tag}/package.json`
  return got(endpoint).json<any>()
}

async function info (topic: string, pkg: string, tag = 'latest') {
  const meta = await (tag === 'latest' && pkg[0] !== '@' ? npmMetadata(pkg) : pkgJson(pkg, tag))

  switch (topic) {
    case 'version': {
      return {
        subject: tag === 'latest' ? 'npm' : `npm@${tag}`,
        status: version(meta.version),
        color: versionColor(meta.version)
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

const download = async (period: string, npmName: string, tag = 'latest') => {
  const endpoint = ['https://api.npmjs.org/downloads']
  const isTotal = period === 'total'

  if (isTotal) {
    endpoint.push(`range/2005-01-01:${new Date().getFullYear() + 1}-01-01`)
  } else {
    endpoint.push(`point/${period}`)
  }

  endpoint.push(npmName)
  // endpoint.push(tag)

  const { downloads } = await got(endpoint.join('/')).json<any>()

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
async function dependents (name: string) {
  const html = await got(`https://www.npmjs.com/package/${name}`,).text()

  return {
    subject: 'dependents',
    status: parseDependents(html),
    color: 'green'
  }
}

const parseDependents = (html: string) => {
  const $ = cheerio.load(html)
  const depLink = $('a[href="?activeTab=dependents"]')
  if (depLink.length !== 1) return -1
  return depLink.text().replace(/[^0-9]/g, '')
}

async function typesDefinition(pkg: string, tag = 'latest') {
    let meta = await pkgJson(pkg, tag)

    if (typeof meta.types === 'string' || typeof meta.typings === "string") {
        return {
            subject: 'types',
            status: 'included',
            color: '0074c1'
        }
    }

    const typesPkg = '@types/' + (pkg.charAt(0) === "@" ? pkg.slice(1).replace('/', '__') : pkg)
    meta = await pkgJson(typesPkg).catch(err => false)

    if (meta && meta.name === typesPkg) {
      return {
        subject: 'types',
        status: meta.name,
        color: 'cyan',
      }
    }

    return {
      subject: 'types',
      status: 'missing',
      color: 'orange',
    }
}
