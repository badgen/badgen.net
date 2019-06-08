import millify from 'millify'
import got from '../libs/got'
import { versionColor } from '../libs/utils'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'jsDelivr',
  examples: {
    '/jsdelivr/hits/gh/jquery/jquery': 'hits (per month)',
    '/jsdelivr/hits/npm/lodash': 'hits (per month)',
    '/jsdelivr/rank/npm/lodash': 'rank',
    '/jsdelivr/v/npm/lodash': 'version',
  }
}

export const handlers: Handlers = {
  '/jsdelivr/:topic<hits|rank>/:platform/:pkg+': handler,
  '/jsdelivr/:topic<v>/npm/:pkg+': handler
}

export default badgenServe(handlers)

async function handler ({ topic, platform, pkg }: Args) {
  switch (topic) {
    case 'hits':
      return stats('hits', platform, pkg)
    case 'rank':
      return stats('rank', platform, pkg)
    case 'v':
      return version(pkg)
  }
}

const stats = async (metric, type, name) => {
  const endpoint = `https://data.jsdelivr.com/v1/package/${type}/${name}/stats`
  const { total, rank } = await got(endpoint).then(res => res.body)

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
  }
}

const version = async (name) => {
  const endpoint = `https://cdn.jsdelivr.net/npm/${name}/package.json`
  const { version } = await got(endpoint).then(res => res.body)
  return {
    subject: 'jsDelivr',
    status: `v${version}`,
    color: versionColor(version)
  }
}
