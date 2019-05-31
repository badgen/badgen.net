import got from '../libs/got'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Travis CI',
  examples: {
    '/travis/babel/babel': 'build',
    '/travis/babel/babel/6.x': 'build (branch)',
  }
}

export const handlers: Handlers = {
  '/travis/:user/:repo/:branch?': handler
}

export default badgenServe(handlers)

async function handler ({ user, repo, branch = 'master' }: Args) {
  const com = `https://api.travis-ci.com/${user}/${repo}.svg?branch=${branch}`
  const org = `https://api.travis-ci.org/${user}/${repo}.svg?branch=${branch}`
  const [svg1, svg2] = await Promise.all([
    // @ts-ignore
    got(com, { json: false }).then(({ body }) => body),
    // @ts-ignore
    got(org, { json: false }).then(({ body }) => body)
  ])

  const result = statuses.find(st => {
    return (svg1 && svg1.includes(st[0])) || (svg2 && svg2.includes(st[0]))
  })

  if (result) {
    return {
      subject: 'travis',
      status: result[0],
      color: result[1]
    }
  } else {
    return {
      subject: 'travis',
      status: 'unknown',
      color: 'grey'
    }
  }
}

const statuses = [
  ['passed', 'green'],
  ['passing', 'green'],
  ['failed', 'orange'],
  ['failing', 'orange'],
  ['error', 'red'],
  ['errored', 'red'],
  ['pending', 'yellow'],
  ['fixed', 'yellow'],
  ['broken', 'red'],
  ['canceled', 'grey']
]
