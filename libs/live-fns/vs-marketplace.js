const millify = require('millify')
const got = require('../got.js')
const v = require('../utils/version-formatter.js')
const semColor = require('../utils/sem-color.js')

module.exports = async (topic, pkg) => {
  const { results } = await queryVSM(pkg)
  const extension = results[0].extensions[0]

  if (!extension) {
    return {
      subject: 'VS Marketplace',
      status: 'not found'
    }
  }

  switch (topic) {
    case 'v':
      const version = extension.versions[0].version
      return {
        subject: 'VS Marketplace',
        status: v(version),
        color: semColor(version)
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
        subject: 'Visual Studio Marketplace',
        status: 'unknown topic'
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
