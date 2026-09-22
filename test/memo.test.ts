import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'
import type { NextApiRequest, NextApiResponse } from 'next'

// Replace the SDK before loading the real handler; tests must never use production KV.
delete process.env.SENTRY_DSN
const require = createRequire(import.meta.url)
const kv = {
  async eval (_script: string, _keys: string[], _args: unknown[]): Promise<number> { throw new Error('Unexpected KV eval') },
  async get (_key: string): Promise<unknown> { throw new Error('Unexpected KV get') },
  async ttl (_key: string): Promise<number> { throw new Error('Unexpected KV ttl') }
}
const sdkPath = require.resolve('@vercel/kv')
require.cache[sdkPath] = { id: sdkPath, filename: sdkPath, loaded: true, exports: { kv } } as NodeModule
const memo = require('../pages/api/memo').default
const ttlSeconds = 2764800

async function invoke (path: string, token?: string, method = 'PUT') {
  const headers = new Map<string, string>()
  const req = {
    url: `/memo/${path}`, method, query: {},
    headers: { host: 'badgen.net', authorization: token }
  } as unknown as NextApiRequest
  const res = {
    statusCode: 200, body: '',
    getHeader (name: string) { return headers.get(name.toLowerCase()) },
    setHeader (name: string, value: string) { headers.set(name.toLowerCase(), value); return this },
    status (code: number) { this.statusCode = code; return this },
    send (body: string) { this.body = body; return this },
    end (body = '') { this.body = body; return this }
  } as unknown as NextApiResponse & { body: string }
  await memo(req, res)
  return res
}

test('memo rejects wrong methods and missing authorization before any storage work', async t => {
  const evalCall = t.mock.method(kv, 'eval', async () => { throw new Error('Must not reach storage') })
  const wrongMethod = await invoke('key/build/passing/green', 'Bearer owner', 'GET')
  assert.equal(wrongMethod.statusCode, 405)
  assert.equal(wrongMethod.getHeader('Allow'), 'PUT')
  assert.equal(wrongMethod.body, 'Method Not Allowed')
  for (const token of [undefined, 'Basic owner']) {
    const res = await invoke('key/build/passing/green', token)
    assert.equal(res.statusCode, 401)
    assert.equal(res.body, 'Unauthorized')
  }
  assert.equal(evalCall.mock.callCount(), 0)
})

test('memo submits one conditional update with the existing key, JSON schema, token and TTL', async t => {
  const evalCall = t.mock.method(kv, 'eval', async () => 1)
  const res = await invoke('my-key/build/passing/green', 'Bearer complete token')
  assert.equal(res.statusCode, 200)
  assert.deepEqual(JSON.parse(res.body), { label: 'build', status: 'passing', color: 'green' })
  assert.equal(evalCall.mock.callCount(), 1)
  const [script, keys, args] = evalCall.mock.calls[0].arguments
  assert.equal(typeof script, 'string')
  assert.deepEqual(keys, ['my-key'])
  assert.equal(args[0], 'Bearer complete token')
  assert.equal(args[2], ttlSeconds)
  assert.deepEqual(JSON.parse(String(args[1])), {
    token: 'Bearer complete token', params: { label: 'build', status: 'passing', color: 'green' }
  })
  t.mock.restoreAll()
  t.mock.method(kv, 'eval', async () => 0)
  const denied = await invoke('my-key/build/failed/red', 'Bearer different owner')
  assert.equal(denied.statusCode, 401)
  assert.equal(denied.body, 'Unauthorized')
})

test('memo GET keeps existing badge data and cache policy', async t => {
  t.mock.method(kv, 'get', async () => ({ token: 'Bearer owner', params: { label: 'release', status: 'ready', color: 'green' } }))
  t.mock.method(kv, 'ttl', async () => 1234)
  const stored = await invoke('my-key', undefined, 'GET')
  assert.equal(stored.statusCode, 200)
  assert.match(stored.body, /release: ready/)
  assert.equal(stored.getHeader('Cache-Control'), 'public, max-age=86400, s-maxage=60, stale-while-revalidate=1234')
  t.mock.restoreAll()
  t.mock.method(kv, 'get', async () => null)
  const missing = await invoke('missing', undefined, 'GET')
  assert.equal(missing.statusCode, 200)
  assert.match(missing.body, /missing: 404/)
  assert.equal(missing.getHeader('Cache-Control'), 's-maxage=1, stale-while-revalidate=1')
})
