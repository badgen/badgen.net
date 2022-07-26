import got from '../libs/got'
import { millify, version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs, BadgenError } from '../libs/create-badgen-handler'

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
  const host = process.env.NPM_REGISTRY || 'https://registry.npmjs.org'
  if (pkg.startsWith('@') || ver !== 'latest') {
    const meta = await got(`${host}/${pkg}`, {
      // support querying abbreviated metadata https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md
      headers: {
        accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'
      }
    }).json<any>()
    if (meta["dist-tags"][ver]) {
      return meta.versions[meta["dist-tags"][ver]]
    }
    throw new BadgenError({ status: '404', color: 'grey', code: 404 })
  }
  const endpoint = `${host}/${pkg}/${ver}`
  return got(endpoint).json<any>()

}

async function pkgJson (pkg: string, tag = 'latest'): Promise<any> {
  // const endpoint = `https://cdn.jsdelivr.net/npm/${pkg}@${tag}/package.json`
  const endpoint = `https://unpkg.com/${pkg}@${tag}/package.json`
  return got(endpoint).json<any>()
}

async function info (topic: string, pkg: string, tag = 'latest') {
  // private package use npmMetadata (npm), all others use unpkg
  // optionally disable unpkg to request all info from NPM
  const meta = await(
    process.env.NPM_REGISTRY
      ? npmMetadata(pkg, tag)
      : pkgJson(pkg, tag)
  )

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

async function dependents (name: string) {
  const html = await got(`https://www.npmjs.com/package/${name}`,).text()
  const count = Number(html.match(/"dependentsCount"\s*:\s*(\d+)/)?.[1])

  if (Number.isNaN(count)) {
    return {
      subject: 'dependents',
      status: 'invalid',
      color: 'grey'
    }
  }
  return {
    subject: 'dependents',
    status: millify(count),
    color: 'green'
  }
}

async function typesDefinition(pkg: string, tag = 'latest') {
  let meta = await pkgJson(pkg, tag)

  const hasExportTypes = (meta: any) => {
    if (typeof meta.types === 'string' || typeof meta.typings === 'string') {
      return true
    }
    const hasNestedTypes = (exports: any) =>
      typeof exports === 'object' &&
      (typeof exports.types === 'string' ||
      Object.values(exports)
        .some(hasNestedTypes))

    if (hasNestedTypes(meta.exports)) {
      return true
    }

    return false
  }

  if (hasExportTypes(meta)) {
    return {
      subject: 'types',
      status: 'included',
      color: '0074c1',
    }
  }

  const hasIndexDTSFile = await got
    .head(`https://unpkg.com/${pkg}/index.d.ts`)
    .then((res) => res.statusCode === 200)
    .catch((e) => false)

  if (hasIndexDTSFile) {
    return {
      subject: 'types',
      status: 'included',
      color: '0074c1'
    }
  }

  const typesPkg = '@types/' + (pkg.charAt(0) === "@" ? pkg.slice(1).replace('/', '__') : pkg)
  meta = await pkgJson(typesPkg).catch(e => false)

  if (meta?.name === typesPkg) {
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
