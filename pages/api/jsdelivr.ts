import millify from 'millify'
import got from '../../libs/got'
import { versionColor } from '../../libs/utils'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'
import type { BadgenParams } from '../../libs/types'

export default createBadgenHandler({
  title: 'jsDelivr',
  examples: {
    '/jsdelivr/hits/gh/jquery/jquery': 'hits (per month)',
    '/jsdelivr/hits/npm/lodash': 'hits (per month)',
    '/jsdelivr/rank/npm/lodash': 'rank',
    '/jsdelivr/v/npm/lodash': 'version',
  },
  handlers: {
    '/jsdelivr/:topic<hits|rank>/:platform/:pkg+': handler,
    '/jsdelivr/:topic<v>/npm/:pkg+': handler
  }
})

async function handler ({ topic, platform, pkg }: PathArgs): Promise<BadgenParams> {
  switch (topic) {
    case 'hits':
      return stats('hits', platform, pkg)
    case 'rank':
      return stats('rank', platform, pkg)
    case 'v':
      return version(pkg)
    default:
      return {
        subject: 'jsDelivr',
        status: 'unknown topic',
        color: 'gray'
      }
  }
}

const stats = async (metric, type, name): Promise<BadgenParams> => {
  const endpoint = `https://data.jsdelivr.com/v1/package/${type}/${name}/stats`
  const { total, rank } = await got(endpoint).json<any>()

  switch (metric) {
    case 'hits':
      return {
        subject: 'jsDelivr',
        status: `${millify(total)}/month`,
        color: 'green'
      }
    case 'rank':
      return {
        subject: 'jsDelivr rank',
        status: rank ? `#${rank}` : 'none',
        color: rank ? 'blue' : 'grey'
      }
    default:
      return {
        subject: 'jsDelivr',
        status: 'unknown metric',
        color: 'gray'
      }
  }
}

const version = async (name) => {
  const endpoint = `https://cdn.jsdelivr.net/npm/${name}/package.json`
  const { version } = await got(endpoint).json<any>()
  return {
    subject: 'jsDelivr',
    status: `v${version}`,
    color: versionColor(version)
  }
}
