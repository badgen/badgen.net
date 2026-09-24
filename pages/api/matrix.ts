import type { RequestOptions } from '../../libs/http'
import { requestJson } from '../../libs/http'
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
  const requestOptions = { baseUrl: `${homeserver}/_matrix/client/r0` }
  const roomAlias = `#${roomName}:${server}`
  const room = await findPublicRoom(requestOptions, roomAlias)
  return room?.num_joined_members
}

// https://matrix.org/docs/spec/client_server/latest#get-well-known-matrix-client
async function getHomeserver(server: string) {
  const endpoint = `https://${server}/.well-known/matrix/client`
  const { 'm.homeserver': homeserver } = await requestJson<any>(endpoint)
  return homeserver?.base_url
}

// https://matrix.org/docs/spec/client_server/latest#get-matrix-client-r0-publicrooms
async function findPublicRoom(requestOptions: RequestOptions, roomAlias: string) {
  const roomId = await getRoomId(requestOptions, roomAlias)
  const searchParams = new URLSearchParams({ limit: '500' })
   
  while (true) {
    const { chunk, next_batch } = await requestJson<any>('publicRooms', { ...requestOptions, searchParams })
    const room = chunk.find(it => it.room_id === roomId)
    if (room) return room
    if (!next_batch) return
    searchParams.set('since', next_batch)
  }
}

// https://matrix.org/docs/spec/client_server/latest#get-matrix-client-r0-directory-room-roomalias
async function getRoomId(requestOptions: RequestOptions, roomAlias: string) {
  const endpoint = `directory/room/${encodeURIComponent(roomAlias)}`
  const { room_id } = await requestJson<any>(endpoint, requestOptions)
  return room_id
}
