import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createServer } from 'node:http'
import { gzipSync } from 'node:zlib'
import test from 'node:test'
import { HTTPError, request, requestJson, requestText } from '../libs/http'

test('upstream requests preserve payloads, URL prefixes and HTTP policy with native fetch', async t => {
  const seen: { url: string, method?: string, headers: Record<string, any>, body: string }[] = []
  const upstream = createServer(async (req, res) => {
    let body = ''
    for await (const chunk of req) body += chunk
    seen.push({ url: req.url!, method: req.method, headers: req.headers, body })
    if (req.url === '/slow-headers') return
    if (req.url === '/slow-body') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.write('{')
      return
    }
    if (req.url === '/redirect') {
      res.writeHead(302, { Location: '/destination' })
      res.end('redirect')
      return
    }
    if (req.url?.startsWith('/error/')) {
      res.writeHead(Number(req.url.split('/').at(-1)))
      // An error must release the body even when the upstream never finishes it.
      res.write('private upstream payload')
      return
    }
    if (req.url === '/gzip') {
      res.writeHead(200, { 'Content-Encoding': 'gzip' })
      res.end(gzipSync('badge 徽章'))
      return
    }
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('X-Total', '42')
    res.end(JSON.stringify({ ok: true }))
  })
  upstream.listen(0, '127.0.0.1')
  await once(upstream, 'listening')
  t.after(() => { upstream.closeAllConnections(); upstream.close() })
  const base = `http://127.0.0.1:${(upstream.address() as { port: number }).port}`

  await t.test('nested prefixes and encoded paths retain their meaning', async () => {
    for (const suffix of ['', '/']) {
      const params = new URLSearchParams([['ref', 'feature/fix&more+plus'], ['label', 'one'], ['label', 'two']])
      await requestJson('projects/owner%2Frepo?discard=yes', {
        baseUrl: `${base}/api/v4${suffix}`, searchParams: params
      })
      const url = new URL(seen.at(-1)!.url, base)
      assert.equal(url.pathname, '/api/v4/projects/owner%2Frepo')
      assert.deepEqual([...url.searchParams], [...params])
      assert.equal(params.get('ref'), 'feature/fix&more+plus')
    }
    await requestJson('/-/revdeps/pkg', { baseUrl: `${base}/api` })
    assert.equal(seen.at(-1)!.url, '/api/-/revdeps/pkg')
    await requestJson(`${base}/query?license=true`)
    assert.equal(seen.at(-1)!.url, '/query?license=true')
  })

  await t.test('JSON POSTs preserve headers and normalize query values', async () => {
    assert.deepEqual(await requestJson(`${base}/post`, {
      method: 'POST', json: { query: '{ stars }' },
      headers: { accept: 'application/vnd.badgen+json', authorization: undefined },
      searchParams: { limit: 1, enabled: true, missing: undefined }
    }), { ok: true })
    const sent = seen.at(-1)!
    assert.equal(sent.method, 'POST')
    assert.equal(sent.url, '/post?limit=1&enabled=true')
    assert.equal(sent.headers.accept, 'application/vnd.badgen+json')
    assert.equal(sent.headers['content-type'], 'application/json')
    assert.equal(sent.headers['user-agent'], 'Mozilla/5.0 (compatible; Badgen/1.0; +https://badgen.net)')
    assert.equal(sent.headers.authorization, undefined)
    assert.deepEqual(JSON.parse(sent.body), { query: '{ stars }' })
  })

  await t.test('automatic redirects return a standard Response with headers and final URL', async () => {
    const response = await request(`${base}/redirect`)
    assert.ok(response instanceof Response)
    assert.equal(response.status, 200)
    assert.equal(response.redirected, true)
    assert.equal(response.url, `${base}/destination`)
    assert.equal(response.headers.get('x-total'), '42')
    assert.deepEqual(await response.json(), { ok: true })
  })

  await t.test('manual GET and HEAD redirects expose Location without following it', async () => {
    for (const method of ['GET', 'HEAD'] as const) {
      const count = seen.length
      const response = await request(`${base}/redirect`, { method, redirect: 'manual' })
      assert.equal(response.status, 302)
      assert.equal(response.headers.get('location'), '/destination')
      assert.equal(await response.text(), method === 'HEAD' ? '' : 'redirect')
      assert.equal(seen.length, count + 1)
    }
  })

  await t.test('HTTP errors carry status only, release bodies and do not retry', async () => {
    for (const status of [404, 429, 503]) {
      const count = seen.length
      await assert.rejects(requestJson(`${base}/error/${status}`, {
        redirect: 'manual', headers: { authorization: 'Bearer private-token' }
      }), error => {
        assert.ok(error instanceof HTTPError)
        assert.equal(error.status, status)
        assert.doesNotMatch(JSON.stringify(error), /private/)
        return true
      })
      assert.equal(seen.length, count + 1)
    }
  })

  await t.test('the deadline covers both delayed headers and unfinished response bodies', async () => {
    await assert.rejects(requestJson(`${base}/slow-headers`, { timeout: 100 }), { name: 'TimeoutError' })
    await assert.rejects(requestJson(`${base}/slow-body`, { timeout: 100 }), { name: /^(Timeout|Abort)Error$/ })
    await assert.rejects(requestText(`${base}/slow-body`, { timeout: 100 }), { name: /^(Timeout|Abort)Error$/ })
    const response = await request(`${base}/slow-body`, { timeout: 100 })
    await assert.rejects(response.arrayBuffer(), { name: /^(Timeout|Abort)Error$/ })
  })

  await t.test('compressed text is decoded by the native transport', async () => {
    assert.equal(await requestText(`${base}/gzip`), 'badge 徽章')
  })
})
