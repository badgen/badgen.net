import got from '../libs/got'
import { millify } from '../libs/utils'
import { fetchMembersCount as fetchGitterMembersCount } from './gitter'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const BRAND_COLOR = 'black'

export default createBadgenHandler({
  title: 'Matrix',
  examples: {
    '/matrix/members/rust/matrix.org': 'members',
    '/matrix/members/thisweekinmatrix': 'members',
    '/matrix/members/archlinux/archlinux.org': 'members',
    '/matrix/members/redom_redom/gitter.im': 'members'
  },
  handlers: {
    '/matrix/members/:room/:server?': handler
  }
})

async function handler ({ room, server = 'matrix.org' }: PathArgs) {
  const roomName = room.replace(/^#/, '')
  const membersCount = await fetchMembersCount(roomName, server)
  if (Number.isNaN(membersCount)) {
    return {
      subject: 'matrix',
      status: 'unknown',
      color: 'grey'
    }
  }

  const status = [
    millify(membersCount),
    server === 'gitter.im' ? 'gitter' : '',
    membersCount === 1 ? 'member' : 'members'
  ].join(' ')

  return {
    subject: `#${roomName}:${server}`,
    status,
    color: BRAND_COLOR
  }
}

async function fetchMembersCount(roomName: string, server: string) {
  if (server === 'gitter.im') {
    const [gitterOrg, gitterRoom] = roomName.split('_')
    return fetchGitterMembersCount(gitterOrg, gitterRoom)
  }
  const room = await findPublicRoom(roomName, server)
  return room?.num_joined_members
}

async function findPublicRoom(roomName: string, server: string, homeserver?: string) {
  homeserver = homeserver || await getHomeserver(server)
  const roomAlias = `#${roomName}:${server}`
  const endpoint = `${homeserver}/_matrix/client/api/v1/publicRooms`
  const searchParams = new URLSearchParams({ limit: '500' })
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { chunk, next_batch } = await got(endpoint, { searchParams }).json<any>()
    const room = chunk.find(it => it.canonical_alias === roomAlias)
    if (room) return room
    if (!next_batch) return
    searchParams.set('since', next_batch)
  }
}

async function getHomeserver(server: string) {
  const endpoint = `https://${server}/.well-known/matrix/client`
  const { 'm.homeserver': homeserver } = await got(endpoint).json()
  return homeserver?.base_url
}
