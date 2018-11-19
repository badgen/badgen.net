const got = require('../got.js')
const millify = require('millify')

module.exports = async (topic, type, ...name) => {
  if (!['stats', 'rank'].includes(topic)) {
    return {
      subject: 'jsDelivr',
      status: 'unknown topic',
      color: 'grey'
    }
  }

  const pkg = name.join('/')
  const endpoint = `https://data.jsdelivr.com/v1/package/${type}/${pkg}/stats`
  const { total, rank } = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'stats':
      return {
        subject: 'jsDelivr',
        status: `${millify(total)}/month`,
        color: 'green'
      }
    case 'rank':
      return {
        subject: 'jsDelivr rank',
        status: rank || 'none',
        color: rank ? 'blue' : 'grey'
      }
  }
}
