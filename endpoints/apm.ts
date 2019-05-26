import millify from 'millify'
import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import {
  badgenServe,
  BadgenServeMeta,
  BadgenServeHandlers
} from '../libs/badgen-serve'

// https://atom.io/api/packages/*

export const meta: BadgenServeMeta = {
  title: 'Atom Package',
  examples: {
    '/apm/v/linter': 'version',
    '/apm/stars/linter': 'stars',
    '/apm/license/linter': 'license',
    '/apm/dl/linter': 'downloads'
  }
}

export const handlers: BadgenServeHandlers = {
  '/apm/:topic/:pkg': handler
}

async function handler (args) {
  const { topic, pkg } = args
  const endpoint = `https://atom.io/api/packages/${pkg}`
  const meta = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'version': {
      return {
        subject: `apm`,
        status: version(meta.releases.latest),
        color: versionColor(meta.releases.latest)
      }
    }
    case 'license': {
      return {
        subject: 'license',
        status: meta.versions[meta.releases.latest].license || 'unknown',
        color: 'blue'
      }
    }
    case 'downloads': {
      return {
        subject: 'downloads',
        status: millify(meta.downloads),
        color: 'green'
      }
    }
    case 'stars': {
      return {
        subject: 'stars',
        status: millify(meta.stargazers_count),
        color: 'green'
      }
    }
    default: {
      return {
        subject: 'apm',
        status: 'unknown',
        color: 'grey'
      }
    }
  }
}

export default badgenServe(handlers)
