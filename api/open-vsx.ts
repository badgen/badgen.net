import millify from 'millify'
import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Open VSX',
  examples: {
    '/open-vsx/downloads/idleberg/electron-builder': 'downloads',
    '/open-vsx/d/idleberg/electron-builder': 'downloads',
    '/open-vsx/license/idleberg/electron-builder': 'license',
    '/open-vsx/rating/idleberg/electron-builder': 'rating',
    '/open-vsx/reviews/idleberg/electron-builder': 'reviews',
    '/open-vsx/version/idleberg/electron-builder': 'version'
  },
  handlers: {
    '/open-vsx/:topic<d|l|license|rating|reviews|v|version>/:namespace/:pkg': handler
  }
})

async function handler ({ topic, pkg, namespace }: PathArgs) {
  const endpoint = `https://open-vsx.org/api/${namespace}/${pkg}`
  const data = await got(endpoint).json<any>()

  switch (topic) {
    case 'v':
    case 'version':
      return {
        subject: `version`,
        status: version(data.version),
        color: versionColor(data.version)
      }
    case 'd':
    case 'downloads':
      return {
        subject: 'downloads',
        status: millify(data.downloadCount),
        color: 'green'
      }
    case 'l':
    case 'license':
      return {
        subject: 'license',
        status: data.license || 'unknown',
        color: 'blue'
      }
    case 'rating':
      return {
        subject: 'rating',
        status: `${data.averageRating}/5`,
        color: 'green'
      }
    case 'reviews':
      return {
        subject: 'reviews',
        status: millify(data.reviewCount),
        color: 'green'
      }
  }
}
