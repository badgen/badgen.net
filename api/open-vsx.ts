import millify from 'millify'
import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Open VSX',
  examples: {
    '/open-vsx/v/idleberg/electron-builder': 'version',
    '/open-vsx/r/idleberg/electron-builder': 'reviews',
    '/open-vsx/l/idleberg/electron-builder': 'license',
    '/open-vsx/d/idleberg/electron-builder': 'downloads'
  },
  handlers: {
    '/open-vsx/:topic/:namespace/:pkg': handler
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
    case 'r':
    case 'reviews':
      return {
        subject: 'reviews',
        status: millify(data.reviewCount),
        color: 'green'
      }
    default:
      return {
        subject: 'Open VSX',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}
