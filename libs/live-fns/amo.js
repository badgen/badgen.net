const axios = require('../axios.js')
const xml2js = require('xml2js')
const millify = require('millify')
const round = require('../utils/round')
const stars = require('../utils/stars')

module.exports = async function (method, ...args) {
  const endpoint = `https://services.addons.mozilla.org/en-US/firefox/api/1.5/addon/${args[0]}`
  const xml = await axios.get(endpoint).then(res => res.data)

  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {
      trim: true,
      explicitArray: false
    }, (err, res) => err ? reject(err) : resolve(res))
  }).then(({ addon }) => {
    switch (method) {
      case 'v':
        return {
          subject: 'mozilla add-on',
          status: 'v' + addon.version,
          color: addon.version[0] === '0' ? 'orange' : 'blue'
        }
      case 'users':
        return {
          subject: 'users',
          status: millify(parseInt(addon.daily_users)),
          color: 'green'
        }
      case 'rating':
        return {
          subject: 'rating',
          status: `${round(addon.rating, 2)}/5`,
          color: 'green'
        }
      case 'stars':
        return {
          subject: 'stars',
          status: stars(addon.rating),
          color: 'green'
        }
      case 'reviews':
        return {
          subject: 'reviews',
          status: addon.reviews.$.num,
          color: 'green'
        }
      default:
        return {
          subject: 'mozilla add-on',
          status: 'unknown',
          color: 'grey'
        }
    }
  })
}
