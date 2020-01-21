import qs from 'querystring'
import ky from '../libs/ky'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'CircleCI',
  examples: {
    '/circleci/github/nuxt/nuxt.js': 'build',
    '/circleci/github/nuxt/nuxt.js/master': 'build (branch)',
  },
  handlers: {
    '/circleci/:vcs<github|gitlab>/:user/:project/:branch?': handler
  }
})

async function handler ({ vcs, user, project, branch }: PathArgs) {
  // https://circleci.com/docs/api/v1-reference/
  branch = branch ? `/tree/${qs.escape(branch)}` : ''
  const endpoint = `https://circleci.com/api/v1.1/project/${vcs}/${user}/${project}${branch}?filter=completed&limit=1`
  const [latest] = await ky(endpoint).then(res => res.json())

  return {
    subject: 'circleci',
    status: latest.status.replace(/_/g, ' '),
    color: getStatusColor(latest.status)
  }
}

const getStatusColor = status => {
  switch (status) {
    case 'failed':
      return 'red'

    case 'success':
      return 'green'

    default:
      return 'grey'
  }
}
