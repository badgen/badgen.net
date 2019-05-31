import millify from 'millify'
import got from '../libs/got'
import { version as v, versionColor } from '../libs/utils'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Visual Studio Marketplace',
  examples: {
    '/vs-marketplace/v/vscodevim.vim': 'version',
    '/vs-marketplace/i/vscodevim.vim': 'installs',
    '/vs-marketplace/d/vscodevim.vim': 'downloads',
    '/vs-marketplace/rating/vscodevim.vim': 'rating',
  }
}

export const handlers: Handlers = {
  '/vs-marketplace/:topic<v|i|d|rating>/:pkg': handler
}

export default badgenServe(handlers)

async function handler ({ topic, pkg }: Args) {
  const { results } = await queryVSM(pkg)
  const extension = results[0].extensions[0]

  if (!extension) {
    return {
      subject: 'VS Marketplace',
      status: 'not found',
      color: 'grey'
    }
  }

  switch (topic) {
    case 'v':
      const version = extension.versions[0].version
      return {
        subject: 'VS Marketplace',
        status: v(version),
        color: versionColor(version)
      }
    case 'd':
      const { install, updateCount } = parseStatistics(extension)
      return {
        subject: 'downloads',
        status: millify(install + updateCount),
        color: 'green'
      }
    case 'i':
      return {
        subject: 'installs',
        status: millify(parseStatistics(extension).install),
        color: 'green'
      }
    case 'rating':
      const { averagerating, ratingcount } = parseStatistics(extension)
      return {
        subject: 'rating',
        status: `${averagerating.toFixed(1)}/5 (${ratingcount})`,
        color: 'green'
      }
  }
}

const queryVSM = async pkgName => {
  const endpoint = 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery'
  return got.post(endpoint, {
    query: { 'api-version': '3.0-preview.1' },
    body: {
      filters: [{ criteria: [{ filterType: 7, value: pkgName }] }],
      flags: 914
    }
  }).then(res => res.body)
}

const parseStatistics = extension => {
  return extension.statistics.reduce((accu, curr) => {
    accu[curr.statisticName] = curr.value
    return accu
  }, {})
}
