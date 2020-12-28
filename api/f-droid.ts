import got from '../libs/got'
import { parseDocument } from 'yaml'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const F_DROID_METADATA_REPO_URL = 'https://gitlab.com/fdroid/fdroiddata/raw/master/metadata/'

const client = got.extend({ prefixUrl: F_DROID_METADATA_REPO_URL })

export default createBadgenHandler({
  title: 'F-Droid',
  examples: {
    '/f-droid/v/org.schabi.newpipe': 'version',
    '/f-droid/v/com.amaze.filemanager': 'version',
    '/f-droid/license/org.tasks': 'license'
  },
  handlers: {
    '/f-droid/:topic<v|license>/:appId': handler
  }
})

async function handler ({ topic, appId }: PathArgs) {
  const yaml = await client.get(`${appId}.yml`).text()
  const metadata = parseDocument(yaml)

  switch (topic) {
    case 'v': {
      const ver = metadata.get('CurrentVersion')
      return {
        subject: 'f-droid',
        status: version(ver),
        color: versionColor(ver)
      }
    }
    case 'license': {
      const license = metadata.get('License')
      return {
        subject: 'license',
        status: license || 'unknown',
        color: 'blue'
      }
    }
  }
}
