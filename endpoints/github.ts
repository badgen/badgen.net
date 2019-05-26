import cheerio from 'cheerio'
import distanceToNow from 'date-fns/distance_in_words_to_now'

import got from '../libs/got'
import { version, millify } from '../libs/utils'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'GitHub',
  examples: {
    '/github/release/babel/babel': 'latest release',
    '/github/release/babel/babel/stable': 'latest stable release',
    '/github/tag/micromatch/micromatch': 'latest tag',
    '/github/watchers/micromatch/micromatch': 'watchers',
    '/github/status/micromatch/micromatch': 'status',
    '/github/status/micromatch/micromatch/gh-pages': 'status (branch)',
    '/github/status/micromatch/micromatch/f4809eb6df80b': 'status (commit)',
    '/github/stars/micromatch/micromatch': 'stars',
    '/github/forks/micromatch/micromatch': 'forks',
    '/github/issues/micromatch/micromatch': 'issues',
    '/github/open-issues/micromatch/micromatch': 'open issues',
    '/github/closed-issues/micromatch/micromatch': 'closed issues',
    '/github/label-issues/nodejs/node/ES%20Modules': 'issues by label',
    '/github/label-issues/atom/atom/help-wanted/open': 'open issues by label',
    '/github/label-issues/rust-lang/rust/B-RFC-approved/closed': 'closed issues by label',
    '/github/prs/micromatch/micromatch': 'PRs',
    '/github/open-prs/micromatch/micromatch': 'open PRs',
    '/github/closed-prs/micromatch/micromatch': 'closed PRs',
    '/github/merged-prs/micromatch/micromatch': 'merged PRs',
    '/github/commits/micromatch/micromatch': 'commits count',
    '/github/commits/micromatch/micromatch/gh-pages': 'commits count (branch ref)',
    '/github/commits/micromatch/micromatch/4.0.1': 'commits count (tag ref)',
    '/github/last-commit/micromatch/micromatch': 'last commit',
    '/github/last-commit/micromatch/micromatch/gh-pages': 'last commit (branch ref)',
    '/github/last-commit/micromatch/micromatch/4.0.1': 'last commit (tag ref)',
    '/github/branches/micromatch/micromatch': 'branches',
    '/github/releases/micromatch/micromatch': 'releases',
    '/github/tags/micromatch/micromatch': 'tags',
    '/github/license/micromatch/micromatch': 'license',
    '/github/contributors/micromatch/micromatch': 'contributers',
    '/github/assets-dl/electron/electron': 'latest assets downloads',
    '/github/dependents-repo/micromatch/micromatch': 'repository depentents',
    '/github/dependents-pkg/micromatch/micromatch': 'package dependents',
  }
}

export const handlers: Handlers = {
  '/github/:topic<watchers|stars|forks|branches|releases|tags|tag|license>/:owner/:repo': repoStats,
  '/github/:topic<prs|open-prs|closed-prs|merged-prs>/:owner/:repo': repoStats,
  '/github/:topic<issues|open-issues|closed-issues>/:owner/:repo': repoStats,
  '/github/:topic<label-issues>/:owner/:repo/:label/:states?<open|closed>': repoStats,
  '/github/:topic<commits|last-commit>/:owner/:repo/:ref?': repoStats,
  '/github/:topic<release>/:owner/:repo/:channel?': release,
  '/github/:topic<dt|assets-dl>/:owner/:repo/:scope?': downloads, // `dt` is deprecated
  '/github/:topic<status>/:owner/:repo/:ref?': singleStatus,
  '/github/:topic<contributors>/:owner/:repo': contributors,
  '/github/:topic<dependents-repo>/:owner/:repo': dependents('REPOSITORY'),
  '/github/:topic<dependents-pkg>/:owner/:repo': dependents('PACKAGE'),
}

const pickGithubToken = () => {
  const { GH_TOKEN } = process.env
  if (!GH_TOKEN) {
    throw new Error('Missing GH_TOKEN')
  }

  const tokens = GH_TOKEN.split(',')
  return tokens[Math.floor(Math.random() * tokens.length)]
}

// request github api v3 (rest)
const restGithub = path => got.get(`https://api.github.com/${path}`, {
  headers: {
    Authorization: `token ${pickGithubToken()}`,
    Accept: 'application/vnd.github.hellcat-preview+json'
  }
}).then(res => res.body)

// request github api v4 (graphql)
const queryGithub = query => {
  return got.post('https://api.github.com/graphql', {
    body: { query },
    headers: {
      Authorization: `token ${pickGithubToken()}`,
      Accept: 'application/vnd.github.hawkgirl-preview+json'
    }
  }).then(res => res.body)
}

async function singleStatus ({ owner, repo, ref = 'master' }: Args) {
  const statuses = await restGithub(`repos/${owner}/${repo}/commits/${ref}/status`)

  switch (statuses.state) {
    case 'success':
      return {
        subject: 'status',
        status: 'success',
        color: 'green'
      }
    case 'error':
      return {
        subject: 'status',
        status: 'error',
        color: 'red'
      }
    case 'failure':
      return {
        subject: 'status',
        status: 'failure',
        color: 'red'
      }
    case 'pending':
      return {
        subject: 'status',
        status: 'pending',
        color: 'orange'
      }
    default:
      return {
        subject: 'status',
        status: 'unknown',
        color: 'grey'
      }
  }
}

async function release ({ owner, repo, channel }: Args) {
  const releases = await restGithub(`repos/${owner}/${repo}/releases`)

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
        status: version(stable ? stable.name || stable.tag_name : null),
        color: 'blue'
      }
    default:
      return {
        subject: 'release',
        status: version(latest ? latest.name || latest.tag_name : null),
        color: latest.prerelease === true ? 'orange' : 'blue'
      }
  }
}

