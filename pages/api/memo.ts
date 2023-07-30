import { kv } from '@vercel/kv'
import { createBadgenHandler, PathArgs, BadgenResponse } from '../../libs/create-badgen-handler-next'
import type { NextApiRequest, NextApiResponse } from 'next'

const help = `
A badge with memory.

## Usage

A <code>/memo</code> badge like:

    https://badgen.net/memo/a-badge-with-memory
    
can be created/updated using a <code>PUT</code> request with an <code>Authorization: Bearer XXXXXX</code> header:

    curl -LX PUT --header "Authorization: Bearer XXXXXX" https://badgen.net/memo/a-badge-with-memory/:label/:status/:color

Once created, this badge can only be updated with the same token, until it's expired.

## Expiration

A memo badge will be expired after <b>32 days</b> since it's last modification, but you can update it again within the period to keep the badge.

- When a badge is updated, it gets another 32 days lifespan,
- When a badge is expired, it gets cleared like never exists.

To keep a memo badge, you need to update the badge at least on a monthly basis. Usually this should be done in CI or Cron jobs.
`

export default createBadgenHandler({
  title: 'Memo',
  help,
  examples: {
    '/memo/deployed': 'memoized badge for deploy status',
  },
  handlers: {
    '/memo/:key': handler,
    '/memo/:key/:label/:status/:color': putHandler
  }
})

const MEMOIZED_TTL_SECONDS = 2764800 // 32 days

type MemoizedBadgeItem = {
  token: string;
  params: {
    label: string;
    status: string;
    color: string;
  }
}

async function handler ({ key }: PathArgs, req: NextApiRequest, res: NextApiResponse): Promise<BadgenResponse> {
  const storedData = await kv.get<MemoizedBadgeItem>(key)

  if (storedData === null || storedData === undefined) {
    res.setHeader('cache-control', `s-maxage=1, stale-while-revalidate=1`)

    return {
      subject: key,
      status: '404',
      color: 'grey'
    }
  } else {
    const ttl = await kv.ttl(key)
    res.setHeader('cache-control', `public, max-age=86400, s-maxage=60, stale-while-revalidate=${ttl}`)

    const { label, status, color } = storedData.params
    return { subject: label, status, color }
  }
}

async function putHandler (args: PathArgs, req: NextApiRequest, res: NextApiResponse): Promise<BadgenResponse> {
  // Only accept PUT request
  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT')
    res.status(405)
    return 'Method Not Allowed'
  }

  // Ensure token(authorization) is provided
  const token = req.headers['authorization']

  if (!token?.startsWith('Bearer ')) {
    res.status(401)
    return 'Unauthorized'
  }

  const { key, label, status, color } = args

  const newData: MemoizedBadgeItem = { token, params: { label, status, color }}

  const storedData = await kv.get<MemoizedBadgeItem>(key)

  if (storedData === null || storedData.token === token) {
    // If the key is not found, or found and token is validate, ser/update data and ttl
    await kv.set(key, newData, { ex: MEMOIZED_TTL_SECONDS })
    return JSON.stringify(newData.params)
  } else {
    // The key is found but token is invalid, refuse to update the data
    res.status(401)
    return 'Unauthorized'
  }

}
