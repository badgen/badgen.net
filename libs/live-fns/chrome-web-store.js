const chrome = require('chrome-webstore')
const millify = require('millify')

module.exports = async function (method, ...args) {
  const meta = await chrome.extension({id: args[0]})
  switch (method) {
    case 'v':
      return {
        subject: 'chrome web store',
        status: meta.version,
        color: 'blue'
      }
    case 'users':
      return {
        subject: 'users',
        status: millify(parseInt(meta.interactionCount.replace(',', ''))),
        color: 'green'
      }
    case 'price':
      return {
        subject: 'price',
        status: `$${meta.price}`,
        color: 'green'
      }
    case 'rating':
      return {
        subject: 'rating',
        status: `${meta.ratingValue}/5`,
        color: 'green'
      }
    case 'stars':
      return {
        subject: 'stars',
        status: Array(Math.ceil(meta.ratingValue)).fill('★').concat(
          Array(5 - Math.ceil(meta.ratingValue)).fill('☆')).join(''),
        color: 'green'
      }
    case 'rating-count':
      return {
        subject: 'rating count',
        status: `${meta.ratingCount} total`,
        color: 'green'
      }
    default:
      return {
        subject: 'chrome',
        status: 'unknown',
        color: 'grey'
      }
  }
}
