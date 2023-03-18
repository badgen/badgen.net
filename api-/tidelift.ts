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
  const params = parseRedirectUrl(resp.headers.location)
  return params || {
    subject: 'tidelift',
    status: 'unknown',
    color: 'grey'
  }
}

function parseRedirectUrl(input?: string) {
  const redirectUrl = safeURL(input)
  if (!redirectUrl) return
  const path = decodeURIComponent(redirectUrl.pathname)
  const route = basename(path, extname(path))
  const [status, color] = route.split('-').filter(Boolean)
  if (!status || !color) return
  return {
    subject: 'tidelift',
    status: status?.replace(/!$/, ''),
    color
  }
}

function safeURL(input?: string) {
  if (!input) return
  try {
    return new URL(input)
  } catch { /* ignore */ }
}
