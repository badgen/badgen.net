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
    case 'stars':
      return stats('stargazers', ...args)
    case 'forks':
      return stats('forks', ...args)
    case 'watchers':
      return stats('watchers', ...args)
    case 'open-issues':
      return issues('open', ...args)
    case 'issues':
      return issues('all', ...args)
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

function parseDependents (html, type) {
  const $ = cheerio.load(html)
  const depLink = $(`a[href$="?dependent_type=${type}"]`)
  if (depLink.length !== 1) return -1
  return depLink.text().replace(/[^0-9,]/g, '')
}

function queryGithub (query) {
  return axios.post('https://api.github.com/graphql', { query }, {
    headers: {
      'Accept': 'application/vnd.github.hawkgirl-preview+json',
      'Authorization': `bearer ${token}`
    }
  }).then(res => res.data)
}

async function issues (filter, user, repo) {
  const queryFilter = filter === 'open' ? '(states:[OPEN])' : ''
  const { data, errors } = await queryGithub(`
    query {
      repository(owner:"${user}", name:"${repo}") {
        issues${queryFilter} {
          totalCount
        }
      }
    }
  `)

  if (errors) {
    console.error(JSON.stringify(errors))
    return { subject: 'issues' }
  } else {
    return {
      subject: filter === 'open' ? 'open issues' : 'issues',
      status: data.repository.issues.totalCount,
      color: filter === 'open' ? 'orange' : 'blue'
    }
  }
}

async function stats (topic, user, repo) {
  const { data, errors } = await queryGithub(`
    query {
      repository(owner:"${user}", name:"${repo}") {
        forks {
          totalCount
        }
        stargazers {
          totalCount
        }
        watchers {
          totalCount
        }
      }
    }
  `)

  if (errors) {
    console.error(JSON.stringify(errors))
    return { subject: topic }
  } else {
    return {
      subject: topic.replace('stargazers', 'stars'),
      status: data.repository[topic].totalCount,
      color: 'blue'
    }
  }
}
