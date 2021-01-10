import got from '../libs/got'
import { millify } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const BRAND_COLOR = 'F1680D'

export default createBadgenHandler({
  title: 'PeerTube',
  examples: {
    '/peertube/framatube.org/comments/9c9de5e8-0a1e-484a-b099-e80766180a6d?icon=peertube': 'comments',
    '/peertube/framatube.org/votes/9c9de5e8-0a1e-484a-b099-e80766180a6d?icon=peertube': 'votes (combined)',
    '/peertube/framatube.org/votes/9c9de5e8-0a1e-484a-b099-e80766180a6d/likes?icon=peertube': 'votes (likes)',
    '/peertube/framatube.org/votes/9c9de5e8-0a1e-484a-b099-e80766180a6d/dislikes?icon=peertube': 'votes (dislikes)',
    '/peertube/framatube.org/views/9c9de5e8-0a1e-484a-b099-e80766180a6d?icon=peertube': 'views',
    '/peertube/framatube.org/followers/framasoft?icon=peertube': 'followers (account)',
    '/peertube/framatube.org/followers/framasoft/framablog.audio?icon=peertube': 'followers (channel)',
  },
  handlers: {
    '/peertube/:instance/:topic<comments|views>/:video-id': handler,
    '/peertube/:instance/:topic<votes>/:video-id/:format?<likes|dislikes>': votesHandler,
    '/peertube/:instance/:topic<followers>/:account/:channel?': followersHandler
  }
})

async function handler ({ instance, topic, 'video-id': videoId }: PathArgs) {
  const client = createClient(instance)

  switch (topic) {
    case 'comments': {
      const { total } = await client.get(`/videos/${videoId}/comment-threads`).json()
      return {
        subject: 'comments',
        status: millify(total),
        color: BRAND_COLOR
      }
    }
    case 'views': {
      const { views } = await client.get(`/videos/${videoId}`).json()
      return {
        subject: 'views',
        status: millify(views),
        color: BRAND_COLOR
      }
    }
  }
}

async function votesHandler ({ instance, 'video-id': videoId, format }: PathArgs) {
  const client = createClient(instance)
  const { likes, dislikes } = await client.get(`/videos/${videoId}`).json()

  switch (format) {
    case 'likes': {
      return {
        subject: 'likes',
        status: millify(likes),
        color: BRAND_COLOR
      }
    }
    case 'dislikes': {
      return {
        subject: 'dislikes',
        status: millify(dislikes),
        color: BRAND_COLOR
      }
    }
  }
  return {
    subject: 'votes',
    status: `${millify(likes)} 👍 ${millify(dislikes)} 👎`,
    color: BRAND_COLOR
  }
}

async function followersHandler ({ instance, account, channel }: PathArgs) {
  const client = createClient(instance)

  if (channel) {
    const { followersCount } = await client.get(`/video-channels/${channel}`).json()
    return {
      subject: 'followers',
      status: millify(followersCount),
      color: BRAND_COLOR
    }
  }

  const { followersCount } = await client.get(`/accounts/${account}`).json()
  return {
    subject: 'followers',
    status: millify(followersCount),
    color: BRAND_COLOR
  }
}


function createClient (instance: string) {
  const prefixUrl = `https://${instance}/api/v1`
  return got.extend({ prefixUrl })
}
