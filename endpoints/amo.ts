import got from '../libs/got'
import { millify, stars, version, versionColor } from '../libs/utils'
import { badgenServe, BadgenServeHandlers, BadgenServeHandlerArgs } from '../libs/badgen-serve'

export const help = ``

export const examples = [
  '/amo/v/markdown-viewer-chrome',
  '/amo/users/markdown-viewer-chrome',
  '/amo/rating/markdown-viewer-chrome',
  '/amo/stars/markdown-viewer-chrome',
  '/amo/reviews/markdown-viewer-chrome',
]

const handlers = {
  '/amo/:topic/:name': handler
}

async function handler ({ topic, name }: BadgenServeHandlerArgs) {
  const endpoint = `https://addons.mozilla.org/api/v3/addons/addon/${name}/`
  const addon = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'v':
      return {
        subject: 'mozilla add-on',
        status: version(addon.current_version.version),
        color: versionColor(addon.current_version.version)
      }
    case 'users':
      return {
        subject: 'users',
        status: millify(parseInt(addon.average_daily_users)),
        color: 'green'
      }
    case 'rating':
      return {
        subject: 'rating',
        status: `${Number(addon.ratings.average).toFixed(2)}/5`,
        color: 'green'
      }
    case 'stars':
      return {
        subject: 'stars',
        status: stars(addon.ratings.average),
        color: 'green'
      }
    case 'reviews':
      return {
        subject: 'reviews',
        status: addon.ratings.count,
        color: 'green'
      }
    default:
      return {
        subject: 'mozilla add-on',
        status: 'unknown',
        color: 'grey'
      }
  }
}

export default badgenServe(handlers, { examples })
