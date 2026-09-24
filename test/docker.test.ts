import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import test from 'node:test'
import type { NextApiRequest, NextApiResponse } from 'next'

delete process.env.SENTRY_DSN
const require = createRequire(import.meta.url)
const docker = require('../pages/api/docker').default

function response () {
  const headers = new Map<string, string>()
  return {
    statusCode: 200,
    body: '',
    getHeader (name: string) { return headers.get(name.toLowerCase()) },
    setHeader (name: string, value: string) { headers.set(name.toLowerCase(), value); return this },
    status (code: number) { this.statusCode = code; return this },
    send (body: string) { this.body = body; return this },
    end (body = '') { this.body = body; return this }
  } as unknown as NextApiResponse & { body: string }
}

test('Docker size reads only its target tag and preserves image selection and upstream errors', async t => {
  let status = 200
  const images = [
    { architecture: 'arm', variant: 'v6', size: 1048576 },
    { architecture: 'amd64', size: 2621440 },
    { architecture: 'arm', variant: 'v7', size: 3670016 }
  ]
  const upstream = createServer((_req, res) => {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(status === 200 ? { images } : { message: 'upstream error' }))
  })
  upstream.listen(0, '127.0.0.1')
  await once(upstream, 'listening')
  t.after(() => { upstream.closeAllConnections(); upstream.close() })
  const address = upstream.address() as { port: number }
  const requests: string[] = []
  const originalFetch = globalThis.fetch
  t.mock.method(globalThis, 'fetch', (url: URL, options: RequestInit) => {
    requests.push(String(url))
    return originalFetch(`http://127.0.0.1:${address.port}${url.pathname}`, options)
  })
  t.mock.method(console, 'error', () => {})

  async function badge (suffix: string, label: string, code = 200) {
    const count = requests.length
    const res = response()
    await docker({
      url: `/docker/size/${suffix}`, query: {}, method: 'GET', headers: { host: 'badgen.net' }
    } as NextApiRequest, res)
    assert.equal(requests.length, count + 1)
    assert.equal(res.statusCode, code, res.body)
    assert.ok(res.body.includes(`aria-label="${label}"`), res.body)
    return res
  }

  await t.test('defaults to latest and amd64 without listing repository tags', async () => {
    await badge('library/node', 'docker size: 2.50 MB')
    assert.equal(requests.at(-1), 'https://hub.docker.com/v2/namespaces/library/repositories/node/tags/latest')
  })

  await t.test('selects the requested variant and safely encodes each upstream path segment', async () => {
    await badge('scope%20name/repo%2Fname/tag%3Fquery%26hash%23/arm/v7', 'docker size: 3.50 MB')
    assert.equal(requests.at(-1), 'https://hub.docker.com/v2/namespaces/scope%20name/repositories/repo%2Fname/tags/tag%3Fquery%26hash%23')
    await badge('library/node/24-alpine/arm', 'docker size: 1.00 MB')
    assert.equal(requests.at(-1), 'https://hub.docker.com/v2/namespaces/library/repositories/node/tags/24-alpine')
  })

  await t.test('retains unknown tag, architecture and variant badges', async () => {
    status = 404
    await badge('library/node/missing', 'docker: unknown tag')
    status = 200
    await badge('library/node/latest/missing', 'docker: unknown architecture')
    await badge('library/node/latest/arm/missing', 'docker: unknown variant')
  })

  await t.test('rate limiting and upstream failures remain HTTP 502 with short caching', async () => {
    for (const upstreamStatus of [429, 503]) {
      status = upstreamStatus
      const res = await badge('library/node/latest', `docker: ${upstreamStatus}`, 502)
      assert.equal(res.getHeader('Cache-Control'), 'public, max-age=5, s-maxage=5')
      assert.doesNotMatch(res.body, /unknown tag/)
    }
  })
})
