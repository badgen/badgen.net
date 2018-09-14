const millify = require('millify')
const got = require('../got.js')
const v = require('../utils/version-formatter.js')
const semColor = require('../utils/sem-color.js')

// https://atom.io/api/packages/*

module.exports = async (topic, ...args) => {
  switch (topic) {
    case 'v':
      return pkg('version', args)
    case 'dl':
      return pkg('downloads', args)
    case 'license':
      return pkg('license', args)
    case 'stars':
      return pkg('stars', args)
    default:
      return {
        subject: 'apm',
        status: 'unknown',
        color: 'grey'
      }
  }
}

const pkg = async (topic, args) => {
  let pkg = args[0]

  const endpoint = `https://atom.io/api/packages/${pkg}`
  const meta = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'version': {
      return {
        subject: `apm`,
        status: v(meta.releases.latest),
        color: semColor(meta.releases.latest)
      }
    }
    case 'license': {
      return {
        subject: 'license',
        status: meta.versions[meta.releases.latest].license || 'unknown',
        color: 'blue'
      }
    }
    case 'downloads': {
      return {
        subject: 'downloads',
        status: millify(meta.downloads),
        color: 'green'
      }
    }
    case 'stars': {
      return {
        subject: 'stars',
        status: millify(meta.stargazers_count),
        color: 'green'
      }
    }
    default: {
      return {
        subject: 'apm',
        status: 'unknown',
        color: 'grey'
      }
    }
  }
}
