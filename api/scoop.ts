import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const SCOOP_MAIN_BUCKET_URL = 'https://github.com/ScoopInstaller/Main/raw/master/bucket/'
const SCOOP_EXTRAS_BUCKET_URL = 'https://github.com/lukesampson/scoop-extras/raw/master/bucket/'

export default createBadgenHandler({
  title: 'Scoop',
  examples: {
    '/scoop/v/1password-cli': 'version',
    '/scoop/v/adb': 'version',
    '/scoop/license/caddy': 'license',
    '/scoop/extras/v/age': 'version',
    '/scoop/extras/v/codeblocks': 'version',
    '/scoop/extras/license/deluge': 'license',
  },
  handlers: {
    '/scoop/:topic<v|license>/:app': handler,
    '/scoop/:bucket<main|extras>/:topic<v|license>/:app': handler
  }
})

async function handler ({ bucket = 'main', topic = 'v', app }: PathArgs) {
  const prefixUrl = bucket === 'extras' ? SCOOP_EXTRAS_BUCKET_URL : SCOOP_MAIN_BUCKET_URL
  const { license, version:ver } = await got(`${app}.json`, { prefixUrl }).json<any>()

  switch (topic) {
    case 'v':
      return {
        subject: bucket === 'extras' ? 'scoop-extras' : 'scoop',
        status: version(ver),
        color: versionColor(ver)
      }
    case 'license':
      return {
        subject: 'license',
        status: license || 'unknown',
        color: 'blue'
      }
  }
}
