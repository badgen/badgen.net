import millify from 'millify'
import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Atom Package',
  examples: {
    '/apm/v/linter': 'version',
    '/apm/stars/linter': 'stars',
    '/apm/license/linter': 'license',
    '/apm/downloads/linter': 'downloads'
  }
}

export const handlers: Handlers = {
  '/apm/:topic/:pkg': handler
}

async function handler ({ topic, pkg }: Args) {
  const endpoint = `https://atom.io/api/packages/${pkg}`
  const data = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'v':
    case 'version': {
      return {
        subject: `apm`,
        status: version(data.releases.latest),
        color: versionColor(data.releases.latest)
      }
    }
    case 'dl':
    case 'downloads': {
      return {
        subject: 'downloads',
        status: millify(data.downloads),
        color: 'green'
      }
    }
    case 'license': {
      return {
        subject: 'license',
        status: data.versions[data.releases.latest].license || 'unknown',
        color: 'blue'
      }
    }
    case 'stars': {
      return {
        subject: 'stars',
        status: millify(data.stargazers_count),
        color: 'green'
      }
    }
    default: {
      return {
        subject: 'apm',
        status: 'unknown topic',
        color: 'grey'
      }
    }
  }
}

export default badgenServe(handlers)
