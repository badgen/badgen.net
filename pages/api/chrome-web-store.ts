import millify from 'millify'
import ChromeWebStore from 'webextension-store-meta/lib/chrome-web-store'
import { version, versionColor, stars } from '../../libs/utils'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

export default createBadgenHandler({
  title: 'Chrome Extensions',
  examples: {
    '/chrome-web-store/v/ckkdlimhmcjmikdlpkmbgfkaikojcbjk': 'version',
    '/chrome-web-store/users/ckkdlimhmcjmikdlpkmbgfkaikojcbjk': 'users',
    // '/chrome-web-store/price/ckkdlimhmcjmikdlpkmbgfkaikojcbjk': 'price', // deprecated
    '/chrome-web-store/stars/ckkdlimhmcjmikdlpkmbgfkaikojcbjk': 'stars',
    '/chrome-web-store/rating/ckkdlimhmcjmikdlpkmbgfkaikojcbjk': 'rating',
    '/chrome-web-store/rating-count/ckkdlimhmcjmikdlpkmbgfkaikojcbjk': 'rating count',
  },
  handlers: {
    '/chrome-web-store/:topic<v|users|price|stars|rating|rating-count>/:id': handler
  }
})

async function handler ({ topic, id }: PathArgs) {
  const result = await ChromeWebStore.load({ id, qs: { hl: 'en' } }).catch(console.error)

  if (!result) {
    return {
      subject: 'chrome web store',
      status: 'not found',
      color: 'grey',
    }
  }
  switch (topic) {
    case 'v': {
      const v = result.version()
      return {
        subject: 'chrome web store',
        status: version(v),
        color: versionColor(v)
      }
    }
    case 'users':
      return {
        subject: 'users',
        status: result.users(),
        color: 'green'
      }
    case 'price':
      return {
        subject: 'price',
        // status: `${result.price()} ${result.priceCurrency()}`,
        status: 'deprecated',
        color: 'gray'
      }
    case 'rating':
      return {
        subject: 'rating',
        status: `${Number(result.ratingValue())?.toFixed(1) || '-'}/5`,
        color: 'green'
      }
    case 'stars':
      return {
        subject: 'stars',
        status: stars(result.ratingValue()),
        color: 'green'
      }
    case 'rating-count':
      return {
        subject: 'rating count',
        status: `${result.ratingCount()} total`,
        color: 'green'
      }
    default:
      return {
        subject: 'chrome web store',
        status: 'unknown',
        color: 'grey'
      }
  }
}
