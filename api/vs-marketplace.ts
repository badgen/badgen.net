import millify from 'millify'
import ky from '../libs/ky'
import { version as v, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Visual Studio Marketplace',
  examples: {
    '/vs-marketplace/v/vscodevim.vim': 'version',
    '/vs-marketplace/i/vscodevim.vim': 'installs',
    '/vs-marketplace/d/vscodevim.vim': 'downloads',
    '/vs-marketplace/rating/vscodevim.vim': 'rating',
  },
  handlers: {
    '/vs-marketplace/:topic<v|i|d|rating>/:pkg': handler
  }
})

async function handler ({ topic, pkg }: PathArgs) {
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
  return ky.post(endpoint, {
    searchParams: { 'api-version': '3.0-preview.1' },
    json: {
      filters: [{ criteria: [{ filterType: 7, value: pkgName }] }],
      flags: 914
    }
  }).then(res => res.json())
}

const parseStatistics = extension => {
  return extension.statistics.reduce((accu, curr) => {
    accu[curr.statisticName] = curr.value
    return accu
  }, {})
}
