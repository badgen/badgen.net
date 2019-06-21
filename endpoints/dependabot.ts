import got from '../libs/got'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Dependabot',
  examples: {
    '/dependabot/github/dependabot/dependabot-core/?icon=dependabot': 'status',
    '/dependabot/github/greenkeeperio/greenkeeper/<repo_id>?icon=dependabot': 'status (private repo)'
  }
}

export const handlers: Handlers = {
  '/dependabot/:host<github|gitlab>/:owner/:repo/:identifier?': handler
}

export default badgenServe(handlers)

async function handler ({ host, owner, repo, identifier }: Args) {
  // https://github.com/dependabot/feedback/issues/6#issuecomment-503994253
  let endpoint = `https://api.dependabot.com/badges/status?host=${host}&repo=${owner}/${repo}`
  if (!!identifier && identifier !== '<repo_id>') {
    endpoint += `&identifier=${identifier}`
  }
  const { status, colour } = await got(endpoint).then(res => res.body);

  return {
    subject: 'Dependabot',
    status,
    color: colour
  }
}
