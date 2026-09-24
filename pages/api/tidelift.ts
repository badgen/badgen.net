import { request } from '../../libs/http'
import { basename, extname } from 'path'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

const TIDELIFT_BADGE_URL = 'https://tidelift.com/badges/package/'

const requestOptions = { baseUrl: TIDELIFT_BADGE_URL }

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
  const resp = await request(`${platform}/${name}`, { ...requestOptions, redirect: 'manual' })
  await resp.body?.cancel()
  const params = parseRedirectUrl(resp.headers.get('location') || undefined)
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
