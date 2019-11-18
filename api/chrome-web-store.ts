import millify from 'millify'
import webstore from 'chrome-webstore'
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
  const meta = await webstore.detail({ id })
  switch (topic) {
    case 'v':
      return {
        subject: 'chrome web store',
        status: version(meta.version),
        color: versionColor(meta.version)
      }
    case 'users':
      return {
        subject: 'users',
        status: millify(parseInt(meta.users.replace(/,/g, ''))),
        color: 'green'
      }
    case 'price':
      return {
        subject: 'price',
        status: meta.price,
        color: 'green'
      }
    case 'rating':
      return {
        subject: 'rating',
        status: `${Number(meta.rating.average).toFixed(2)}/5`,
        color: 'green'
      }
    case 'stars':
      return {
        subject: 'stars',
        status: stars(meta.rating.average),
        color: 'green'
      }
    case 'rating-count':
      return {
        subject: 'rating count',
        status: `${meta.rating.count} total`,
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
