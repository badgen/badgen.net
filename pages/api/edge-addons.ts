import millify from 'millify'
import EdgeAddons from 'webextension-store-meta/lib/edge-addons'
import { version, versionColor, stars } from '../../libs/utils'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

const subject = 'edge add-ons'

export default createBadgenHandler({
  title: 'Edge Add-ons',
  examples: {
    '/edge-addons/v/cnlefmmeadmemmdciolhbnfeacpdfbkd': 'version',
    '/edge-addons/users/cnlefmmeadmemmdciolhbnfeacpdfbkd': 'users',
    '/edge-addons/stars/cnlefmmeadmemmdciolhbnfeacpdfbkd': 'stars',
    '/edge-addons/rating/cnlefmmeadmemmdciolhbnfeacpdfbkd': 'rating',
    '/edge-addons/rating-count/cnlefmmeadmemmdciolhbnfeacpdfbkd': 'rating count',
  },
  handlers: {
    '/edge-addons/:topic<v|users|stars|rating|rating-count>/:id': handler
  }
})

async function handler ({ topic, id }: PathArgs) {
  const result = await EdgeAddons.load({ id, qs: { hl: 'en-US' } }).catch(console.error)

  if (!result || !result.url()) {
    return {
      subject,
      status: 'not found',
      color: 'grey',
    }
  }

  switch (topic) {
    case 'v': {
      const v = result.version()
      return {
        subject,
        status: version(v),
        color: v ? versionColor(v) : 'grey'
      }
    }
    case 'users': {
      const users = result.activeInstallCount()
      return {
        subject: 'users',
        status: users === null ? 'unknown' : millify(users),
        color: 'green'
      }
    }
    case 'rating': {
      const rating = result.averageRating()
      return {
        subject: 'rating',
        status: `${rating === null ? '-' : rating.toFixed(1)}/5`,
        color: 'green'
      }
    }
    case 'stars':
      return {
        subject: 'stars',
        status: stars(result.averageRating() || 0),
        color: 'green'
      }
    case 'rating-count': {
      const ratingCount = result.ratingCount()
      return {
        subject: 'rating count',
        status: ratingCount === null ? 'unknown' : `${millify(ratingCount)} total`,
        color: 'green'
      }
    }
    default:
      return {
        subject,
        status: 'unknown',
        color: 'grey'
      }
  }
}
