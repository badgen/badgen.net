import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Homebrew',
  examples: {
    '/homebrew/v/fish': 'version',
    '/homebrew/v/cake': 'version',
    '/homebrew/cask/v/atom': 'version',
    '/homebrew/cask/v/whichspace': 'version'
  },
  handlers: {
    '/homebrew/v/:pkg': handler,
    '/homebrew/:type<formula|cask>/v/:pkg': handler
  }
})

async function handler ({ type = 'formula', pkg }: PathArgs) {
  const endpoint = `https://formulae.brew.sh/api/${type}/${pkg}.json`
  const subject = type === 'cask' ? 'homebrew cask' : 'homebrew'
  const {
    versions,
    version:ver = versions.stable
  } = await got(endpoint).json<any>()

  return {
    subject,
    status: version(ver),
    color: versionColor(ver)
  }
}
