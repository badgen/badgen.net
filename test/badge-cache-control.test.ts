import assert from 'node:assert/strict'
import test from 'node:test'

import type { NextApiRequest, NextApiResponse } from 'next'

import { createBadgeCacheControlHeader, resolveBadgeCacheMaxAge } from '../libs/badge-cache-control'
import { serveBadgeNext } from '../libs/serve-badge-next'

test('resolveBadgeCacheMaxAge clamps low values and invalid input', () => {
  assert.equal(resolveBadgeCacheMaxAge('60', 3600), 300)
  assert.equal(resolveBadgeCacheMaxAge('abc', 3600), 300)
  assert.equal(resolveBadgeCacheMaxAge(undefined, 3600), 3600)
})

test('createBadgeCacheControlHeader uses the same value for client and CDN caches', () => {
  assert.equal(
    createBadgeCacheControlHeader(600),
    'public, max-age=600, s-maxage=600, stale-while-revalidate=86400'
  )
})

test('serveBadgeNext applies cache query to the response cache-control header', async () => {
  const req = {
    method: 'GET',
    query: { cache: '600' },
    headers: { host: 'badgen.net' },
  } as unknown as NextApiRequest

  const res = createMockNextApiResponse()

  await serveBadgeNext(req, res, {
    sMaxAge: 3600,
    params: {
      subject: 'build',
      status: 'passing',
      color: 'green',
    }
  })

  assert.equal(
    res.getHeader('cache-control'),
    'public, max-age=600, s-maxage=600, stale-while-revalidate=86400'
  )
})

test('serveBadgeNext preserves a preconfigured cache-control header', async () => {
  const req = {
    method: 'GET',
    query: { cache: '600' },
    headers: { host: 'badgen.net' },
  } as unknown as NextApiRequest

  const res = createMockNextApiResponse()
  res.setHeader('cache-control', 'public, max-age=42')

  await serveBadgeNext(req, res, {
    params: {
      subject: 'memo',
      status: 'ready',
      color: 'blue',
    }
  })

  assert.equal(res.getHeader('cache-control'), 'public, max-age=42')
})

function createMockNextApiResponse (): NextApiResponse {
  const headers = new Map<string, string>()

  return {
    statusCode: 200,
    getHeader (name: string) {
      return headers.get(name.toLowerCase())
    },
    setHeader (name: string, value: string) {
      headers.set(name.toLowerCase(), value)
      return this
    },
    send () {
      return this
    },
    status (code: number) {
      this.statusCode = code
      return this
    },
    end () {
      return this
    }
  } as unknown as NextApiResponse
}
