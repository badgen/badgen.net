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

test('Docker layers and metadata share registry traversal without changing selection or errors', async t => {
  const requests: Array<{ path: string, authorization?: string, accept?: string }> = []
  let failure = ''
  let missingHistory = false
  const upstream = createServer((req, res) => {
    const url = new URL(req.url!, 'http://localhost')
    requests.push({ path: url.pathname, authorization: req.headers.authorization, accept: req.headers.accept })
    res.setHeader('Content-Type', 'application/json')
    if (failure === url.pathname) {
      res.statusCode = 503
      res.end('{}')
      return
    }
    const bodies = {
      '/token': { token: 'image-token' },
      '/v2/library/node/manifests/latest': { manifests: [
        { platform: { architecture: 'amd64' }, digest: 'amd' },
        { platform: { architecture: 'arm', variant: 'v6' }, digest: 'arm6' },
        { platform: { architecture: 'arm', variant: 'v7' }, digest: 'arm7' }
      ] },
      '/v2/library/node/manifests/amd': { config: { digest: 'config' } },
      '/v2/library/node/manifests/arm7': { config: { digest: 'config' } },
      '/v2/library/node/blobs/config': {
        history: missingHistory ? undefined : [{}, {}, {}],
        container_config: { Labels: {
          'org.label-schema.version': 'legacy',
          'org.opencontainers.image.version': 'modern',
          'org.opencontainers.image.title': 'Node'
        } }
      }
    }
    if (url.pathname === '/token') {
      assert.equal(url.searchParams.get('service'), 'registry.docker.io')
      assert.equal(url.searchParams.get('scope'), 'repository:library/node:pull')
    }
    res.end(JSON.stringify(bodies[url.pathname] || {}))
  })
  upstream.listen(0, '127.0.0.1')
  await once(upstream, 'listening')
  const endpoint = `http://127.0.0.1:${(upstream.address() as { port: number }).port}/`
  const previous = [process.env.DOCKER_AUTHENTICATION_API, process.env.DOCKER_REGISTRY_API]
  process.env.DOCKER_AUTHENTICATION_API = endpoint
  process.env.DOCKER_REGISTRY_API = endpoint
  t.after(() => {
    for (const [i, key] of ['DOCKER_AUTHENTICATION_API', 'DOCKER_REGISTRY_API'].entries()) {
      if (previous[i] === undefined) delete process.env[key]
      else process.env[key] = previous[i]
    }
    upstream.closeAllConnections()
    upstream.close()
  })
  t.mock.method(console, 'error', () => {})

  async function badge(path: string, label: string, code = 200) {
    requests.length = 0
    const res = response()
    await docker({ url: `/docker/${path}`, query: {}, method: 'GET', headers: { host: 'badgen.net' } } as NextApiRequest, res)
    assert.equal(res.statusCode, code, res.body)
    assert.ok(res.body.includes(`aria-label="${label}"`), res.body)
    return res
  }

  await badge('layers/library/node', 'docker layers: 3')
  assert.deepEqual(requests.map(r => r.path), [
    '/token', '/v2/library/node/manifests/latest', '/v2/library/node/manifests/amd', '/v2/library/node/blobs/config'
  ])
  assert.ok(requests.slice(1).every(r => r.authorization === 'Bearer image-token'))
  assert.equal(requests[1].accept, 'application/vnd.docker.distribution.manifest.list.v2+json')
  assert.equal(requests[2].accept, requests[1].accept)
  assert.equal(requests[3].accept, 'application/vnd.docker.image.config+json')

  await badge('metadata/version/library/node/latest/arm/v7', 'version: legacy')
  assert.equal(requests[2].path, '/v2/library/node/manifests/arm7')
  await badge('metadata/title/library/node', 'title: Node')
  await badge('metadata/missing/library/node', 'docker metadata: error getting missing')
  missingHistory = true
  await badge('layers/library/node', 'docker layers: error getting layers')
  missingHistory = false

  for (const [suffix, status] of [
    ['missing', 'unknown tag'], ['latest/other', 'unknown architecture'], ['latest/arm/v8', 'unknown variant']
  ]) {
    await badge(`layers/library/node/${suffix}`, `docker: ${status}`, 500)
    assert.equal(requests.length, 2)
  }
  const stages = ['/token', '/v2/library/node/manifests/latest', '/v2/library/node/manifests/amd', '/v2/library/node/blobs/config']
  for (const [index, stage] of stages.entries()) {
    failure = stage
    const res = await badge('layers/library/node', 'docker: 503', 502)
    assert.equal(requests.length, index + 1)
    assert.equal(res.getHeader('Cache-Control'), 'public, max-age=5, s-maxage=5')
  }
})
