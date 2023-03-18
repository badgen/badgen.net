import millify from 'millify'
import got from '../libs/got'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Twitter',
  examples: {
    '/twitter/follow/rustlang': 'followers count',
    '/twitter/follow/golang': 'followers count',
  },
  handlers: {
    '/twitter/:topic<follow>/:user': handler
  }
})

async function handler ({ topic, user }: PathArgs) {
  const endpoint = `http://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${user}`
  const [info] = await got(endpoint).json<any>()

  switch (topic) {
    case 'follow':
      return {
        subject: `follow @${user}`,
        status: millify(info.followers_count),
        color: '1da1f2'
      }
  }
}
