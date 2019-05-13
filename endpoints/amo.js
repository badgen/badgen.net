const millify = require('millify')
const got = require('../libs/got.js')
const stars = require('../libs/utils/stars.js')
const semColor = require('../libs/utils/sem-color.js')
const v = require('../libs/utils/version-formatter.js')
const badgenServe = require('../libs/badgen-serve.js')

const examples = [
  '/amo/v/markdown-viewer-chrome',
  '/amo/users/markdown-viewer-chrome',
  '/amo/rating/markdown-viewer-chrome',
  '/amo/stars/markdown-viewer-chrome',
  '/amo/reviews/markdown-viewer-chrome',
]

const handlers = {
  '/amo/:topic/:name': handler
}

async function handler ({ topic, name }) {
  const endpoint = `https://addons.mozilla.org/api/v3/addons/addon/${name}/`
  const addon = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'v':
      return {
        subject: 'mozilla add-on',
        status: v(addon.current_version.version),
        color: semColor(addon.current_version.version)
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

module.exports = badgenServe(handlers, { examples })
