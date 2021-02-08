import got from '../libs/got'
import { millify } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const BRAND_COLOR = 'ED1965'

export default createBadgenHandler({
  title: 'Gitter',
  examples: {
    '/gitter/members/redom/lobby': 'members',
    '/gitter/members/redom/redom': 'members'
  },
  handlers: {
    '/gitter/members/:org/:room': handler
  }
})

async function handler ({ org, room }: PathArgs) {
  const membersCount = await fetchMembersCount(org, room)
  if (Number.isNaN(membersCount)) {
    return {
      subject: 'gitter',
      status: 'unknown',
      color: 'grey'
    }
  }

  const suffix = membersCount === 1 ? 'member' : 'members'
  return {
    subject: 'gitter',
    status: `${millify(membersCount)} ${suffix}`,
    color: BRAND_COLOR
  }
}

export async function fetchMembersCount(org: string, room: string) {
  const html = await got(`https://gitter.im/${org}/${room}`).text()
  return Number(html.match(/"userCount"\s*:\s*([^,]+)/)?.[1])
}
