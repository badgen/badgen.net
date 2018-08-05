const axios = require('../axios.js')
const token = process.env.GH_TOKEN

// https://developer.github.com/v3/repos/

module.exports = async function (topic, ...args) {
  switch (topic) {
    case 'release':
      return release(...args)
    case 'tag':
      return tag(...args)
    default:
      return {
        subject: 'github',
        status: 'unknown',
        color: 'grey'
      }
  }
}

async function release (user, repo, channel) {
  const url = `https://api.github.com/repos/${user}/${repo}/releases`
  const headers = token && { 'Authorization': `token ${token}` }

  const logs = await axios({ url, headers }).then(res => res.data)

  const [latest] = logs
  const stable = logs.find(log => !log.prerelease)

  switch (channel) {
    case 'stable':
      return {
        subject: 'release',
        status: stable.name || stable.tag_name || 'stable',
        color: 'blue'
      }
    default:
      return {
        subject: 'release',
        status: latest.name || latest.tag_name || 'unknown',
        color: latest.prerelease === true ? 'orange' : 'blue'
      }
  }
}

async function tag (user, repo) {
  const endpoint = `https://api.github.com/repos/${user}/${repo}/tags`
  const [latest] = await axios.get(endpoint).then(res => res.data)

  return {
    subject: 'latest tag',
    status: latest.name || 'unknown',
    color: 'blue'
  }
}
