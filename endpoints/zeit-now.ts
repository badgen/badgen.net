import got from '../libs/got'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'ZEIT Now',
  examples: {
    '/now/tunnckocore-template': 'build (master)',
    '/now/tunnckocore-template/master': 'build (branch)',
    '/now/tunnckocore-template/foo': 'build (branch)',
    '/now/tunnckocore-template/0e944411': 'build (commit)',
    '/now/tunnckocore-template/master/UsXCKtbQo': 'build (ZEIT token)',
  }
}

export const handlers: Handlers = {
  '/zeit-now/:name/:branch?/:token?': handler
}

export default badgenServe(handlers)

async function handler ({ name, branch = 'master', token }: Args) {
  const endpoint = `https://api.zeit.co/v4/now/deployments`
  const { body } = await got(endpoint, {
    headers: {
      authorization: `Bearer ${token || 'XXX'}`,
    }
  })

  let builds = body.deployments
  .filter((build) => build.name === name)
  .filter((build) => build.meta.githubCommitSha.startsWith(branch) ||
    build.meta.githubCommitRef === branch
  )

  const state = builds[0].state.toLowerCase()

  const result = {
    subject: 'build',
    status: state,
    color: 'orange'
  }

  if (state === 'ready') {
    return { ...result, status: 'passing', color: 'green' }
  }
  if (state === 'error') {
    return { ...result, status: 'failing', color: 'red' }
  }

  return result

}
