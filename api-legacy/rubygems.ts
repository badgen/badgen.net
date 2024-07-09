import millify from 'millify'
import got from '../libs/got'
import { version as v, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Ruby Gems',
  examples: {
    '/rubygems/v/rails': 'version (stable)',
    '/rubygems/v/rails/pre': 'version (pre)',
    '/rubygems/v/rails/latest': 'version (latest)',
    '/rubygems/dt/rails': 'total downloads',
    '/rubygems/dv/rails': 'latest version downloads',
    '/rubygems/n/rails': 'name',
    '/rubygems/p/rails': 'platform',
  },
  handlers: {
    '/rubygems/v/:gem/:channel?': versionHandler,
    '/rubygems/:topic<dt|dv|n|p>/:gem': handler
  }
})

const preConditions = ['.rc', '.beta', '-rc', '-beta']

const pre = versions => versions.filter(v => {
  for (let condition of preConditions) {
    if (!v.includes(condition)) {
      return false
    }
  }

  return true
})

const stable = versions => versions.filter(v => {
  for (let condition of preConditions) {
    if (v.includes(condition)) {
      return false
    }
  }

  return true
})

const latest = versions => versions.length > 0 && versions.slice(-1)[0]

async function versionHandler ({ gem, channel = 'stable' }: PathArgs) {
  const endpoint = `https://rubygems.org/api/v1/versions/${gem}.json`
  const response = await got(endpoint).json<any>()

  // @ts-ignore
  const versions = Object.values(response).map(value => value.number).reverse()

  let version = ''

  switch (channel) {
    case 'latest':
      version = latest(versions)
      break
    case 'pre':
      version = latest(pre(versions))
      break
    default:
      version = latest(stable(versions))
  }

  version = version || latest(versions)

  return {
    subject: 'rubygems',
    status: v(version),
    color: versionColor(version)
  }
}

async function handler ({ topic, gem }: PathArgs) {
  const endpoint = `https://rubygems.org/api/v1/gems/${gem}.json`
  const response = await got(endpoint).json<any>()

  switch (topic) {
    case 'dt':
      return {
        subject: 'downloads',
        status: millify(response.downloads),
        color: 'green'
      }
    case 'dv':
      return {
        subject: 'downloads',
        status: millify(response.version_downloads) + '/version',
        color: 'green'
      }
    case 'n':
      return {
        subject: 'rubygems',
        status: response.name,
        color: 'green'
      }
    case 'p':
      return {
        subject: 'platform',
        status: response.platform,
        color: 'green'
      }
    default:
      return {
        subject: 'rubygems',
        status: 'unknown',
        color: 'grey'
      }
  }
}
