import got from '../libs/got'
import { millify, version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const HOMEBREW_API_URL = 'https://formulae.brew.sh/api/'

const client = got.extend({ prefixUrl: HOMEBREW_API_URL })

export default createBadgenHandler({
  title: 'Homebrew',
  examples: {
    '/homebrew/v/fish': 'version',
    '/homebrew/v/cake': 'version',
    '/homebrew/dm/fish': 'monthly downloads',
    '/homebrew/dy/fish': 'yearly downloads',
    '/homebrew/cask/v/atom': 'version',
    '/homebrew/cask/v/whichspace': 'version',
    '/homebrew/cask/dm/atom': 'monthly downloads',
    '/homebrew/cask/dy/atom': 'yearly downloads'
  },
  handlers: {
    '/homebrew/:topic<v|dm|dy>/:pkg': handler,
    '/homebrew/:type<formula|cask>/:topic<v|dm|dy>/:pkg': handler
  }
})

async function handler ({ type = 'formula', topic, pkg }: PathArgs) {
  const {
    analytics,
    versions,
    version:ver = versions.stable
  } = await client.get(`${type}/${pkg}.json`).json<any>()

  switch (topic) {
    case 'v':
      return {
        subject: type === 'cask' ? 'homebrew cask' : 'homebrew',
        status: version(ver),
        color: versionColor(ver)
      }
    case 'dm':
      return {
        subject: 'downloads',
        status: millify(analytics.install['30d'][pkg]) + '/month',
        color: 'green'
      }
    case 'dy':
      return {
        subject: 'downloads',
        status: millify(analytics.install['365d'][pkg]) + '/year',
        color: 'green'
      }
  }
}
