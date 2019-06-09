import got from '../libs/got'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'David DM',
  examples: {
    '/david/dep/zeit/pkg': 'dependencies',
    '/david/dev/zeit/pkg': 'dev dependencies',
    '/david/peer/epoberezkin/ajv-keywords': 'peer dependencies',
    '/david/optional/epoberezkin/ajv-keywords': 'optional dependencies',
    '/david/dep/babel/babel/packages/babel-cli': 'dependencies (sub path)',
  }
}

export const handlers: Handlers = {
  '/david/:topic/:user/:repo/:path*': handler
}

const statusInfo = {
  insecure: ['insecure', 'red'],
  outofdate: ['out of date', 'orange'],
  notsouptodate: ['up to date', 'yellow'],
  uptodate: ['up to date', 'green'],
  none: ['none', 'green']
}

async function handler ({ topic, user, repo, path }: Args) {
  const prefix = {
    dep: '',
    dev: 'dev-',
    peer: 'peer-',
    optional: 'optional-'
  }[topic]

  const endpoint = `https://david-dm.org/${user}/${repo}/${prefix}info.json`
  const { status } = await got(endpoint, {
    query: {
      path: path ? path : ''
    }
  }).then(res => res.body)

  switch (topic) {
    case 'dep':
      return {
        subject: 'dependencies',
        status: statusInfo[status][0],
        color: statusInfo[status][1]
      }
    case 'dev':
      return {
        subject: 'devDependencies',
        status: statusInfo[status][0],
        color: statusInfo[status][1]
      }
    case 'peer':
      return {
        subject: 'peerDependencies',
        status: statusInfo[status][0],
        color: statusInfo[status][1]
      }
    case 'optional':
      return {
        subject: 'optionalDependencies',
        status: statusInfo[status][0],
        color: statusInfo[status][1]
      }
  }
}

export default badgenServe(handlers)
