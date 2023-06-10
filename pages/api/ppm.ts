import millify from 'millify'
import got from '../../libs/got'
import { version, versionColor } from '../../libs/utils'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

export default createBadgenHandler({
  title: 'Pulsar Package',
  examples: {
    '/ppm/v/linter': 'version',
    '/ppm/stars/linter': 'stars',
    '/ppm/license/linter': 'license',
    '/ppm/downloads/linter': 'downloads',
    '/ppm/engine/linter': 'engine',
  },
  handlers: {
    '/ppm/:topic/:pkg': handler
  }
})

async function handler ({ topic, pkg }: PathArgs) {
  const endpoint = `https://api.pulsar-edit.dev/api/packages/${pkg}`
  const data = await got(endpoint).json<any>()

  switch (topic) {
    case 'v': {
      return {
        subject: `ppm`,
        status: version(data.releases.latest),
        color: versionColor(data.releases.latest)
      }
    }
    case 'downloads': {
      return {
        subject: 'downloads',
        status: millify(data.downloads),
        color: 'green'
      }
    }
    case 'engine': {
      return {
        subject: 'pulsar',
        status: data.metadata.engines.pulsar || data.metadata.engines.atom || 'unknown',
        color: 'blue'
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
        subject: 'ppm',
        status: 'unknown topic',
        color: 'grey'
      }
    }
  }
}
