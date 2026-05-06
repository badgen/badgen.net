import millify from 'millify'
import got from '../../libs/got'
import { version as v, versionColor } from '../../libs/utils'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

export default createBadgenHandler({
  title: 'Visual Studio Marketplace',
  examples: {
    '/vs-marketplace/v/vscodevim.vim': 'version',
    '/vs-marketplace/v/ms-python.vscode-pylance/latest': 'version (including pre-release)',
    '/vs-marketplace/i/vscodevim.vim': 'installs',
    '/vs-marketplace/d/vscodevim.vim': 'downloads',
    '/vs-marketplace/rating/vscodevim.vim': 'rating',
  },
  handlers: {
    '/vs-marketplace/:topic<v|i|d|rating>/:pkg/:tag?': handler
  }
})

async function handler ({ topic, pkg, tag }: PathArgs) {
  const showLatest = tag === 'latest'
  const { results } = await queryVSM(pkg, showLatest ? 979 : 467)
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
      let extensionVersion = extension.versions[0]
      if (!showLatest) {
        extensionVersion = extension.versions.find(ver => {
          const isPreRelease = ver.properties?.some(prop =>
            prop.key === 'Microsoft.VisualStudio.Code.PreRelease' && prop.value === 'true'
          )
          return !isPreRelease
        }) || extension.versions[0]
      }
      const version = extensionVersion.version
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
    default:
      return {
        subject: 'vs-marketplace',
        status: 'unknown topic',
        color: 'grey',
      }
  }
}

const queryVSM = async (pkgName, flags = 467) => {
  const endpoint = 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery'
  return got.post(endpoint, {
    searchParams: { 'api-version': '3.0-preview.1' },
    json: {
      filters: [{ criteria: [{ filterType: 7, value: pkgName }] }],
      flags
    }
  }).json<any>()
}

const parseStatistics = extension => {
  return extension.statistics.reduce((accu, curr) => {
    accu[curr.statisticName] = curr.value
    return accu
  }, {})
}
