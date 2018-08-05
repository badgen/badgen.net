const millify = require('millify')

const axios = require('../axios.js')
const semColor = require('../utils/sem-color.js')

const pre = versions => versions.filter(v => v.includes('-'))
const stable = versions => versions.filter(v => !v.includes('-'))
const latest = versions => versions.length > 0 && versions.slice(-1)[0]

module.exports = async function (topic, vendor, pkg, channel = 'stable') {
  const endpoint = `https://packagist.org/packages/${vendor}/${pkg}.json`
  const response = await axios.get(endpoint).then(res => res.data)

  switch (topic) {
    case 'v':
      const versions = Object.keys(response.package.versions)

      let version = ''

      switch (channel) {
        case 'latest':
          version = latest(versions)
          break
        case 'pre':
          version = latest(pre(versions))
          break
        default:
          version = latest(stable(versions).reverse())
      }

      version = version || latest(versions)

      return {
        subject: 'packagist',
        status: version || 'unknown',
        color: semColor(version)
      }
    case 'dt':
      return {
        subject: 'downloads',
        status: millify(response.package.downloads.total),
        color: 'green'
      }
    case 'dd':
      return {
        subject: 'downloads',
        status: millify(response.package.downloads.daily) + '/day',
        color: 'green'
      }
    case 'dm':
      return {
        subject: 'downloads',
        status: millify(response.package.downloads.monthly) + '/month',
        color: 'green'
      }
    case 'favers':
      return {
        subject: 'favers',
        status: millify(response.package.favers),
        color: 'green'
      }
    case 'dependents':
      return {
        subject: 'dependents',
        status: response.package.dependents,
        color: 'green'
      }
    case 'suggesters':
      return {
        subject: 'suggesters',
        status: response.package.suggesters,
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
