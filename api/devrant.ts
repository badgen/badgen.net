import got from '../libs/got'
import { millify } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const BRAND_COLOR = 'F99A66'
const DEVRANT_API_URL = 'https://devrant.com/api'

const client = got.extend({ prefixUrl: DEVRANT_API_URL })

const upperCaseFirst = (input: string) => input.charAt(0).toUpperCase() + input.substr(1)

export default createBadgenHandler({
  title: 'devRant',
  examples: {
    '/devrant/score/22941?icon=devrant': 'score',
    '/devrant/score/Tooma95?icon=devrant': 'score'
  },
  handlers: {
    '/devrant/:topic<score>/:user-id<\\d+>': userIdHandler,
    '/devrant/:topic<score>/:username': usernameHandler,
  }
})

async function usernameHandler ({ username }: PathArgs) {
  const searchParams = { username, app: 3 }
  const { user_id } = await client.get('get-user-id', { searchParams }).json<any>()
  return userIdHandler({ 'user-id': user_id })
}

async function userIdHandler ({ 'user-id': userId }: PathArgs) {
  const searchParams = { app: 3 }
  const { profile } = await client.get(`users/${userId}`, { searchParams }).json<any>()
  return {
    subject: upperCaseFirst(profile.username),
    status: millify(profile.score),
    color: BRAND_COLOR
  }
}
