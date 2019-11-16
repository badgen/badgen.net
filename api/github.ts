import cheerio from 'cheerio'
import distanceToNow from 'date-fns/formatDistanceToNow'

import got from '../libs/got'
import { version, millify } from '../libs/utils'
import { createBadgenHandler, BadgenError, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'GitHub',
  examples: {
    '/github/release/babel/babel': 'latest release',
    '/github/release/babel/babel/stable': 'latest stable release',
    '/github/tag/micromatch/micromatch': 'latest tag',
    '/github/watchers/micromatch/micromatch': 'watchers',
    '/github/checks/tunnckoCore/opensource': 'combined checks (default branch)',
    '/github/status/micromatch/micromatch': 'combined statuses (default branch)',
    '/github/status/micromatch/micromatch/gh-pages': 'combined statuses (branch)',
    '/github/status/micromatch/micromatch/f4809eb6df80b': 'combined statuses (commit)',
    '/github/status/micromatch/micromatch/4.0.1': 'combined statuses (tag)',
    '/github/status/facebook/react/master/ci/circleci:%20lint': 'single status',
    '/github/status/facebook/react/master/coverage/coveralls': 'single status',
    '/github/status/zeit/hyper/master/ci': 'combined statuses (ci*)',
    '/github/status/zeit/hyper/master/ci/circleci': 'combined statuses (ci/circleci*)',
    '/github/status/zeit/hyper/master/ci/circleci:%20build': 'single status',
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
    '/github/assets-dl/electron/electron': 'assets downloads for latest release',
    '/github/assets-dl/electron/electron/v7.0.0': 'assets downloads for a tag',
    '/github/dependents-repo/micromatch/micromatch': 'repository depentents',
    '/github/dependents-pkg/micromatch/micromatch': 'package dependents',
  },
  handlers: {
    '/github/:topic<watchers|stars|forks|branches|releases|tags|tag|license>/:owner/:repo': repoStats,
    '/github/:topic<prs|open-prs|closed-prs|merged-prs>/:owner/:repo': repoStats,
    '/github/:topic<issues|open-issues|closed-issues>/:owner/:repo': repoStats,
    '/github/:topic<label-issues>/:owner/:repo/:label/:states?<open|closed>': repoStats,
    '/github/:topic<commits|last-commit>/:owner/:repo/:ref?': repoStats,
    '/github/:topic<dt|assets-dl>/:owner/:repo/:tag?': downloads, // `dt` is deprecated
    '/github/release/:owner/:repo/:channel?': release,
    '/github/checks/:owner/:repo/:ref?': checks,
    '/github/status/:owner/:repo/:ref?': status,
    '/github/status/:owner/:repo/:ref/:context+': status,
    '/github/contributors/:owner/:repo': contributors,
    '/github/dependents-repo/:owner/:repo': dependents('REPOSITORY'),
    '/github/dependents-pkg/:owner/:repo': dependents('PACKAGE'),
  }
})

const pickGithubToken = () => {
  const { GH_TOKENS } = process.env
  if (!GH_TOKENS) {
    throw new BadgenError({
      status: 'token required'
    })
  }

  const tokens = GH_TOKENS.split(',')
  return tokens[Math.floor(Math.random() * tokens.length)]
}

// request github api v3 (rest)
const restGithub = (path, preview = 'hellcat') => got.get(`https://api.github.com/${path}`, {
  headers: {
    Authorization: `token ${pickGithubToken()}`,
    Accept: `application/vnd.github.${preview}-preview+json`
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

// https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
const statesColor = {
  pending: 'orange',
  success: 'green',
  failure: 'red',
  error: 'red',
  unknown: 'grey'
}

function combined (states: Array<any>, stateKey: string = 'state') {
  if (states.length === 0) return 'unknown'
  if (states.find(x => x[stateKey] === 'error')) return 'error'
  if (states.find(x => x[stateKey] === 'failure')) return 'failure'
  if (states.find(x => x[stateKey] === 'pending')) return 'pending'
  if (states.every(x => x[stateKey] === 'success')) return 'success'

  // this shouldn't happen, but in case it happens
  throw new Error(`Unknown states: ${states.map(x => x.state).join()}`)
}

async function checks ({ owner, repo, ref = 'master'}: PathArgs) {
  const resp = await restGithub(`repos/${owner}/${repo}/commits/${ref}/check-runs`, 'antiope')
  const status = combined(resp.check_runs, 'conclusion')

  return {
    subject: 'checks',
    status: status,
    color: statesColor[status]
  }
}

async function status ({ owner, repo, ref = 'master', context }: PathArgs) {
  const resp = await restGithub(`repos/${owner}/${repo}/commits/${ref}/status`)

  let state = typeof context === 'string'
    ? resp!.statuses.filter(st => st.context.startsWith(context))
    : resp!.state

  if (Array.isArray(state)) {
    state = combined(state, 'state')
  }

  if (state) {
    return {
      subject: context || 'status',
      status: state,
      color: statesColor[state]
    }
  } else {
    return {
      subject: 'status',
      status: 'unknown',
      color: 'grey'
    }
  }
}

async function release ({ owner, repo, channel }: PathArgs) {
  const releases = await restGithub(`repos/${owner}/${repo}/releases`)

  if (!releases || !releases.length) {
    return {
      subject: 'release',
      status: 'none',
      color: 'yellow'
    }
  }

  const [latest] = releases
  const stable = releases.find(release => !release.prerelease)

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
        status: version(latest.name || latest.tag_name),
        color: latest.prerelease ? 'orange' : 'blue'
      }
  }
}

async function contributors ({ owner, repo }: PathArgs) {
  const contributors = await restGithub(`repos/${owner}/${repo}/contributors`)

  return {
    subject: 'contributors',
    status: contributors.length,
    color: 'blue'
  }
}

async function downloads ({ owner, repo, tag }: PathArgs) {
  const releaseSelection = tag ? `tags/${tag}` : 'latest'
  const release = await restGithub(`repos/${owner}/${repo}/releases/${releaseSelection}`)

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

    return queryGithub(query).then(res => res.data!.repository)
  }
}

async function repoStats ({topic, owner, repo, ...restArgs}: PathArgs) {
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
        status: result.label ? result.label.issues.totalCount : 0,
        color: result.label ? result.label.color : 'grey'
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
      const li = result.licenseInfo
      return {
        subject: topic,
        status: li ? li.spdxId : 'no license',
        color: li ? 'blue' : 'grey'
      }
    case 'last-commit':
      const commits = result.branch.target.history.nodes
      const lastDate = commits.length && new Date(commits[0].committedDate)
      const fromNow = lastDate && distanceToNow(lastDate, { addSuffix: true })
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

function dependents (type: string) {
  return async function ({ owner, repo }: PathArgs) {
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

const parseDependents = (html, type) => {
  const $ = cheerio.load(html)
  const depLink = $(`a[href$="?dependent_type=${type}"]`)

  if (depLink.length !== 1) {
    return 'unknown'
  }

  return depLink.text().replace(/[^0-9,]/g, '')
}
