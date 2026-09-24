import { requestJson } from '../../libs/http'
import { millify, stars, version, versionColor } from '../../libs/utils'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

// https://github.com/dlang/dub-registry/blob/v2.4.0/source/dubregistry/api.d#L77-L99
const DUB_REGISTRY_API = 'https://code.dlang.org/api/packages/'

const requestOptions = { baseUrl: DUB_REGISTRY_API }

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
      const ver = await requestJson<any>(`${pkg}/latest`, requestOptions)
      return {
        subject: 'dub',
        status: version(ver),
        color: versionColor(ver)
      }
    }
    case 'license': {
      const { info } = await requestJson<any>(`${pkg}/latest/info`, requestOptions)
      return {
        subject: 'license',
        status: info.license || 'unknown',
        color: 'blue'
      }
    }
    case 'dt': {
      const { downloads } = await requestJson<any>(`${pkg}/stats`, requestOptions)
      return {
        subject: 'downloads',
        status: millify(downloads.total),
        color: 'green'
      }
    }
    case 'dd': {
      const { downloads } = await requestJson<any>(`${pkg}/stats`, requestOptions)
      return {
        subject: 'downloads',
        status: `${millify(downloads.daily)}/day`,
        color: 'green'
      }
    }
    case 'dw': {
      const { downloads } = await requestJson<any>(`${pkg}/stats`, requestOptions)
      return {
        subject: 'downloads',
        status: `${millify(downloads.weekly)}/week`,
        color: 'green'
      }
    }
    case 'dm': {
      const { downloads } = await requestJson<any>(`${pkg}/stats`, requestOptions)
      return {
        subject: 'downloads',
        status: `${millify(downloads.monthly)}/month`,
        color: 'green'
      }
    }
    case 'rating': {
      const { score } = await requestJson<any>(`${pkg}/stats`, requestOptions)
      return {
        subject: 'rating',
        status: `${score.toFixed(2)}/5`,
        color: 'green'
      }
    }
    case 'stars': {
      const { score } = await requestJson<any>(`${pkg}/stats`, requestOptions)
      return {
        subject: 'stars',
        status: stars(score),
        color: 'green'
      }
    }
  }

  return {
    subject: 'dub',
    status: 'unknown',
    color: 'grey'
  }
}
