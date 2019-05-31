import got from '../libs/got'
import { version as v, versionColor } from '../libs/utils'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Hackage',
  examples: {
    '/hackage/v/abt': 'version',
    '/hackage/v/Cabal': 'version',
    '/hackage/license/Cabal': 'license',
  }
}

export const handlers: Handlers = {
  '/hackage/:topic<v|license>/:pkg': handler
}

export default badgenServe(handlers)

async function handler ({ topic, pkg }: Args) {
  const endpoint = `https://hackage.haskell.org/package/${pkg}/${pkg}.cabal`
  // @ts-ignore
  const cabal = await got(endpoint, { json: false }).then(res => res.body)
  const { version, license } = parseCabalFile(cabal)

  switch (topic) {
    case 'v':
      return {
        subject: 'hackage',
        status: v(version),
        color: versionColor(version)
      }
    case 'license':
      return {
        subject: 'license',
        status: license,
        color: 'blue'
      }
  }
}

// Naive implementation (only parse meta blocks)
const parseCabalFile = raw => {
  return raw.match(/[\w-]+:.+\S+$/gm).reduce((accu, line) => {
    const [key, value] = line.split(':')
    accu[key] = value.trim()
    return accu
  }, {})
}
