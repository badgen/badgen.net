import got from '../libs/got'
import { version as v, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Hackage',
  examples: {
    '/hackage/v/abt': 'version',
    '/hackage/v/Cabal': 'version',
    '/hackage/license/Cabal': 'license',
  },
  handlers: {
    '/hackage/:topic<v|license>/:pkg': handler
  }
})

async function handler ({ topic, pkg }: PathArgs) {
  const endpoint = `https://hackage.haskell.org/package/${pkg}/${pkg}.cabal`
  const cabal = await got(endpoint).json<any>()
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
