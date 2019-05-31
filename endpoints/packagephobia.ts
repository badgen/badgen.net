import got from '../libs/got'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Packagephobia',
  examples: {
    '/packagephobia/install/webpack': 'install size',
    '/packagephobia/publish/webpack': 'publish size',
    '/packagephobia/publish/@tusbar/cache-control': 'publish size (scoped package)',
  }
}

export const handlers: Handlers = {
  '/packagephobia/:topic/:scope<@.*>/:name': handler,
  '/packagephobia/:topic/:name': handler,
}

export default badgenServe(handlers)

async function handler ({ topic, scope, name}: Args) {
  const pkg = scope ? `${scope}/${name}` : name
  const endpoint = `https://packagephobia.now.sh/v2/api.json?p=${pkg}`
  const { install, publish } = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'publish':
      return {
        subject: 'publish size',
        status: publish.pretty,
        color: publish.color.replace('#', '')
      }
    case 'install':
      return {
        subject: 'install size',
        status: install.pretty,
        color: install.color.replace('#', '')
      }
    default: {
      return {
        subject: 'packagephobia',
        status: 'unknown topic',
        color: 'grey'
      }
    }
  }
}
