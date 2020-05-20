import got from '../libs/got'
import { basename, extname } from 'path'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const TIDELIFT_BADGE_URL = 'https://tidelift.com/badges/package/'

const client = got.extend({ prefixUrl: TIDELIFT_BADGE_URL })

export default createBadgenHandler({
  title: 'Tidelift',
  examples: {
    '/tidelift/npm/minimist': 'subscription',
    '/tidelift/npm/got': 'subscription'
  },
  handlers: {
    '/tidelift/:platform/:name': handler
  }
})

async function handler ({ platform, name }: PathArgs) {
  const resp = await client.get(`${platform}/${name}`, { followRedirect: false })
  // this shouldn't happen, but in case it happens
  if (!resp.headers.location) {
    throw new Error(`Unknown Tidelift status: ${platform}/${name}`)
  }
  const { pathname } = new URL(resp.headers.location)
  const [status, color] = decodeURIComponent(basename(pathname, extname(pathname)))
    .split('-')
    .filter(Boolean)

  return {
    subject: 'tidelift',
    status,
    color
  }
}
