import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'

import got from 'libs/got'
import { restGithub, queryGithub } from 'libs/github'
import { createBadgenHandler, PathArgs, BadgenError } from 'libs/create-badgen-handler-next'
import { coverageColor, millify, version } from 'libs/utils'

type DependentsType = 'REPOSITORY' | 'PACKAGE'

export default createBadgenHandler({
  title: 'GitHub',
  examples: {
    '/github/license/micromatch/micromatch': 'license',
    '/github/watchers/micromatch/micromatch': 'watchers',
    '/github/branches/micromatch/micromatch': 'branches',
    '/github/releases/micromatch/micromatch': 'releases',
    '/github/tags/micromatch/micromatch': 'tags',
    '/github/tag/micromatch/micromatch': 'latest tag',
    '/github/contributors/micromatch/micromatch': 'contributors',
    '/github/release/babel/babel': 'latest release',
    '/github/release/babel/babel/stable': 'latest stable release',
    '/github/checks/nodejs/node': 'combined checks conclusion (default branch)',
    '/github/checks/nodejs/node/canary-base': 'combined checks conclusion (specified branch)',
    '/github/checks/nodejs/node/v18.0.0': 'combined checks conclusion (specified tag)',
    '/github/checks/nodejs/node/main/lint-cpp': 'single check (by job name)',
    '/github/checks/nodejs/node/main/lint-cpp?label=Lint%20CPP': 'single check (lint job)',
    '/github/checks/nodejs/node/main/test-linux': 'single check (test job)',
    '/github/checks/nodejs/node/main/build-windows%20(windows-2022)': 'single check (by job name)',
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
    '/github/milestones/chrislgarry/Apollo-11/1': 'milestone percentage',
    '/github/commits/micromatch/micromatch': 'commits count',
    '/github/commits/micromatch/micromatch/gh-pages': 'commits count (branch ref)',
    '/github/commits/micromatch/micromatch/4.0.1': 'commits count (tag ref)',
    '/github/last-commit/micromatch/micromatch': 'last commit',
    '/github/last-commit/micromatch/micromatch/gh-pages': 'last commit (branch ref)',
    '/github/last-commit/micromatch/micromatch/4.0.1': 'last commit (tag ref)',
    '/github/assets-dl/electron/electron': 'assets downloads for latest release',
    '/github/assets-dl/electron/electron/v7.0.0': 'assets downloads for a tag',
    '/github/dependents-repo/micromatch/micromatch': 'repository dependents',
    '/github/dependents-pkg/micromatch/micromatch': 'package dependents',
    '/github/dependabot/ubuntu/yaru': 'dependabot status',
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
    '/github/checks/:owner/:repo/:ref/:check_name+': checks,
    '/github/contributors/:owner/:repo': contributors,
    '/github/milestones/:owner/:repo/:milestone_number': milestones,
    '/github/dependents-repo/:owner/:repo': dependents('REPOSITORY'),
    '/github/dependents-pkg/:owner/:repo': dependents('PACKAGE'),
    '/github/dependabot/:owner/:repo': dependabotStatus,
  }
})

// https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
const statesColor = {
  pending: 'orange',
  success: 'green',
  failure: 'red',
  error: 'red',
  unknown: 'grey'
}

// https://docs.github.com/en/rest/checks/runs#list-check-runs-for-a-git-reference
function combined (states: Array<any>, stateKey: string = 'state') {
  if (states.length === 0) return 'unknown'

  if (states.find(x => x[stateKey] === 'failure')) return 'failure'
  if (states.find(x => x[stateKey] === 'timed_out')) return 'timed_out'
  if (states.find(x => x[stateKey] === 'action_required')) return 'action_required'

  const succeeded = states
    .filter(x => x[stateKey] !== 'neutral')
    .filter(x => x[stateKey] !== 'cancelled')
    .filter(x => x[stateKey] !== 'skipped')
    .every(x => x[stateKey] === 'success')

  if (succeeded) return 'success'

  // this shouldn't happen, but in case it happens
  throw new Error(`Unknown states: ${states.map(x => x[stateKey]).join()}`)
}

