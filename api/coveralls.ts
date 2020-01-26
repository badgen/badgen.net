import got from '../libs/got'
import { coverage as cov, coverageColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

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
async function handler ({ vcs, owner, repo, branch = 'master' }: PathArgs) {
  const endpoint = `https://coveralls.io/repos/${vcs}/${owner}/${repo}/badge.svg`
  const badgeURL = await got.head(endpoint, {
    searchParams: { branch },
    followRedirect: false // Expecting 302 redirection to "coveralls_xxx.svg"
  }).then(res => res.headers.location) || ''

  try {
    const percentage = badgeURL.match(/_(\d+)\.svg/)?.[1]
    return {
      subject: 'coverage',
      status: cov(percentage),
      color: coverageColor(Number(percentage))
    }
  } catch (e) {
    return {
      subject: 'coverage',
      status: 'invalid',
      color: 'grey'
    }
  }
}
