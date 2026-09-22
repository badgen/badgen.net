import assert from 'node:assert/strict'
import { execFile, spawn, spawnSync } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, rm } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'
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
const execute = promisify(execFile)
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

const redisAvailable = ['redis-server', 'redis-cli'].every(binary => spawnSync(binary, ['--version']).status === 0)

test('memo Lua enforces ownership and expiry in real Redis', {
  skip: redisAvailable ? false : 'Install redis-server and redis-cli to exercise the atomic Lua contract'
}, async t => {
  const directory = await mkdtemp(join(tmpdir(), 'badgen-memo-'))
  const socket = join(directory, 'redis.sock')
  const redis = spawn('redis-server', [
    '--port', '0', '--unixsocket', socket, '--unixsocketperm', '700',
    '--save', '', '--appendonly', 'no', '--dir', directory
  ], { stdio: ['ignore', 'pipe', 'pipe'] })
  t.after(async () => {
    if (redis.pid && redis.exitCode === null && redis.signalCode === null) {
      const exited = once(redis, 'exit')
      redis.kill('SIGTERM')
      await exited
    }
    await rm(directory, { recursive: true, force: true })
  })
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Redis did not start within 5 seconds')), 5000)
    let output = ''
    const finish = (error?: Error) => {
      clearTimeout(timeout)
      if (error) reject(error)
      else resolve()
    }
    redis.once('error', finish)
    redis.once('exit', () => finish(new Error(`Redis exited before readiness: ${output}`)))
    redis.stdout.on('data', data => {
      output += data.toString()
      if (output.includes('Ready to accept connections')) finish()
    })
    redis.stderr.on('data', data => { output += data.toString() })
  })
  async function command (...args: Array<string | number>) {
    const { stdout } = await execute('redis-cli', ['-s', socket, '--json', ...args.map(String)])
    return JSON.parse(stdout)
  }
  t.mock.method(kv, 'eval', async (script, keys, args) => command('EVAL', script, keys.length, ...keys, ...args.map(String)))

  await t.test('concurrent first writes with different tokens have exactly one winner', async () => {
    const responses = await Promise.all([
      invoke('race/build/one/green', 'Bearer first'),
      invoke('race/build/two/blue', 'Bearer second')
    ])
    assert.deepEqual(responses.map(res => res.statusCode).sort(), [200, 401])
    const winner = responses.findIndex(res => res.statusCode === 200)
    const stored = JSON.parse(await command('GET', 'race'))
    assert.equal(stored.token, winner === 0 ? 'Bearer first' : 'Bearer second')
    assert.equal(stored.params.status, winner === 0 ? 'one' : 'two')
    const ttl = await command('TTL', 'race')
    assert.ok(ttl <= ttlSeconds && ttl >= ttlSeconds - 2)
  })

  await t.test('same-token update replaces the badge and renews 32-day expiry', async () => {
    await invoke('renew/build/old/grey', 'Bearer owner')
    await command('EXPIRE', 'renew', 30)
    const updated = await invoke('renew/release/new/green', 'Bearer owner')
    assert.equal(updated.statusCode, 200)
    assert.deepEqual(JSON.parse(await command('GET', 'renew')), {
      token: 'Bearer owner', params: { label: 'release', status: 'new', color: 'green' }
    })
    const ttl = await command('TTL', 'renew')
    assert.ok(ttl <= ttlSeconds && ttl >= ttlSeconds - 2)
  })

  await t.test('wrong token changes neither the old JSON value nor its expiration', async () => {
    const raw = JSON.stringify({ token: 'Bearer owner', params: { label: 'old', status: 'ready', color: 'green' } })
    await command('SET', 'protected', raw, 'EX', 120)
    const ttlBefore = await command('PTTL', 'protected')
    const before = Date.now()
    const denied = await invoke('protected/other/changed/red', 'Bearer intruder')
    assert.equal(denied.statusCode, 401)
    assert.equal(await command('GET', 'protected'), raw)
    const ttlAfter = await command('PTTL', 'protected')
    assert.ok(ttlAfter <= ttlBefore && ttlAfter >= ttlBefore - (Date.now() - before) - 100)
  })

  await t.test('existing legacy JSON needs no migration and only its original token may update', async () => {
    const legacy = { token: 'Bearer legacy owner', params: { label: 'original', status: 'ready', color: 'blue' } }
    await command('SET', 'legacy', JSON.stringify(legacy), 'EX', 60)
    assert.equal((await invoke('legacy/release/changed/green', 'Bearer legacy')).statusCode, 401)
    assert.equal((await invoke('legacy/release/changed/green', legacy.token)).statusCode, 200)
    assert.deepEqual(JSON.parse(await command('GET', 'legacy')), {
      token: legacy.token, params: { label: 'release', status: 'changed', color: 'green' }
    })
  })

  await t.test('an expired key can be claimed by a different owner', async () => {
    await invoke('expired/build/old/grey', 'Bearer former owner')
    await command('PEXPIREAT', 'expired', Date.now() - 1)
    assert.equal(await command('GET', 'expired'), null)
    const recreated = await invoke('expired/build/new/green', 'Bearer new owner')
    assert.equal(recreated.statusCode, 200)
    assert.equal(JSON.parse(await command('GET', 'expired')).token, 'Bearer new owner')
    assert.ok(await command('TTL', 'expired') >= ttlSeconds - 2)
  })
})
