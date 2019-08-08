import {
  badgenServe,
  BadgenServeHandlerArgs as Args,
  BadgenServeHandlers as Handlers,
  BadgenServeMeta as Meta
} from '../libs/badgen-serve'
import got from '../libs/got'

export const meta: Meta = {
  title: 'Libraries.io',
  examples: {
    '/librariesio/github/i4004/Simplify': 'dependency status'
  }
}

export const handlers: Handlers = {
  '/librariesio/github/:user/:repo': handler
}

export default badgenServe(handlers)

const uriBase = 'https://libraries.io/api/github/'

async function handler ({ user, repo }: Args) {
  const subject = 'dependencies'
  const deps = await got(`${uriBase}/${user}/${repo}/dependencies`).then(res => res.body.dependencies)
  const [outdated, deprecated] = deps.reduce(([out, dep], x) => [out += x.outdated ? 1 : 0, dep += x.deprecated ? 1 : 0], [0, 0])

  if (deprecated > 0 && outdated > 0) {
    return {
      subject,
      status: `${deprecated} deprecated, ${outdated} outdated`,
      color: 'red'
    }    
  }

  if (deprecated > 0) {
    return {
      subject,
      status: `${deprecated} deprecated`,
      color: 'red'
    }    
  }

  if (outdated > 0) {
    return {
      subject,
      status: `${outdated} outdated`,
      color: 'orange'
    }
  }

  return {
    subject,
    status: 'up to date',
    color: 'green'
  }
}
