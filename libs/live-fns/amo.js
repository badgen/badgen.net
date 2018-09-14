const xml2js = require('xml2js')
const got = require('../got.js')
const millify = require('millify')
const stars = require('../utils/stars.js')
const semColor = require('../utils/sem-color.js')
const v = require('../utils/version-formatter.js')

module.exports = async (topic, name) => {
  const endpoint = `https://services.addons.mozilla.org/en-US/firefox/api/1.5/addon/${name}`
  const xml = await got(endpoint, { json: false }).then(res => res.body)

  const { addon } = await new Promise((resolve, reject) => {
    xml2js.parseString(xml, {
      trim: true,
      explicitArray: false
    }, (err, res) => err ? reject(err) : resolve(res))
  })

  switch (topic) {
    case 'v':
      return {
        subject: 'mozilla add-on',
        status: v(addon.version),
        color: semColor(addon.version)
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
        status: `${Number(addon.rating).toFixed(2)}/5`,
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
}
