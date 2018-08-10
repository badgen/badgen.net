const webstore = require('chrome-webstore')
const millify = require('millify')
const semColor = require('../utils/sem-color.js')
const stars = require('../utils/stars.js')
const v = require('../utils/version-formatter.js')

module.exports = async (topic, ...args) => {
  const meta = await webstore.detail({ id: args[0] })
  switch (topic) {
    case 'v':
      return {
        subject: 'chrome web store',
        status: v(meta.version),
        color: semColor(meta.version)
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
