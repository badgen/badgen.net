import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { createBadgenHandler, PathArgs } from 'libs/create-badgen-handler-next'
import { restCodeberg } from 'libs/codeberg'
import { millify, version } from 'libs/utils'

export default createBadgenHandler({
  title: 'Codeberg',
  examples: {
    '/codeberg/stars/forgejo/forgejo': 'stars',
    '/codeberg/forks/forgejo/forgejo': 'forks',
    '/codeberg/issues/forgejo/forgejo': 'issues',
    '/codeberg/open-issues/forgejo/forgejo': 'open issues',
    '/codeberg/closed-issues/forgejo/forgejo': 'closed issues',
    '/codeberg/prs/forgejo/forgejo': 'PRs',
    '/codeberg/open-prs/forgejo/forgejo': 'open PRs',
    '/codeberg/closed-prs/forgejo/forgejo': 'closed PRs',
    '/codeberg/releases/forgejo/forgejo': 'releases',
    '/codeberg/release/forgejo/forgejo': 'latest release',
    '/codeberg/tags/forgejo/forgejo': 'tags',
    '/codeberg/commits/forgejo/forgejo': 'commits count',
    '/codeberg/commits/forgejo/forgejo/forgejo': 'commits count (branch ref)',
    '/codeberg/last-commit/forgejo/forgejo': 'last commit',
    '/codeberg/last-commit/forgejo/forgejo/forgejo': 'last commit (branch ref)',
  },
  handlers: {
    '/codeberg/:topic<stars|forks|issues|open-issues|closed-issues|prs|open-prs|closed-prs|releases|release|tags|commits|last-commit>/:owner/:repo/:ref?': handler,
  }
})

async function handler({ topic, owner, repo, ref }: PathArgs) {
  switch (topic) {
    case 'stars':
    case 'forks':
    case 'issues': // open-issues in Codeberg/Gitea repo API
    case 'open-issues': {
      const repoData = await restCodeberg(`repos/${owner}/${repo}`)
      if (topic === 'stars') {
        return {
          subject: 'stars',
          status: millify(repoData.stars_count),
          color: 'blue'
        }
      } else if (topic === 'forks') {
        return {
          subject: 'forks',
          status: millify(repoData.forks_count),
          color: 'blue'
        }
      } else {
        return {
          subject: 'open issues',
          status: millify(repoData.open_issues_count),
          color: repoData.open_issues_count === 0 ? 'green' : 'orange'
        }
      }
    }
    case 'closed-issues': {
      const res = await restCodeberg(`repos/${owner}/${repo}/issues?state=closed&type=issues&limit=1`, true)
      return {
        subject: 'closed issues',
        status: millify(parseInt(res.headers['x-total-count'] || '0')),
        color: 'blue'
      }
    }
    case 'prs': {
      const res = await restCodeberg(`repos/${owner}/${repo}/pulls?state=all&limit=1`, true)
      return {
        subject: 'PRs',
        status: millify(parseInt(res.headers['x-total-count'] || '0')),
        color: 'blue'
      }
    }
    case 'open-prs': {
      const res = await restCodeberg(`repos/${owner}/${repo}/pulls?state=open&limit=1`, true)
      return {
        subject: 'open PRs',
        status: millify(parseInt(res.headers['x-total-count'] || '0')),
        color: 'blue'
      }
    }
    case 'closed-prs': {
      const res = await restCodeberg(`repos/${owner}/${repo}/pulls?state=closed&limit=1`, true)
      return {
        subject: 'closed PRs',
        status: millify(parseInt(res.headers['x-total-count'] || '0')),
        color: 'blue'
      }
    }
    case 'releases': {
      const res = await restCodeberg(`repos/${owner}/${repo}/releases?limit=1`, true)
      return {
        subject: 'releases',
        status: millify(parseInt(res.headers['x-total-count'] || '0')),
        color: 'blue'
      }
    }
    case 'release': {
      const releases = await restCodeberg(`repos/${owner}/${repo}/releases?limit=1`)
      const latest = releases[0]
      return {
        subject: 'release',
        status: latest ? version(latest.name || latest.tag_name) : 'none',
        color: 'blue'
      }
    }
    case 'tags': {
      const res = await restCodeberg(`repos/${owner}/${repo}/tags?limit=1`, true)
      return {
        subject: 'tags',
        status: millify(parseInt(res.headers['x-total-count'] || '0')),
        color: 'blue'
      }
    }
    case 'commits': {
      const res = await restCodeberg(`repos/${owner}/${repo}/commits?limit=1${ref ? `&sha=${ref}` : ''}`, true)
      return {
        subject: 'commits',
        status: millify(parseInt(res.headers['x-total-count'] || '0')),
        color: 'blue'
      }
    }
    case 'last-commit': {
      const commits = await restCodeberg(`repos/${owner}/${repo}/commits?limit=1${ref ? `&sha=${ref}` : ''}`)
      const lastDate = commits.length && new Date(commits[0].commit.committer.date)
      const fromNow = lastDate && formatDistanceToNow(lastDate, { addSuffix: true })
      return {
        subject: 'last commit',
        status: fromNow || 'none',
        color: 'green'
      }
    }
    default:
      return {
        subject: 'codeberg',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}
