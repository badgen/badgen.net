import millify from 'millify'
import got from '../libs/got'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Twitter',
  examples: {
    '/twitter/follow/rustlang': 'followers count',
    '/twitter/follow/golang': 'followers count',
  }
}

export const handlers: Handlers = {
  '/twitter/:topic<follow>/:user': handler
}

export default badgenServe(handlers)

async function handler ({ topic, user }: Args) {
  const endpoint = `http://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${user}`
  const [info] = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'follow':
      return {
        subject: `follow @${user}`,
        status: millify(info.followers_count),
        color: '1da1f2'
      }
  }
}
