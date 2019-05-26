import got from '../libs/got'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'AppVeyor',
  examples: {
    '/appveyor/ci/gruntjs/grunt': 'build',
    '/appveyor/ci/gruntjs/grunt/deprecate': 'build (branch)'
  }
}

export const handlers: Handlers = {
  '/appveyor/ci/:account/:project/:branch?': handler
}

async function handler ({ account, project, branch }: Args) {
  branch = branch ? `/branch/${branch}` : ''
  const endpoint = `https://ci.appveyor.com/api/projects/${account}/${project}${branch}`
  const { build } = await got(endpoint).then(res => res.body)

  return {
    subject: 'appveyor',
    status: build.status,
    color: build.status === 'success' ? 'green' : 'red'
  }
}

export default badgenServe(handlers)
