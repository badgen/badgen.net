import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const ELM_PACKAGES_REPO_URL = 'https://package.elm-lang.org/'

const client = got.extend({ prefixUrl: ELM_PACKAGES_REPO_URL })

export default createBadgenHandler({
  title: 'Elm Package',
  examples: {
    '/elm-package/v/avh4/elm-color': 'version',
    '/elm-package/license/mdgriffith/elm-ui': 'license',
    '/elm-package/elm/justinmimbs/date': 'elm version'
  },
  handlers: {
    '/elm-package/:topic<v|version|license|elm>/:owner/:name': handler
  }
})

async function handler ({ topic, owner, name }: PathArgs) {
  const {
    'elm-version': elmVersion,
    license,
    version: ver
  } = await client.get(`packages/${owner}/${name}/latest/elm.json`).json<any>()

  switch (topic) {
    case 'v':
    case 'version':
      return {
        subject: 'elm package',
        status: version(ver),
        color: versionColor(ver)
      }
    case 'license':
      return {
        subject: 'license',
        status: license || 'unknown',
        color: 'blue'
      }
    case 'elm': {
      const ver = formatElmVersion(elmVersion)
      return {
        subject: 'elm',
        status: version(ver),
        color: versionColor(ver)
      }
    }
  }
}

function formatElmVersion (range: string) {
  const parts = range.split(/\s+/g).filter(it => it !== 'v')
  if (parts.length === 1) return parts[0]
  let [lower, lowerOp, upperOp, upper] = parts
  lowerOp = lowerOp.replace(/^</, '>')
  return `${lowerOp}${lower} ${upperOp}${upper}`
}