async function checks ({owner, repo, ref, check_name}: PathArgs) {
  if (!ref) {
    const resp = await restGithub(`repos/${owner}/${repo}`)
    ref = resp!.default_branch
  }

  const queryUrl = `repos/${owner}/${repo}/commits/${ref}/check-runs`
  const searchParams = { check_name }
  const resp = await restGithub(queryUrl, searchParams)

  // console.log('check_runs', searchParams, resp.check_runs.length, resp.check_runs)

  let state = resp.check_runs

  if (Array.isArray(state)) {
    state = combined(state, 'conclusion')
  }

  if (state) {
    return {
      subject: check_name || 'checks',
      status: state,
      color: statesColor[state]
    }
  } else {
    return {
      subject: 'checks',
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

async function meta ({ owner, repo }: PathArgs): Promise<any> {
  const meta = await got(`https://api.github.com/repos/${owner}/${repo}`).json()
  return meta
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

async function milestones ({ owner, repo, milestone_number }: PathArgs) {
  const milestone = await restGithub(`repos/${owner}/${repo}/milestones/${milestone_number}`)

  if (!milestone) {
    return {
      subject: 'milestones',
      status: 'no milestone',
      color: 'grey'
    }
  }

  const openIssues = milestone.open_issues
  const totalIssues = openIssues + milestone.closed_issues
  const percentage = totalIssues === 0 ? 0 : 100 - ((openIssues / totalIssues) * 100)

  return {
    subject: milestone.title,
    status: `${Math.floor(percentage)}%`,
    color: coverageColor(percentage)
  }
}

async function dependabotStatus({ owner, repo }: PathArgs) {
  // Since there is no API to get dependabot status, for now check if file exists
  const {status, color} = await restGithub(`repos/${owner}/${repo}/contents/.github/dependabot.yml`)
    .then(result => {
      return {
        status: 'Active',
        color: 'green',
      }
    })
    .catch(error => {
      return {
        status: 'Inactive',
        color: 'gray',
      }
    })

  return {
    subject: 'dependabot',
    status,
    color,
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
    'tag': `refs(last: 1, refPrefix: "refs/tags/", orderBy: { field: TAG_COMMIT_DATE, direction: ASC }) {
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
        ${
          restArgs.ref
            ? `branch: ref(qualifiedName: "${restArgs.ref}")`
            : 'defaultBranchRef'
        } {
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
        ${
          restArgs.ref ? 
            `branch: ref(qualifiedName: "${restArgs.ref}")` :
            'defaultBranchRef'
        } {
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

    return queryGithub(query).then(res => {
      if (res.errors) {
        console.error(res.errors)
        throw new BadgenError({
          status: res.errors[0].type,
          message: res.errors[0].message
        })
      } else {
        return res.data!.repository
      }
    })
  }
}

async function repoStats ({topic, owner, repo, ...restArgs}: PathArgs) {
  switch (topic) {
    case 'forks':
      const { forks } = await meta({ owner, repo })
      return {
        subject: topic,
        status: millify(forks),
        color: 'blue'
      }
    case 'watchers':
      const { watchers_count } = await meta({ owner, repo })
      return {
        subject: topic,
        status: millify(watchers_count),
        color: 'blue'
      }
    case 'open-issues':
      const { open_issues_count } = await meta({ owner, repo })
      return {
        subject: topic,
        status: millify(open_issues_count),
        color: 'blue'
      }
    case 'stars':
      const { stargazers_count } = await meta({ owner, repo })
      return {
        subject: topic,
        status: millify(stargazers_count),
        color: 'blue'
      }
    case 'license':
      const { license } = await meta({ owner, repo })
      return {
        subject: topic,
        status: license ? license.spdx_id : 'no license',
        color: license ? 'blue' : 'grey'
      }
  }

  // Use graphql when we cannot simply get info from public/free api
  const result = await makeRepoQuery(topic, owner, repo, restArgs)

  if (!result) {
    return {
      subject: 'github',
      status: 'not found',
      color: 'grey'
    }
  }

  switch (topic) {
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
    // case 'open-issues':
    //   return {
    //     subject: 'open issues',
    //     status: millify(result.issues.totalCount),
    //     color: result.issues.totalCount === 0 ? 'green' : 'orange'
    //   }
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
        status: millify(
          result.branch ? 
            result.branch.target.history.totalCount :
            result.defaultBranchRef.target.history.totalCount
        ),
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
    // case 'license':
    //   const li = result.licenseInfo
    //   return {
    //     subject: topic,
    //     status: li ? li.spdxId : 'no license',
    //     color: li ? 'blue' : 'grey'
    //   }
    case 'last-commit':
      const branch = result.branch || result.defaultBranchRef
      const commits = branch.target.history.nodes
      const lastDate = commits.length && new Date(commits[0].committedDate)
      const fromNow = lastDate && formatDistanceToNow(lastDate, { addSuffix: true })
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

function dependents (type: DependentsType) {
  return async function ({ owner, repo }: PathArgs) {
    const subject = type === 'PACKAGE' ? 'pkg dependents' : 'repo dependents'
    const keyword = type === 'PACKAGE' ? 'Packages' : 'Repositories'

    const html = await got(`https://github.com/${owner}/${repo}/network/dependents`).text()
    const reDependents = new RegExp(`svg>\\s*[\\d,]+\\s*${keyword}`, 'g')
    const countText = html.match(reDependents)?.[0].replace(/[^\d]/g, '')
    const count = Number(countText)

    if (Number.isNaN(count)) {
      return {
        subject,
        status: 'invalid',
        color: 'grey'
      }
    }
    return {
      subject,
      status: millify(count),
      color: 'blue'
    }
  }
}
