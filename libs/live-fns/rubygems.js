const millify = require('millify')

const axios = require('../axios.js')
const semColor = require('../utils/sem-color.js')
const v = require('../utils/version-formatter.js')

const preConditions = ['.rc', '.beta', '-rc', '-beta']

const pre = versions => versions.filter(v => {
  for (let condition of preConditions) {
    if (!v.includes(condition)) {
      return false
    }
  }

  return true
})

const stable = versions => versions.filter(v => {
  for (let condition of preConditions) {
    if (v.includes(condition)) {
      return false
    }
  }

  return true
})

const latest = versions => versions.length > 0 && versions.slice(-1)[0]

const request = async endpoint => {
  return axios.get(`https://rubygems.org/api/v1/${endpoint}.json`).then(res => res.data)
}

module.exports = async function (topic, gem, channel = 'stable') {
  let response

  if (topic !== 'v') {
    response = await request(`gems/${gem}`)
  }

  switch (topic) {
    case 'v':
      response = await request(`versions/${gem}`)

      const versions = Object
        .values(response)
        .map(value => value.number)
        .reverse()

      let version = ''

      switch (channel) {
        case 'latest':
          version = latest(versions)
          break
        case 'pre':
          version = latest(pre(versions))
          break
        default:
          version = latest(stable(versions))
      }

      version = version || latest(versions)

      return {
        subject: 'rubygems',
        status: v(version),
        color: semColor(version)
      }
    case 'dt':
      return {
        subject: 'downloads',
        status: millify(response.downloads),
        color: 'green'
      }
    case 'dv':
      return {
        subject: 'downloads',
        status: millify(response.version_downloads) + '/version',
        color: 'green'
      }
    case 'n':
      return {
        subject: 'rubygems',
        status: response.name,
        color: 'green'
      }
    case 'p':
      return {
        subject: 'platform',
        status: response.platform,
        color: 'green'
      }
    default:
      return {
        subject: 'rubygems',
        status: 'unknown',
        color: 'grey'
      }
  }
}
