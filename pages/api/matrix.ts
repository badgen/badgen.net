import { Got } from 'got'
import got from '../../libs/got'
import { millify } from '../../libs/utils'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

const BRAND_COLOR = 'black'

export default createBadgenHandler({
  title: 'Matrix',
  examples: {
    '/matrix/members/rust/matrix.org': 'members',
    '/matrix/members/thisweekinmatrix': 'members',
    '/matrix/members/archlinux/archlinux.org': 'members',
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
  const homeserver = await getHomeserver(server)
  const client = got.extend({ prefixUrl: `${homeserver}/_matrix/client/r0` })
  const roomAlias = `#${roomName}:${server}`
  const room = await findPublicRoom(client, roomAlias)
  return room?.num_joined_members
}

// https://matrix.org/docs/spec/client_server/latest#get-well-known-matrix-client
async function getHomeserver(server: string) {
  const endpoint = `https://${server}/.well-known/matrix/client`
  const { 'm.homeserver': homeserver } = await got(endpoint).json<any>()
  return homeserver?.base_url
}

// https://matrix.org/docs/spec/client_server/latest#get-matrix-client-r0-publicrooms
async function findPublicRoom(client: Got, roomAlias: string) {
  const roomId = await getRoomId(client, roomAlias)
  const searchParams = new URLSearchParams({ limit: '500' })
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { chunk, next_batch } = await client.get('publicRooms', { searchParams }).json<any>()
    const room = chunk.find(it => it.room_id === roomId)
    if (room) return room
    if (!next_batch) return
    searchParams.set('since', next_batch)
  }
}

// https://matrix.org/docs/spec/client_server/latest#get-matrix-client-r0-directory-room-roomalias
async function getRoomId(client: Got, roomAlias: string) {
  const endpoint = `directory/room/${encodeURIComponent(roomAlias)}`
  const { room_id } = await client.get(endpoint).json<any>()
  return room_id
}
