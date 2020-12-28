import got from '../libs/got'
import { millify } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Mastodon/Pleroma',
  examples: {
    '/mastodon/follow/1': 'followers (mastodon.social)',
    '/mastodon/follow/1/mas.to': 'followers (other Mastodon instance)',
    '/mastodon/follow/3/anime.website': 'followers (Pleroma instance)',
  },
  handlers: {
    '/mastodon/follow/:userId/:instance?': handler
  }
})

async function handler ({ userId, instance = 'mastodon.social' }: PathArgs) {
  const prefixUrl = `https://${instance}/api/v1/`
  const info = await got(`accounts/${userId}`, { prefixUrl }).json<any>()

  return {
    subject: `follow @${info.username}@${instance}`,
    status: millify(info.followers_count),
    color: '3487CE'
  }
}
