import qs from 'querystring'
import got from '../libs/got'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'CircleCI',
  examples: {
    '/circleci/github/nuxt/nuxt.js': 'build',
    '/circleci/github/nuxt/nuxt.js/master': 'build (branch)',
  }
}

export const handlers: Handlers = {
  '/circleci/:vcs<github|gitlab>/:user/:project/:branch?': handler
}

export default badgenServe(handlers)

async function handler ({ vcs, user, project, branch }: Args) {
  // https://circleci.com/docs/api/v1-reference/
  branch = branch ? `/tree/${qs.escape(branch)}` : ''
  const endpoint = `https://circleci.com/api/v1.1/project/${vcs}/${user}/${project}${branch}?filter=completed&limit=1`
  const [latest] = await got(endpoint).then(res => res.body)

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
