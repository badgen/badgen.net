import millify from 'millify'
import distanceToNow from 'date-fns/formatDistanceToNow'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'
import { queryGitlab, restGitlab } from '../../libs/gitlab'
import { version } from '../../libs/utils'

const removeNoSignFromHexColor = (hexColor: string) => hexColor.replace('#', '')

export default createBadgenHandler({
  title: 'Gitlab',
  examples: {
    '/gitlab/stars/fdroid/fdroidclient': 'stars',
    '/gitlab/forks/inkscape/inkscape': 'forks',
    '/gitlab/issues/gitlab-org/gitlab-runner': 'issues',
    '/gitlab/open-issues/gitlab-org/gitlab-runner': 'issues',
    '/gitlab/closed-issues/gitlab-org/gitlab-runner': 'issues',
    '/gitlab/label-issues/NickBusey/HomelabOS/Bug': 'issues by label',
    '/gitlab/label-issues/NickBusey/HomelabOS/Enhancement/opened': 'open issues by label',
    '/gitlab/label-issues/NickBusey/HomelabOS/Help%20wanted/closed': 'closed issues by label',
    '/gitlab/mrs/edouardklein/falsisign': 'MRs',
    '/gitlab/open-mrs/edouardklein/falsisign': 'open MRs',
    '/gitlab/closed-mrs/edouardklein/falsisign': 'closed MRs',
    '/gitlab/merged-mrs/edouardklein/falsisign': 'merged MRs',
    '/gitlab/branches/gitlab-org%2fgitter/webapp': 'branches',
    '/gitlab/releases/AuroraOSS/AuroraStore': 'release',
    '/gitlab/release/veloren/veloren': 'latest release',
    '/gitlab/tags/commento/commento': 'tags',
    '/gitlab/contributors/graphviz/graphviz': 'contributors',
    '/gitlab/license/gitlab-org/omnibus-gitlab': 'license',
    '/gitlab/commits/cryptsetup/cryptsetup': 'commits count',
    '/gitlab/commits/cryptsetup/cryptsetup/coverity_scan': 'commits count (branch ref)',
    '/gitlab/commits/cryptsetup/cryptsetup/v2.2.2': 'commits count (tag ref)',
    '/gitlab/last-commit/gitlab-org/gitlab-development-kit': 'last commit',
    '/gitlab/last-commit/gitlab-org/gitlab-development-kit/updating-chromedriver-install-v2': 'last commit (branch ref)',
    '/gitlab/last-commit/gitlab-org/gitlab-development-kit/v0.2.5': 'last commit (tag ref)',
  },
  handlers: {
    '/gitlab/:topic<stars|forks|issues|open-issues|closed-issues>/:owner/:repo': queryHandler,
    '/gitlab/:topic<mrs|open-mrs|closed-mrs|merged-mrs|branches|releases|release|tags|license|contributors>/:owner/:repo': restHandler,
    '/gitlab/:topic<label-issues>/:owner/:repo/:label/:state?<open|closed>': queryHandler,
    '/gitlab/:topic<commits|last-commit>/:owner/:repo/:ref?': restHandler,
  },
})


