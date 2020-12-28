import got from '../libs/got'
import { coverage as cov, coverageColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const COVERALLS_BADGE_URL = 'https://coveralls.io/repos/'

const client = got.extend({ prefixUrl: COVERALLS_BADGE_URL })

export default createBadgenHandler({
  title: 'Coveralls',
  examples: {
    '/coveralls/c/github/jekyll/jekyll': 'coverage (github)',
    '/coveralls/c/github/jekyll/jekyll/master': 'coverage (github, branch)',
    '/coveralls/c/bitbucket/pyKLIP/pyklip': 'coverage (bitbucket)',
    '/coveralls/c/bitbucket/pyKLIP/pyklip/master': 'coverage (bitbucket, branch)',
  },
  handlers: {
    '/coveralls/c/:vcs<github|bitbucket>/:owner/:repo/:branch?': handler
  }
})

// Detect coveralls.io's badge redirection instead of using it's api
// See https://github.com/badgen/badgen.net/issues/96
async function handler ({ vcs, owner, repo, branch }: PathArgs) {
  const endpoint = `${vcs}/${owner}/${repo}/badge.svg`
  const searchParams = new URLSearchParams()
  if (branch) searchParams.append('branch', branch)

  const badgeURL = await client.head(endpoint, {
    searchParams,
    followRedirect: false // Expecting 302 redirection to "coveralls_xxx.svg"
  }).then(res => res.headers.location) || ''

  const percentage = Number(badgeURL.match(/_(\d+)\.svg/)?.[1])

  if (Number.isNaN(percentage)) {
    return {
      subject: 'coverage',
      status: 'invalid',
      color: 'grey'
    }
  }
  return {
    subject: 'coverage',
    status: cov(percentage),
    color: coverageColor(percentage)
  }
}
