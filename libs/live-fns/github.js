const cheerio = require('cheerio')
const distanceInWordsToNow = require('date-fns/distance_in_words_to_now')
const millify = require('millify')
const axios = require('../axios.js')
const got = require('../got.js')
const v = require('../utils/version-formatter.js')

const token = process.env.GH_TOKEN
const tokenHeader = token ? { Authorization: `token ${token}` } : {}

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
    case 'tags':
    case 'tag':
    case 'license':
    case 'last-commit':
      return stats(topic, ...args)
    case 'dt': // deprecated
    case 'dl':
      return downloads(args[0], args[1], '/latest')
    case 'release':
      return release(...args)
    case 'dependents-repo':
      return dependents('REPOSITORY', ...args)
    case 'dependents-pkg':
      return dependents('PACKAGE', ...args)
    case 'contributors':
      return contributors(...args)
    default:
      return {
        subject: 'github',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}

// query github api v3 (rest)
const restGithub = path => got(`https://api.github.com/${path}`, {
  headers: {
    ...tokenHeader,
    Accept: 'application/vnd.github.hellcat-preview+json'
  }
}).then(res => res.body)

// query github api v4 (graphql)
const queryGithub = query => {
  return got.post('https://api.github.com/graphql', {
    body: { query },
    headers: {
      ...tokenHeader,
      Accept: 'application/vnd.github.hawkgirl-preview+json'
    }
  }).then(res => res.body)
}

const release = async (user, repo, channel) => {
  const releases = await restGithub(`repos/${user}/${repo}/releases`)

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
        status: v(stable ? stable.name || stable.tag_name : null),
        color: 'blue'
      }
    default:
      return {
        subject: 'release',
        status: v(latest ? latest.name || latest.tag_name : null),
        color: latest.prerelease === true ? 'orange' : 'blue'
      }
  }
}

const contributors = async (user, repo) => {
  const contributors = await restGithub(`repos/${user}/${repo}/contributors`)

  return {
    subject: 'contributors',
    status: contributors.length,
    color: 'blue'
  }
}

const downloads = async (user, repo, scope = '') => {
  const release = await restGithub(`repos/${user}/${repo}/releases${scope}`)

  if (!release || !release.assets || !release.assets.length) {
    return {
      subject: 'downloads',
      status: 'no assets',
      color: 'grey'
    }
  }

  /* eslint-disable camelcase */
  const downloadCount = release.assets.reduce((result, { download_count }) => {
    return result + download_count
  }, 0)

  return {
    subject: 'downloads',
    status: millify(downloadCount),
    color: 'green'
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
      query = `pullRequests(states:[CLOSED, MERGED]) { totalCount }`
      break
    case 'merged-prs':
      query = `pullRequests(states:[MERGED]) { totalCount }`
      break
    case 'commits':
      query = `
        branch: ref(qualifiedName: "${args[0] || 'master'}") {
          target {
            ... on Commit {
              history(first: 0) {
                totalCount
              }
            }
          }
        }
      `
      break
    case 'branches':
      query = `
        refs(first: 0, refPrefix: "refs/heads/") {
          totalCount
        }
      `
      break
    case 'releases':
      query = `releases { totalCount }`
      break
    case 'tags':
      query = `
        refs(first: 0, refPrefix: "refs/tags/") {
          totalCount
        }
      `
      break
    case 'tag':
      query = `
        refs(first: 1, refPrefix: "refs/tags/") {
          edges {
            node {
              name
            }
          }
        }
      `
      break
    case 'license':
      query = `licenseInfo { spdxId }`
      break
    case 'last-commit':
      query = `
        branch: ref(qualifiedName: "${args[0] || 'master'}") {
          target {
            ... on Commit {
              history(first: 1) {
                nodes {
                  committedDate
                }
              }
            }
          }
        }
      `
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

  const data = await queryGithub(query, graphqlQuery)

  switch (topic) {
    case 'watchers':
    case 'forks':
    case 'issues':
    case 'releases':
      return {
        subject: topic,
        status: millify(data.data.repository[topic].totalCount),
        color: 'blue'
      }
    case 'branches':
    case 'tags':
      return {
        subject: topic,
        status: millify(data.data.repository.refs.totalCount),
        color: 'blue'
      }
    case 'stars':
      return {
        subject: topic,
        status: millify(data.data.repository.stargazers.totalCount),
        color: 'blue'
      }
    case 'open-issues':
      return {
        subject: 'open issues',
        status: millify(data.data.repository.issues.totalCount),
        color: data.data.repository.issues.totalCount === 0 ? 'green' : 'orange'
      }
    case 'closed-issues':
      return {
        subject: 'closed issues',
        status: millify(data.data.repository.issues.totalCount),
        color: 'blue'
      }
    case 'prs':
      return {
        subject: 'PRs',
        status: millify(data.data.repository.pullRequests.totalCount),
        color: 'blue'
      }
    case 'open-prs':
      return {
        subject: 'open PRs',
        status: millify(data.data.repository.pullRequests.totalCount),
        color: 'blue'
      }
    case 'closed-prs':
      return {
        subject: 'closed PRs',
        status: millify(data.data.repository.pullRequests.totalCount),
        color: 'blue'
      }
    case 'merged-prs':
      return {
        subject: 'merged PRs',
        status: millify(data.data.repository.pullRequests.totalCount),
        color: 'blue'
      }
    case 'commits':
      return {
        subject: topic,
        status: millify(data.data.repository.branch.target.history.totalCount),
        color: 'blue'
      }
    case 'tag':
      const tags = data.data.repository.refs.edges
      const latestTag = tags.length > 0 ? tags[0].node.name : null

      return {
        subject: 'latest tag',
        status: v(latestTag),
        color: 'blue'
      }
    case 'license':
      return {
        subject: topic,
        status: data.data.repository.licenseInfo.spdxId,
        color: 'blue'
      }
    case 'last-commit':
      const commits = data.data.repository.branch.target.history.nodes
      const date = commits.length > 0
        ? distanceInWordsToNow(new Date(commits[0].committedDate), { addSuffix: true })
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
