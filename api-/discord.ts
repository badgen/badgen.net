import millify from 'millify'
import got from '../libs/got'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const BRAND_COLOR = '7289DA'
const DISCORD_API_URL = 'https://discord.com/api/v8/'

const client = got.extend({ prefixUrl: DISCORD_API_URL })

export default createBadgenHandler({
  title: 'Discord',
  examples: {
    '/discord/members/reactiflux': 'members',
    '/discord/online-members/8Jzqu3T': 'online members'
  },
  handlers: {
    '/discord/:topic<members|online-members>/:invite-code': handler
  }
})

async function handler ({ 'invite-code': inviteCode, topic }: PathArgs) {
  // https://discord.com/developers/docs/resources/invite#get-invite
  const searchParams = { with_counts: true }
  const {
    guild,
    approximate_member_count,
    approximate_presence_count
  } = await client.get(`invites/${inviteCode}`, { searchParams }).json<any>()

  switch (topic) {
    case 'members':
      return {
        subject: guild?.name || 'discord',
        status: `${millify(approximate_member_count)} members`,
        color: BRAND_COLOR
      }
    case 'online-members':
      return {
        subject: guild?.name || 'discord',
        status: `${millify(approximate_presence_count)} online`,
        color: BRAND_COLOR
      }
  }
}
