import got from '../../libs/got'
import { version as v, versionColor } from '../../libs/utils'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

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
  const cabal = await got(endpoint).text()
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
    default:
      return {
        subject: 'hackage',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}

// Naive implementation (only parse meta blocks)
const parseCabalFile = raw => {
  // this regex needs to support both v1 and v2 for cabalfile
  const cabalMeta = raw.match(/[\w-]+:.+\S+$/gm).reduce((accu, line) => {
    const [key, value] = line.split(':')
    accu[key.toLowerCase()] = value.trim()
    return accu
  }, {})

  return cabalMeta
}
