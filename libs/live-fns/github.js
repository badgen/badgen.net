const cheerio = require('cheerio')
const axios = require('../axios.js')
const token = process.env.GH_TOKEN

// https://developer.github.com/v3/repos/

module.exports = async function (topic, ...args) {
  switch (topic) {
    case 'release':
      return release(...args)
    case 'tag':
      return tag(...args)
    case 'watchers':
    case 'stars':
    case 'forks':
    case 'issues':
    case 'open-issues':
    case 'closed-issues':
    case 'license':
      return stats(topic, ...args)
    case 'dependents-repo':
      return dependents('REPOSITORY', ...args)
    case 'dependents-pkg':
      return dependents('PACKAGE', ...args)
    default:
      return {
        subject: 'github',
        status: 'unknown topic',
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

function queryGithub (query) {
  return axios.post('https://api.github.com/graphql', { query }, {
    headers: {
      'Accept': 'application/vnd.github.hawkgirl-preview+json',
      'Authorization': `bearer ${token}`
    }
  }).then(res => res.data)
}

async function stats (topic, user, repo) {
  let query = ''
  switch (topic) {
    case 'watchers':
      query = `watchers { totalCount }`
      break
    case 'stars':
      query = `stargazers { totalCount }`
      break
    case 'forks':
      query = `forks { totalCount }`
      break
    case 'issues':
      query = `issues { totalCount }`
      break
    case 'open-issues':
      query = `issues(states:[OPEN]) { totalCount }`
      break
    case 'closed-issues':
      query = `issues(states:[CLOSED]) { totalCount }`
      break
    case 'license':
      query = `licenseInfo { spdxId }`
      break
  }

  const { data, errors } = await queryGithub(`
    query {
      repository(owner:"${user}", name:"${repo}") {
        ${query}
      }
    }
  `)

  if (errors) {
    console.error(JSON.stringify(errors))
    return { subject: topic }
  }

  switch (topic) {
    case 'watchers':
    case 'forks':
    case 'issues':
      return {
        subject: topic,
        status: data.repository[topic].totalCount,
        color: 'blue'
      }
    case 'stars':
      return {
        subject: topic,
        status: data.repository.stargazers.totalCount,
        color: 'blue'
      }
    case 'open-issues':
      return {
        subject: 'open issues',
        status: data.repository.issues.totalCount,
        color: 'orange'
      }
    case 'closed-issues':
      return {
        subject: 'closed issues',
        status: data.repository.issues.totalCount,
        color: 'blue'
      }
    case 'license':
      return {
        subject: topic,
        status: data.repository.licenseInfo.spdxId,
        color: 'blue'
      }
    default:
      return {
        subject: 'github',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}

function parseDependents (html, type) {
  const $ = cheerio.load(html)
  const depLink = $(`a[href$="?dependent_type=${type}"]`)
  if (depLink.length !== 1) return -1
  return depLink.text().replace(/[^0-9,]/g, '')
}

async function dependents (type, user, repo) {
  const html = await axios({
    url: `https://github.com/${user}/${repo}/network/dependents`,
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml'
    }
  }).then(res => res.data)

  return {
    subject: type === 'PACKAGE' ? 'pkg dependents' : 'repo dependents',
    status: parseDependents(html, type),
    color: 'blue'
  }
}
