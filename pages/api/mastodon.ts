import { request, requestJson } from '../../libs/http'
import { millify } from '../../libs/utils'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

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
  const info = await requestJson<any>(`https://${instance}/api/v1/accounts/${userId}`)
  const account = `${info.username}@${instance}`
  return {
    subject: `follow @${account}`,
    status: millify(info.followers_count),
    color: BRAND_COLOR
  }
}

async function accountHandler({ account }: PathArgs) {
  const [username, instance] = account.split('@')
  const { version } = await requestJson<any>(`https://${instance}/api/v1/instance`)
  const isPleroma = /\bPleroma\b/i.test(version)
  if (isPleroma) return userIdHandler({ 'user-id': username, instance })
  const resp = await request(`https://${instance}/@${username}.rss`)
  const body = await resp.text()
  const params = isFeed(resp) && parseFeed(body, instance)
  return params || {
    subject: 'mastodon',
    status: 'unknown',
    color: 'grey'
  }
}

function isFeed(response: Response) {
  const contentType = response.headers.get('content-type') || ''
  return contentType.includes('application/rss+xml')
}

function parseFeed(feed: string, instance: string) {
  const reAvatarPath = /\/accounts\/avatars\/(\d{3})\/(\d{3})\/(\d{3})/
  const userId = feed.match(reAvatarPath)?.slice(1).join('')
  if (userId) return userIdHandler({ 'user-id': userId, instance })
}
