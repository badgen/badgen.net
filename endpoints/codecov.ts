import got from '../libs/got'
import { coverage, coverageColor } from '../libs/utils'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'CodeCov',
  examples: {
    '/codecov/c/github/babel/babel': 'coverage (github)',
    '/codecov/c/github/babel/babel/6.x': 'coverage (github, branch)',
    '/codecov/c/bitbucket/ignitionrobotics/ign-math': 'coverage (bitbucket)',
    '/codecov/c/bitbucket/ignitionrobotics/ign-math/master': 'coverage (bitbucket, branch)',
    '/codecov/c/gitlab/gitlab-org/gitaly': 'coverage (gitlab)',
    '/codecov/c/gitlab/gitlab-org/gitaly/master': 'coverage (gitlab, branch)'
  }
}

export const handlers: Handlers = {
  '/codecov/c/:vcs<gh|github|bitbucket|gitlab>/:owner/:repo/:branch?': handler
}

export default badgenServe(handlers)

async function handler ({ vcs, owner, repo, branch }: Args) {
  const vcsType = {
    github: 'gh',
    bitbucket: 'bb',
    gitlab: 'gl'
  }[vcs] || vcs

  const args = [vcsType, owner, repo]
  if (typeof branch === 'string') {
    args.push('branch', branch)
  }

  const endpoint = `https://codecov.io/api/${args.join('/')}`
  const data = await got(endpoint).then(res => res.body)

  if (!data.commit) {
    return {
      subject: 'codecov',
      status: 'unknown',
      color: 'grey'
    }
  }

  const cov = data.commit.totals ? data.commit.totals.c : 0
  return {
    subject: 'coverage',
    status: coverage(cov),
    color: coverageColor(cov)
  }
}