async function contributors ({ owner, repo }: Args) {
  const contributors = await restGithub(`repos/${owner}/${repo}/contributors`)

  return {
    subject: 'contributors',
    status: contributors.length,
    color: 'blue'
  }
}

async function downloads ({ owner, repo, scope = '' }: Args) {
  const release = await restGithub(`repos/${owner}/${repo}/releases${scope}`)

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

const makeRepoQuery = (topic, owner, repo, restArgs) => {
  const repoQueryBodies = {
    'license': 'licenseInfo { spdxId }',
    'watchers': 'watchers { totalCount }',
    'stars': 'stargazers { totalCount }',
    'forks': 'forks { totalCount }',
    'issues': 'issues { totalCount }',
    'open-issues': 'issues(states:[OPEN]) { totalCount }',
    'closed-issues': 'issues(states:[CLOSED]) { totalCount }',
    'prs': 'pullRequests { totalCount }',
    'open-prs': 'pullRequests(states:[OPEN]) { totalCount }',
    'closed-prs': 'pullRequests(states:[CLOSED, MERGED]) { totalCount }',
    'merged-prs': 'pullRequests(states:[MERGED]) { totalCount }',
    'branches': 'refs(first: 0, refPrefix: "refs/heads/") { totalCount }',
    'releases': 'releases { totalCount }',
    'tags': 'refs(first: 0, refPrefix: "refs/tags/") { totalCount }',
    'tag': `refs(last: 1, refPrefix: "refs/tags/") {
      edges {
        node {
          name
        }
      }
    }`
  }

  let queryBody
  switch (topic) {
    case 'label-issues':
      const { label, states } = restArgs
      const issueFilter = states ? `(states:[${states.toUpperCase()}])` : ''
      queryBody = `label(name:"${label}") { color, issues${issueFilter} { totalCount } }`
      break
    case 'commits':
      queryBody = `
        branch: ref(qualifiedName: "${restArgs.ref || 'master'}") {
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
    case 'last-commit':
      queryBody = `
        branch: ref(qualifiedName: "${restArgs.ref || 'master'}") {
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
    default:
      queryBody = repoQueryBodies[topic]
  }

  if (queryBody) {
    const query = `
      query {
        repository(owner:"${owner}", name:"${repo}") {
          ${queryBody}
        }
      }
    `

    return queryGithub(query).then(res => res.data.repository)
  }
}

async function repoStats ({topic, owner, repo, ...restArgs}: Args) {
  if (!process.env.GH_TOKEN) {
    return {
      subject: 'github',
      status: 'token required',
      color: 'grey'
    }
  }

  const result = await makeRepoQuery(topic, owner, repo, restArgs)

  if (!result) {
    return {
      subject: 'github',
      status: 'not found',
      color: 'grey'
    }
  }

  switch (topic) {
    case 'watchers':
    case 'forks':
    case 'issues':
    case 'releases':
      return {
        subject: topic,
        status: millify(result[topic].totalCount),
        color: 'blue'
      }
    case 'branches':
    case 'tags':
      return {
        subject: topic,
        status: millify(result.refs.totalCount),
        color: 'blue'
      }
    case 'stars':
      return {
        subject: topic,
        status: millify(result.stargazers.totalCount),
        color: 'blue'
      }
    case 'open-issues':
      return {
        subject: 'open issues',
        status: millify(result.issues.totalCount),
        color: result.issues.totalCount === 0 ? 'green' : 'orange'
      }
    case 'closed-issues':
      return {
        subject: 'closed issues',
        status: millify(result.issues.totalCount),
        color: 'blue'
      }
    case 'label-issues':
      return {
        subject: `${restArgs.label}`,
        status: result.label.issues.totalCount,
        color: result.label.color
      }
    case 'prs':
      return {
        subject: 'PRs',
        status: millify(result.pullRequests.totalCount),
        color: 'blue'
      }
    case 'open-prs':
      return {
        subject: 'open PRs',
        status: millify(result.pullRequests.totalCount),
        color: 'blue'
      }
    case 'closed-prs':
      return {
        subject: 'closed PRs',
        status: millify(result.pullRequests.totalCount),
        color: 'blue'
      }
    case 'merged-prs':
      return {
        subject: 'merged PRs',
        status: millify(result.pullRequests.totalCount),
        color: 'blue'
      }
    case 'commits':
      return {
        subject: topic,
        status: millify(result.branch.target.history.totalCount),
        color: 'blue'
      }
    case 'tag':
      const tags = result.refs.edges
      const latestTag = tags.length > 0 ? tags[0].node.name : null
      return {
        subject: 'latest tag',
        status: version(latestTag),
        color: 'blue'
      }
    case 'license':
      return {
        subject: topic,
        status: result.licenseInfo.spdxId,
        color: 'blue'
      }
    case 'last-commit':
      const commits = result.branch.target.history.nodes
      const lastDate = commits.length && new Date(commits[0].committedDate)
      const fromNow = lastDate && distanceToNow(lastDate, { addSuffix: true })
      console.log(commits)
      return {
        subject: 'last commit',
        status: fromNow || 'none',
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

function dependents (type: string) {
  return async function ({ owner, repo }: Args) {
    const html = await got(`https://github.com/${owner}/${repo}/network/dependents`, {
      // @ts-ignore
      json: false,
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml'
      }
    }).then(res => res.body)

    return {
      subject: type === 'PACKAGE' ? 'pkg dependents' : 'repo dependents',
      status: parseDependents(html, type),
      color: 'blue'
    }
  }
}

export default badgenServe(handlers)
