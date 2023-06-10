import got from '../libs/got'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Packagephobia',
  examples: {
    '/packagephobia/install/webpack': 'install size',
    '/packagephobia/publish/webpack': 'publish size',
    '/packagephobia/publish/@tusbar/cache-control': '(scoped pkg) publish size',
  },
  handlers: {
    '/packagephobia/:topic/:scope<@.*>/:name': handler,
    '/packagephobia/:topic/:name': handler,
  }
})

async function handler ({ topic, scope, name}: PathArgs) {
  const pkg = scope ? `${scope}/${name}` : name
  const endpoint = `https://packagephobia.com/v2/api.json?p=${pkg}`
  const { install, publish } = await got(endpoint).json<any>()

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
