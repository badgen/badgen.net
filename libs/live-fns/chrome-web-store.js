const webstore = require('chrome-webstore')
const millify = require('millify')
const round = require('../utils/round.js')
const stars = require('../utils/stars.js')
const semColor = require('../utils/sem-color.js')

module.exports = async function (topic, ...args) {
  const meta = await webstore.detail({id: args[0]})
  switch (topic) {
    case 'v':
      return {
        subject: 'chrome web store',
        status: 'v' + meta.version,
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
        status: `${round(meta.rating.average, 2)}/5`,
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
