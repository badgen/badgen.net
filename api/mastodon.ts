import got from '../libs/got'
import { millify } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const BRAND_COLOR = '3487CE'

export default createBadgenHandler({
  title: 'Mastodon/Pleroma',
  examples: {
    '/mastodon/follow/Gargron@mastodon.social': 'followers',
    '/mastodon/follow/trumpet@mas.to': 'followers',
    '/mastodon/follow/admin@cawfee.club': 'followers (Pleroma)',
  },
  handlers: {
    '/mastodon/follow/:account<.+@.+>': accountHandler,
    '/mastodon/follow/:user-id<\\d>/:instance?': userIdHandler
  }
})

async function userIdHandler({ 'user-id': userId, instance = 'mastodon.social' }: PathArgs) {
  const info = await got(`https://${instance}/api/v1/accounts/${userId}`).json<any>()
  const account = `${info.username}@${instance}`
  return {
    subject: `follow @${account}`,
    status: millify(info.followers_count),
    color: BRAND_COLOR
  }
}

async function accountHandler({ account }: PathArgs) {
  const [username, instance] = account.split('@')
  const { version } = await got(`https://${instance}/api/v1/instance`).json<any>()
  const isPleroma = /\bPleroma\b/i.test(version)
  if (isPleroma) return userIdHandler({ 'user-id': username, instance })
  const resp = await got(`https://${instance}/@${username}.rss`)
  const params = isFeed(resp) && parseFeed(resp.body, instance)
  return params || {
    subject: 'mastodon',
    status: 'unknown',
    color: 'grey'
  }
}

function isFeed(response: import('got').Response) {
  const contentType = response.headers['content-type'] || ''
  return contentType.includes('application/rss+xml')
}

function parseFeed(feed: string, instance: string) {
  const reAvatarPath = /\/accounts\/avatars\/(\d{3})\/(\d{3})\/(\d{3})/
  const userId = feed.match(reAvatarPath)?.slice(1).join('')
  if (userId) return userIdHandler({ 'user-id': userId, instance })
}
