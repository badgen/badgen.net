import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import test from 'node:test'

delete process.env.SENTRY_DSN
const require = createRequire(import.meta.url)
const coveralls = require('../pages/api/coveralls').default
const tidelift = require('../pages/api/tidelift').default
const pub = require('../pages/api/pub').default
const codeberg = require('../pages/api/codeberg').default

test('redirect and header-based badge services retain their upstream contracts', async t => {
  const requests: { url: URL, method?: string }[] = []
  const upstream = createServer((req, res) => {
    if (req.url?.startsWith('/coveralls.io/')) {
      res.writeHead(302, { Location: '/coveralls_87.svg' })
    } else if (req.url?.startsWith('/tidelift.com/')) {
      res.writeHead(302, { Location: `http://${req.headers.host}/supported-green.svg` })
    } else if (req.url?.startsWith('/pub.dev/')) {
      res.writeHead(302, { Location: '/missing' })
    } else if (req.url?.startsWith('/codeberg.org/')) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'X-Total-Count': '42' })
      res.end('[]')
      return
    } else {
      res.writeHead(500)
    }
    res.end('upstream body')
  })
  upstream.listen(0, '127.0.0.1')
  await once(upstream, 'listening')
  t.after(() => { upstream.closeAllConnections(); upstream.close() })
  const base = `http://127.0.0.1:${(upstream.address() as { port: number }).port}`
  const originalFetch = globalThis.fetch
  t.mock.method(globalThis, 'fetch', (url: URL, options: RequestInit) => {
    requests.push({ url, method: options.method })
    return originalFetch(`${base}/${url.hostname}${url.pathname}${url.search}`, options)
  })

  const coverage = await coveralls.meta.handlers['/coveralls/c/:vcs<github|bitbucket>/:owner/:repo/:branch?']({
    vcs: 'github', owner: 'owner', repo: 'repo', branch: 'feature/a&b'
  })
  assert.equal(coverage.status, '87%')
  assert.equal(requests.at(-1)?.method, 'HEAD')
  assert.equal(requests.at(-1)?.url.searchParams.get('branch'), 'feature/a&b')
  assert.equal(requests.length, 1)

  const subscription = await tidelift.meta.handlers['/tidelift/:platform/:name']({ platform: 'npm', name: 'pkg' })
  assert.equal(subscription.status, 'supported')
  assert.equal(subscription.color, 'green')
  assert.equal(requests.length, 2)

  await assert.rejects(pub.meta.handlers['/pub/:topic<license>/:pkg']({ topic: 'license', pkg: 'missing' }), {
    status: 404
  })
  assert.equal(requests.length, 3)

  const handler = Object.values(codeberg.meta.handlers)[0] as (args: object) => Promise<any>
  const count = await handler({ topic: 'releases', owner: 'owner', repo: 'repo' })
  assert.equal(count.status, '42')
  assert.equal(requests.length, 4)
})
