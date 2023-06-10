import got from '../libs/got'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const CIRCLECI_API_URL = 'https://circleci.com/api/v1.1/'

const client = got.extend({ prefixUrl: CIRCLECI_API_URL })

export default createBadgenHandler({
  title: 'CircleCI',
  examples: {
    '/circleci/github/nuxt/nuxt.js': 'build',
    '/circleci/github/nuxt/nuxt.js/master': 'build (branch)',
  },
  handlers: {
    '/circleci/:vcs<github|gitlab>/:owner/:repo/:branch?': handler
  }
})

async function handler ({ vcs, owner, repo, branch }: PathArgs) {
  // https://circleci.com/docs/api/#recent-builds-for-a-single-project
  branch = branch ? `/tree/${encodeURIComponent(branch)}` : ''
  const path = `project/${vcs}/${owner}/${repo}${branch}`
  const searchParams = { filter: 'completed', limit: 1, shallow: true }
  const [latest] = await client.get(path, { searchParams }).json<any>()

  const color = {
    failed: 'red',
    success: 'green'
  }[latest.status] || 'grey'

  return {
    subject: 'circleci',
    status: latest.status.replace(/_/g, ' '),
    color
  }
}
