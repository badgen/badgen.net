import got from '../../libs/got'
import { coverage, coverageColor } from '../../libs/utils'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

export default createBadgenHandler({
  title: 'CodeCov',
  examples: {
    '/codecov/github/babel/babel': 'coverage (github)',
    '/codecov/github/babel/babel/6.x': 'coverage (github, branch)',
    '/codecov/bitbucket/ignitionrobotics/ign-math': 'coverage (bitbucket)',
    '/codecov/bitbucket/ignitionrobotics/ign-math/master': 'coverage (bitbucket, branch)',
    '/codecov/gitlab/gitlab-org/gitaly': 'coverage (gitlab)',
    '/codecov/gitlab/gitlab-org/gitaly/master': 'coverage (gitlab, branch)'
  },
  handlers: {
    '/codecov/c/:vcs<github|bitbucket|gitlab>/:owner/:repo/:branch?': handler, // legacy urls
    '/codecov/:vcs<github|bitbucket|gitlab>/:owner/:repo/:branch?': handler
  }
})

async function handler ({ vcs, owner, repo, branch }: PathArgs) {
  const endpoint = `https://codecov.io/api/v2/${vcs}/${owner}/repos/${repo}?format=json`

  const data = await got(endpoint).json<any>()

  if (!data.totals) {
    return {
      subject: 'codecov',
      status: 'unknown',
      color: 'grey'
    }
  }

  const cov = data.totals?.coverage || 0
  return {
    subject: 'coverage',
    status: coverage(cov),
    color: coverageColor(cov)
  }
}
