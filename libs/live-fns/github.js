const cheerio = require('cheerio')
const distanceInWordsToNow = require('date-fns/distance_in_words_to_now')
const millify = require('millify')
const axios = require('../axios.js')
const token = process.env.GH_TOKEN

// https://developer.github.com/v3/repos/

module.exports = async (topic, ...args) => {
  switch (topic) {
    case 'watchers':
    case 'stars':
    case 'forks':
    case 'issues':
    case 'open-issues':
    case 'closed-issues':
    case 'prs':
    case 'open-prs':
    case 'closed-prs':
    case 'merged-prs':
    case 'commits':
    case 'branches':
    case 'releases':
    case 'tag':
    case 'license':
    case 'last-commit':
    case 'dt':
      return stats(topic, ...args)
    case 'release':
      return release(...args)
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

const queryGithub = (query, graphql = true) => {
  const headers = token ? { Authorization: `token ${token}` } : {}

  if (!graphql) {
    const url = `https://api.github.com/${query}`
    return axios({
      url,
      headers: {
        ...headers,
        Accept: 'application/vnd.github.hellcat-preview+json'
      }
    })
  }

  return axios.post('https://api.github.com/graphql', { query }, {
    headers: {
      ...headers,
      Accept: 'application/vnd.github.hawkgirl-preview+json'
    }
  })
}

const release = async (user, repo, channel) => {
  const { data: releases } = await queryGithub(`repos/${user}/${repo}/releases`, false)

  const [latest] = releases
  const stable = releases.find(release => !release.prerelease)

  if (!latest) {
    return {
      subject: 'release',
      status: 'none',
      color: 'yellow'
    }
  }

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

const stats = async (topic, user, repo, ...args) => {
  let query = ''
  let graphqlQuery = true
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
    case 'prs':
      query = `pullRequests { totalCount }`
      break
    case 'open-prs':
      query = `pullRequests(states:[OPEN]) { totalCount }`
      break
    case 'closed-prs':
      query = `pullRequests(states:[CLOSED]) { totalCount }`
      break
    case 'merged-prs':
      query = `pullRequests(states:[MERGED]) { totalCount }`
      break
    case 'commits':
      query = `commitComments { totalCount }`
      break
    case 'branches':
      query = `repos/${user}/${repo}/branches`
      graphqlQuery = false
      break
    case 'releases':
      query = `releases { totalCount }`
      break
    case 'tag':
      query = `repos/${user}/${repo}/tags`
      graphqlQuery = false
      break
    case 'license':
      query = `licenseInfo { spdxId }`
      break
    case 'last-commit':
      query = `repos/${user}/${repo}/commits${args[0] ? `?sha=${args[0]}` : ''}`
      graphqlQuery = false
      break
    case 'dt':
      query = `repos/${user}/${repo}/releases/${args[0] || 'latest'}`
      graphqlQuery = false
      break
  }

  if (graphqlQuery) {
    query = `
      query {
        repository(owner:"${user}", name:"${repo}") {
          ${query}
        }
      }
    `
  }

  const { data, errors } = await queryGithub(query, graphqlQuery)

  if (errors) {
    console.error(JSON.stringify(errors))
    return { subject: topic }
  }

  switch (topic) {
    case 'watchers':
    case 'forks':
    case 'issues':
    case 'releases':
      return {
        subject: topic,
        status: data.data.repository[topic].totalCount,
        color: 'blue'
      }
    case 'stars':
      return {
        subject: topic,
        status: data.data.repository.stargazers.totalCount,
        color: 'blue'
      }
    case 'open-issues':
      return {
        subject: 'open issues',
        status: data.data.repository.issues.totalCount,
        color: data.data.repository.issues.totalCount === 0 ? 'green' : 'orange'
      }
    case 'closed-issues':
      return {
        subject: 'closed issues',
        status: data.data.repository.issues.totalCount,
        color: 'blue'
      }
    case 'prs':
      return {
        subject: 'PRs',
        status: data.data.repository.pullRequests.totalCount,
        color: 'blue'
      }
    case 'open-prs':
      return {
        subject: 'open PRs',
        status: data.data.repository.pullRequests.totalCount,
        color: 'blue'
      }
    case 'closed-prs':
      return {
        subject: 'closed PRs',
        status: data.data.repository.pullRequests.totalCount,
        color: 'blue'
      }
    case 'merged-prs':
      return {
        subject: 'merged PRs',
        status: data.data.repository.pullRequests.totalCount,
        color: 'blue'
      }
    case 'commits':
      return {
        subject: topic,
        status: data.data.repository.commitComments.totalCount,
        color: 'blue'
      }
    case 'branches':
      return {
        subject: topic,
        status: data.length,
        color: 'blue'
      }
    case 'tag':
      return {
        subject: 'latest tag',
        status: data.length > 0 && data[0].name ? data[0].name : 'unknown',
        color: 'blue'
      }
    case 'license':
      return {
        subject: topic,
        status: data.data.repository.licenseInfo.spdxId,
        color: 'blue'
      }
    case 'last-commit':
      const date = data.length > 0
        ? distanceInWordsToNow(new Date(data[0].commit.author.date), { addSuffix: true })
        : 'none'

      return {
        subject: 'last commit',
        status: date,
        color: 'green'
      }
    case 'dt':
      /* eslint-disable camelcase */
      const downloadCount = data && data.assets.length > 0
        ? data.assets.reduce((result, { download_count }) => result + download_count, 0)
        : 0

      return {
        subject: 'downloads',
        status: millify(downloadCount),
        color: 'green'
      }
    default:
      return {
        subject: 'github',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}

const parseDependents = (html, type) => {
  const $ = cheerio.load(html)
  const depLink = $(`a[href$="?dependent_type=${type}"]`)
  if (depLink.length !== 1) return -1
  return depLink.text().replace(/[^0-9,]/g, '')
}

const dependents = async (type, user, repo) => {
  const html = await axios({
    url: `https://github.com/${user}/${repo}/network/dependents`,
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml'
    }
  }).then(res => res.data)

  return {
    subject: type === 'PACKAGE' ? 'pkg dependents' : 'repo dependents',
    status: parseDependents(html, type),
    color: 'blue'
  }
}
