import millify from 'millify'
import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Atom Package',
  examples: {
    '/apm/v/linter': 'version',
    '/apm/stars/linter': 'stars',
    '/apm/license/linter': 'license',
    '/apm/downloads/linter': 'downloads'
  },
  handlers: {
    '/apm/:topic/:pkg': handler
  }
})

async function handler ({ topic, pkg }: PathArgs) {
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
