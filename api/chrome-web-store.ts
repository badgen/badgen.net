import millify from 'millify'
import ChromeWebStore from 'webextension-store-meta/lib/chrome-web-store'
import { version, versionColor, stars } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Chrome Extensions',
  examples: {
    '/chrome-web-store/v/ckkdlimhmcjmikdlpkmbgfkaikojcbjk': 'version',
    '/chrome-web-store/users/ckkdlimhmcjmikdlpkmbgfkaikojcbjk': 'users',
    '/chrome-web-store/price/ckkdlimhmcjmikdlpkmbgfkaikojcbjk': 'price',
    '/chrome-web-store/stars/ckkdlimhmcjmikdlpkmbgfkaikojcbjk': 'stars',
    '/chrome-web-store/rating/ckkdlimhmcjmikdlpkmbgfkaikojcbjk': 'rating',
    '/chrome-web-store/rating-count/ckkdlimhmcjmikdlpkmbgfkaikojcbjk': 'rating count',
  },
  handlers: {
    '/chrome-web-store/:topic<v|users|price|stars|rating|rating-count>/:id': handler
  }
})

async function handler ({ topic, id }: PathArgs) {
  const chromeWebStore = await ChromeWebStore.load({ id })
  switch (topic) {
    case 'v': {
      const v = chromeWebStore.version()
      return {
        subject: 'chrome web store',
        status: version(v),
        color: versionColor(v)
      }
    }
    case 'users':
      return {
        subject: 'users',
        status: millify(chromeWebStore.users()),
        color: 'green'
      }
    case 'price':
      return {
        subject: 'price',
        status: `${chromeWebStore.price()} ${chromeWebStore.priceCurrency()}`,
        color: 'green'
      }
    case 'rating':
      return {
        subject: 'rating',
        status: `${chromeWebStore.ratingValue().toFixed(2)}/5`,
        color: 'green'
      }
    case 'stars':
      return {
        subject: 'stars',
        status: stars(chromeWebStore.ratingValue()),
        color: 'green'
      }
    case 'rating-count':
      return {
        subject: 'rating count',
        status: `${chromeWebStore.ratingCount()} total`,
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
