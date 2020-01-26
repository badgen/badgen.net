import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Homebrew',
  examples: {
    '/homebrew/v/fish': 'version',
    '/homebrew/v/cake': 'version'
  },
  handlers: {
    '/homebrew/v/:pkg': handler
  }
})

async function handler ({ pkg }: PathArgs) {
  const endpoint = `https://formulae.brew.sh/api/formula/${pkg}.json`
  const { versions } = await got(endpoint).json<any>()

  return {
    subject: 'homebrew',
    status: version(versions.stable),
    color: versionColor(versions.stable)
  }
}
