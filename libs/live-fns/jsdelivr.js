const got = require('../got.js')
const millify = require('millify')
const semColor = require('../utils/sem-color.js')

module.exports = async (topic, type, ...name) => {
  if (!['hits', 'rank', 'v'].includes(topic)) {
    return {
      subject: 'jsDelivr',
      status: 'unknown topic',
      color: 'grey'
    }
  }

  const pkg = name.join('/')

  switch (topic) {
    case 'hits':
      return stats('hits', type, pkg)
    case 'rank':
      return stats('rank', type, pkg)
    case 'v':
      return version(pkg)
  }
}

const stats = async (metric, type, name) => {
  const endpoint = `https://data.jsdelivr.com/v1/package/${type}/${name}/stats`
  const { total, rank } = await got(endpoint).then(res => res.body)

  switch (metric) {
    case 'hits':
      return {
        subject: 'jsDelivr',
        status: `${millify(total)}/month`,
        color: 'green'
      }
    case 'rank':
      return {
        subject: 'jsDelivr rank',
        status: rank ? `#${rank}` : 'none',
        color: rank ? 'blue' : 'grey'
      }
  }
}

const version = async (name) => {
  const endpoint = `https://cdn.jsdelivr.net/npm/${name}/package.json`
  const { version } = await got(endpoint).then(res => res.body)
  return {
    subject: 'jsDelivr',
    status: `v${version}`,
    color: semColor(version)
  }
}
