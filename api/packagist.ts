import millify from 'millify'
import got from '../libs/got'
import { version as v, versionColor, versionCompare } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Packagist',
  examples: {
    '/packagist/v/monolog/monolog': 'version',
    '/packagist/v/monolog/monolog/pre': 'version (pre)',
    '/packagist/v/monolog/monolog/latest': 'version (latest)',
    '/packagist/dt/monolog/monolog': 'total downloads',
    '/packagist/dd/monolog/monolog': 'daily downloads',
    '/packagist/dm/monolog/monolog': 'monthly downloads',
    '/packagist/favers/monolog/monolog': 'favers',
    '/packagist/dependents/monolog/monolog': 'dependents',
    '/packagist/suggesters/monolog/monolog': 'suggesters',
    '/packagist/name/monolog/monolog': 'name',
    '/packagist/ghs/monolog/monolog': 'github stars',
    '/packagist/ghw/monolog/monolog': 'github watchers',
    '/packagist/ghf/monolog/monolog': 'github followers',
    '/packagist/ghi/monolog/monolog': 'github issues',
    '/packagist/lang/monolog/monolog': 'language',
    '/packagist/license/monolog/monolog': 'license',
    '/packagist/php/monolog/monolog': 'php',
  },
  handlers: {
    '/packagist/:topic<v|php>/:vendor/:pkg/:channel?': handler,
    '/packagist/:topic<dt|dd|dm|favers|dependents|suggesters|n|name>/:vendor/:pkg': handler,
    '/packagist/:topic<ghs|ghw|ghf|ghi|lang|license>/:vendor/:pkg': handler
  }
})

const pre = versions => versions.filter(v => v.includes('-') && v.indexOf('dev') !== 0)
const stable = versions => versions.filter(v => !v.includes('-'))
const latest = versions => versions.length > 0 && versions.slice(-1)[0]
const noDev = versions => versions.filter(v => v.indexOf('dev') === -1)
// @ts-ignore
const license = versions => Object.values(versions).find(v => v.license.length).license[0]

const getVersion = (packageMeta, channel) => {
  const versions = Object.keys(packageMeta.versions).sort(versionCompare)

  if (versions.includes(channel)) {
    return channel
  }

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

  return version || latest(versions)
}

async function handler ({ topic, vendor, pkg, channel = 'latest' }: PathArgs) {
  const endpoint = `https://packagist.org/packages/${vendor}/${pkg}.json`
  const { package: packageMeta } = await got(endpoint).json<any>()

  switch (topic) {
    case 'v':
      const version = getVersion(packageMeta, channel)

      return {
        subject: 'packagist',
        status: v(version),
        color: versionColor(version)
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
    case 'name':
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
    case 'php':
      const pkg = packageMeta.versions[getVersion(packageMeta, channel)]

      return {
        subject: 'php',
        status: pkg.require && pkg.require.php ? pkg.require.php : '*',
        color: 'green'
      }
  }
}
