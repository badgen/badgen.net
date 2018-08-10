const millify = require('millify')

const axios = require('../axios.js')
const compareVersions = require('../utils/compare-versions.js')
const semColor = require('../utils/sem-color.js')

const pre = versions =>
  versions.filter(v => v.includes('-') && v.indexOf('dev') !== 0)
const stable = versions => versions.filter(v => !v.includes('-'))
const latest = versions => versions.length > 0 && versions.slice(-1)[0]
const noDev = versions => versions.filter(v => v.indexOf('dev') === -1)
const license = versions =>
  Object.values(versions).find(v => v.license.length > 0).license[0]

module.exports = async (topic, vendor, pkg, channel = 'stable') => {
  const endpoint = `https://packagist.org/packages/${vendor}/${pkg}.json`
  const { package: packageMeta } = await axios
    .get(endpoint)
    .then(res => res.data)

  switch (topic) {
    case 'v':
      const versions = Object.keys(packageMeta.versions).sort(compareVersions)

      let version = ''

      switch (channel) {
        case 'latest':
          version = latest(noDev(versions))
          break
        case 'pre':
          version = latest(pre(versions))
          break
        default:
          version = latest(stable(versions))
      }

      version = version || latest(versions)

      return {
        subject: 'packagist',
        status: version ? `v${version}` : 'unknown',
        color: semColor(version)
      }
    case 'dt':
      return {
        subject: 'downloads',
        status: millify(packageMeta.downloads.total),
        color: 'green'
      }
    case 'dd':
      return {
        subject: 'downloads',
        status: millify(packageMeta.downloads.daily) + '/day',
        color: 'green'
      }
    case 'dm':
      return {
        subject: 'downloads',
        status: millify(packageMeta.downloads.monthly) + '/month',
        color: 'green'
      }
    case 'favers':
      return {
        subject: 'favers',
        status: millify(packageMeta.favers),
        color: 'green'
      }
    case 'dependents':
      return {
        subject: 'dependents',
        status: millify(packageMeta.dependents),
        color: 'green'
      }
    case 'suggesters':
      return {
        subject: 'suggesters',
        status: millify(packageMeta.suggesters),
        color: 'green'
      }
    case 'n':
      return {
        subject: 'packagist',
        status: packageMeta.name,
        color: 'green'
      }
    case 'ghs':
      return {
        subject: 'stars',
        status: millify(packageMeta.github_stars),
        color: 'green'
      }
    case 'ghw':
      return {
        subject: 'watchers',
        status: millify(packageMeta.github_watchers),
        color: 'green'
      }
    case 'ghf':
      return {
        subject: 'forks',
        status: millify(packageMeta.github_forks),
        color: 'green'
      }
    case 'ghi':
      return {
        subject: 'issues',
        status: millify(packageMeta.github_open_issues),
        color: 'green'
      }
    case 'license':
      return {
        subject: 'license',
        status: license(packageMeta.versions) || 'unknown',
        color: 'blue'
      }
    case 'lang':
      return {
        subject: 'language',
        status: packageMeta.language,
        color: 'green'
      }
    default:
      return {
        subject: 'packagist',
        status: 'unknown',
        color: 'grey'
      }
  }
}
