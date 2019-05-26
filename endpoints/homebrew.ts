import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Homebrew',
  examples: {
    '/homebrew/v/fish': 'version',
    '/homebrew/v/cake': 'version'
  }
}

export const handlers: Handlers = {
  '/homebrew/v/:pkg': handler
}

async function handler ({ pkg }: Args) {
  const endpoint = `https://formulae.brew.sh/api/formula/${pkg}.json`
  const { versions } = await got(endpoint).then(res => res.body)

  return {
    subject: 'homebrew',
    status: version(versions.stable),
    color: versionColor(versions.stable)
  }
}

export default badgenServe(handlers)
