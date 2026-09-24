import { requestJson } from '../../libs/http'
import { millify } from '../../libs/utils'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

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
    '/peertube/:instance/:topic<comments|views>/:video-uuid': handler,
    '/peertube/:instance/:topic<votes>/:video-uuid/:format?<likes|dislikes>': votesHandler,
    '/peertube/:instance/:topic<followers>/:account/:channel?': followersHandler
  }
})

async function handler ({ instance, topic, 'video-uuid': videoUUID }: PathArgs) {
  const requestOptions = getRequestOptions(instance)

  switch (topic) {
    case 'comments': {
      const { total } = await requestJson<any>(`videos/${videoUUID}/comment-threads`, requestOptions)
      return {
        subject: 'comments',
        status: millify(total),
        color: BRAND_COLOR
      }
    }
    case 'views': {
      const { views } = await requestJson<any>(`videos/${videoUUID}`, requestOptions)
      return {
        subject: 'views',
        status: millify(views),
        color: BRAND_COLOR
      }
    }
    default:
      return {
        subject: 'peertube',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}

async function votesHandler ({ instance, 'video-uuid': videoUUID, format }: PathArgs) {
  const requestOptions = getRequestOptions(instance)
  console.log(33)
  const { likes, dislikes } = await requestJson<any>(`videos/${videoUUID}`, requestOptions)
  console.log(44)

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
  const requestOptions = getRequestOptions(instance)

  if (channel) {
    const { followersCount } = await requestJson<any>(`video-channels/${channel}`, requestOptions)
    return {
      subject: 'followers',
      status: millify(followersCount),
      color: BRAND_COLOR
    }
  }

  const { followersCount } = await requestJson<any>(`accounts/${account}`, requestOptions)
  return {
    subject: 'followers',
    status: millify(followersCount),
    color: BRAND_COLOR
  }
}


function getRequestOptions (instance: string) {
  const baseUrl = `https://${instance}/api/v1`
  return { baseUrl }
}
