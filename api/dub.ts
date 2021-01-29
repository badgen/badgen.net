import got from '../libs/got'
import { millify, stars, version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

// https://github.com/dlang/dub-registry/blob/v2.4.0/source/dubregistry/api.d#L77-L99
const DUB_REGISTRY_API = 'https://code.dlang.org/api/packages/'

const client = got.extend({ prefixUrl: DUB_REGISTRY_API })

export default createBadgenHandler({
  title: 'DUB',
  examples: {
    '/dub/v/dub': 'version',
    '/dub/license/arsd-official': 'license',
    '/dub/dt/vibe-d': 'total downloads',
    '/dub/dd/vibe-d': 'daily downloads',
    '/dub/dw/vibe-d': 'weekly downloads',
    '/dub/dm/vibe-d': 'monthly downloads',
    '/dub/rating/pegged': 'rating',
    '/dub/stars/silly': 'stars'
  },
  handlers: {
    '/dub/:topic<v|version|license|dd|dw|dm|dt|rating|stars>/:pkg': handler
  }
})

async function handler ({ topic, pkg }: PathArgs) {
  switch (topic) {
    case 'v':
    case 'version': {
      const ver = await client.get(`${pkg}/latest`).json<any>()
      return {
        subject: 'dub',
        status: version(ver),
        color: versionColor(ver)
      }
    }
    case 'license': {
      const { info } = await client.get(`${pkg}/latest/info`).json<any>()
      return {
        subject: 'license',
        status: info.license || 'unknown',
        color: 'blue'
      }
    }
    case 'dt': {
      const { downloads } = await client.get(`${pkg}/stats`).json<any>()
      return {
        subject: 'downloads',
        status: millify(downloads.total),
        color: 'green'
      }
    }
    case 'dd': {
      const { downloads } = await client.get(`${pkg}/stats`).json<any>()
      return {
        subject: 'downloads',
        status: `${millify(downloads.daily)}/day`,
        color: 'green'
      }
    }
    case 'dw': {
      const { downloads } = await client.get(`${pkg}/stats`).json<any>()
      return {
        subject: 'downloads',
        status: `${millify(downloads.weekly)}/week`,
        color: 'green'
      }
    }
    case 'dm': {
      const { downloads } = await client.get(`${pkg}/stats`).json<any>()
      return {
        subject: 'downloads',
        status: `${millify(downloads.monthly)}/month`,
        color: 'green'
      }
    }
    case 'rating': {
      const { score } = await client.get(`${pkg}/stats`).json<any>()
      return {
        subject: 'rating',
        status: `${score.toFixed(2)}/5`,
        color: 'green'
      }
    }
    case 'stars': {
      const { score } = await client.get(`${pkg}/stats`).json<any>()
      return {
        subject: 'stars',
        status: stars(score),
        color: 'green'
      }
    }
  }
}