async function restHandler({ topic, owner, repo, ...restArgs }: PathArgs) {
  const result = await makeRestCall({ topic, owner, repo, ...restArgs })

  switch (topic) {
    case 'mrs':
      return {
        subject: 'MRs',
        status: millify(parseInt(result.headers['x-total'])),
        color: 'blue'
      }
    case 'closed-mrs':
      return {
        subject: 'closed MRs',
        status: millify(parseInt(result.headers['x-total'])),
        color: 'blue'
      }
    case 'open-mrs':
      return {
        subject: 'open MRs',
        status: millify(parseInt(result.headers['x-total'])),
        color: 'blue'
      }
    case 'merged-mrs':
      return {
        subject: 'merged MRs',
        status: millify(parseInt(result.headers['x-total'])),
        color: 'blue'
      }
    case 'commits':
      return {
        subject: 'commits',
        status: millify(parseInt(result.headers['x-total'])),
        color: 'blue'
      }
    case 'last-commit':
      const lastDate = result.length && new Date(result[0].committed_date)
      const fromNow = lastDate && distanceToNow(lastDate, { addSuffix: true })
      return {
        subject: 'last commit',
        status: fromNow || 'none',
        color: 'green'
      }
    case 'branches':
      return {
        subject: 'branches',
        status: millify(parseInt(result.headers['x-total'])),
        color: 'blue'
      }
    case 'releases':
      return {
        subject: 'releases',
        status: millify(parseInt(result.headers['x-total'])),
        color: 'blue'
      }
    case 'release':
      const [latest] = result
      if (!latest) {
        return {
          subject: 'release',
          status: 'none',
          color: 'yellow'
        }
      }
      return {
        subject: 'release',
        status: version(latest.name || latest.tag_name),
        color: 'blue'
      }
    case 'tags':
      return {
        subject: 'tags',
        status: millify(parseInt(result.headers['x-total'])),
        color: 'blue'
      }
    case 'contributors':
      return {
        subject: 'contributors',
        status: millify(parseInt(result.headers['x-total'])),
        color: 'blue'
      }
    case 'license':
      return {
        subject: 'license',
        status: result.license?.name || "no license",
        color: result.license ? 'blue' : 'grey'
      }
    default:
      return {
        subject: 'gitlab',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}


async function queryHandler({ topic, owner, repo, ...restArgs }: PathArgs) {
  const result = await makeQueryCall({ topic, owner, repo, ...restArgs })

  if (!result) {
    return {
      subject: 'gitlab',
      status: 'not found',
      color: 'grey'
    }
  }

  switch (topic) {
    case 'stars':
      return {
        subject: topic,
        status: millify(result.starCount),
        color: 'blue'
      }
    case 'forks':
      return {
        subject: topic,
        status: millify(result.forksCount),
        color: 'blue'
      }
    case 'issues':
      return {
        subject: topic,
        status: millify(result.issues.count),
        color: 'blue'
      }
    case 'open-issues':
      return {
        subject: 'open issues',
        status: millify(result.openIssuesCount),
        color: result.openIssuesCount === 0 ? 'green' : 'orange'
      }
    case 'closed-issues':
      return {
        subject: 'closed issues',
        status: millify(result.issues.count),
        color: 'blue'
      }
    case 'label-issues':
      return {
        subject: `${restArgs.label}`,
        status: result.label ? millify(result.issues.count) : '0',
        color: result.label ? removeNoSignFromHexColor(result.label.color) : 'gray'
      }
    default:
      return {
        subject: 'gitlab',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}

const makeQueryCall = async ({ topic, owner, repo, ...restArgs }) => {
  const repoQueryBodies = {
    'stars': 'starCount',
    'forks': 'forksCount',
    'open-issues': 'openIssuesCount',
    'closed-issues': 'issues(state:closed){ count }',
    'issues': 'issues{ count }',
  }

  let queryBody
  switch (topic) {
    case 'label-issues':
      const { label, state } = restArgs
      const stateFilter = state ? `state:${state.toLowerCase()}` : ''
      queryBody = `
      issues(labelName:"${label}", ${stateFilter}) { count }
      label(title: "${label}"){ color }
      `
      break
    default:
      queryBody = repoQueryBodies[topic]
  }

  const query = `
  query {
    project(fullPath:"${owner}/${repo}") {
      ${queryBody}
    }
  }
`
  return queryGitlab(query).then(res => res.data!.project)
}

const makeRestCall = async ({ topic, owner, repo, ...restArgs }) => {
  const restPaths = {
    'mrs': `projects/${encodeURIComponent(`${owner}/${repo}`)}/merge_requests`,
    'open-mrs': `projects/${encodeURIComponent(`${owner}/${repo}`)}/merge_requests?state=opened`,
    'closed-mrs': `projects/${encodeURIComponent(`${owner}/${repo}`)}/merge_requests?state=closed`,
    'merged-mrs': `projects/${encodeURIComponent(`${owner}/${repo}`)}/merge_requests?state=merged`,
    'commits': `projects/${encodeURIComponent(`${owner}/${repo}`)}/repository/commits?${restArgs.ref ? "ref_name=" + restArgs.ref : ''}`,
    'last-commit': `projects/${encodeURIComponent(`${owner}/${repo}`)}/repository/commits?${restArgs.ref ? "ref_name=" + restArgs.ref : ''}`,
    'branches': `projects/${encodeURIComponent(`${owner}/${repo}`)}/repository/branches`,
    'tags': `projects/${encodeURIComponent(`${owner}/${repo}`)}/repository/tags`,
    'contributors': `projects/${encodeURIComponent(`${owner}/${repo}`)}/repository/contributors`,
    'releases': `projects/${encodeURIComponent(`${owner}/${repo}`)}/releases`,
    'release': `projects/${encodeURIComponent(`${owner}/${repo}`)}/releases`,
    'license': `projects/${encodeURIComponent(`${owner}/${repo}`)}?license=true`,
  }

  let restPath = restPaths[topic]

  return restGitlab(restPath, fullResponsePaths.includes(topic))
}

const fullResponsePaths =
  [
    'mrs',
    'open-mrs',
    'closed-mrs',
    'merged-mrs',
    'commits',
    'branches',
    'releases',
    'tags',
    'contributors'
  ]
