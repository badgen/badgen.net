import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createServer, validateHeaderValue } from 'node:http'
import { createRequire } from 'node:module'
import test from 'node:test'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { BadgenHandler } from '../libs/create-badgen-handler-next'

// Imports below must not initialize a production Sentry transport.
delete process.env.SENTRY_DSN
const require = createRequire(import.meta.url)
const { createBadgenHandler, BadgenError } = require('../libs/create-badgen-handler-next')
const { requestJson } = require('../libs/http')
const fetchIcon = require('../libs/fetch-icon').default
const httpsHandler = require('../pages/api/https').default
const success = { subject: 'build', status: 'passing', color: 'green' }

function handlerFor (handler: BadgenHandler, options = {}) {
  return createBadgenHandler({
    title: 'Test', examples: { '/test/value': 'example' },
    handlers: { '/test/:value': handler }, ...options
  })
}

function request (url = '/test/value', query = {}, method = 'GET', host = 'badgen.net') {
  return { url, query, method, headers: { host } } as unknown as NextApiRequest
}

function response () {
  const headers = new Map<string, string>()
  return {
    statusCode: 200,
    body: '',
    getHeader (name: string) { return headers.get(name.toLowerCase()) },
    setHeader (name: string, value: string) {
      validateHeaderValue(name, value)
      headers.set(name.toLowerCase(), value)
      return this
    },
    status (code: number) { this.statusCode = code; return this },
    send (body: string) { this.body = body; return this },
    end (body = '') { this.body = body; return this }
  } as unknown as NextApiResponse & { body: string }
}

function assertError (res: ReturnType<typeof response>, code: number, status: string) {
  assert.equal(res.statusCode, code)
  assert.equal(res.getHeader('cache-control'), 'public, max-age=5, s-maxage=5')
  assert.equal(res.getHeader('content-type'), 'image/svg+xml;charset=utf-8')
  assert.equal(res.getHeader('access-control-allow-origin'), '*')
  assert.match(res.body, /<svg /)
  assert.ok(res.body.includes(status), res.body)
}

test('OPTIONS skips handlers, icons and malformed URI decoding; unknown routes skip icons', async t => {
  const network = t.mock.method(globalThis, 'fetch', () => { throw new Error('unexpected network request') })
  let calls = 0
  const handler = handlerFor(async () => { calls++; return success })
  const res = response()
  await handler(request('/test/%E0', { icon: 'https://example.invalid/icon.png' }, 'OPTIONS'), res)
  assert.equal(res.statusCode, 204)
  assert.equal(res.body, '')
  assert.equal(res.getHeader('access-control-allow-methods'), 'GET, OPTIONS')
  assert.equal(calls, 0)
  const missing = response()
  await handler(request('/test/extra/path', { icon: 'https://example.invalid/icon.png' }), missing)
  assertError(missing, 404, '404')
  assert.equal(network.mock.callCount(), 0)
})

test('declared errors preserve numeric status, HTTP code and color and replace success cache', async () => {
  const handler = handlerFor(async (_args, _req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=86400')
    throw new BadgenError({ status: 404, color: 'orange', code: 404, message: 'missing\n条目' })
  })
  const req = request('/test/value', { cache: '86400', color: 'green', label: 'override', icon: 'npm' })
  const res = response()
  await handler(req, res)
  assertError(res, 404, '404')
  assert.match(res.body, /#F73/)
  assert.doesNotMatch(res.body, /override|<image/)
  assert.equal(res.getHeader('Error-Message'), 'missing   ')
  assert.deepEqual(req.query, { cache: '86400', color: 'green', label: 'override', icon: 'npm' })
})

test('URI and rendering failures produce a safe SVG instead of escaping the error boundary', async t => {
  t.mock.method(console, 'error', () => {})
  const handler = handlerFor(async () => success)
  const malformed = response()
  await handler(request('/test/%E0', { scale: '10000', cache: '86400' }), malformed)
  assertError(malformed, 400, 'invalid URI')
  const broken = handlerFor(async () => null as any)
  const rendered = response()
  await broken(request('/test/value', { label: 'ignored', color: 'green' }), rendered)
  assertError(rendered, 500, '500')
  assert.doesNotMatch(rendered.body, /ignored/)
})

test('real upstream HTTP failures, timeout, bad JSON and unexpected errors follow the shared boundary', async t => {
  const errorLog = t.mock.method(console, 'error', () => {})
  const upstream = createServer((req, res) => {
    if (req.url === '/timeout') return
    if (req.url === '/timeout-body') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.write('{')
      return
    }
    res.statusCode = req.url === '/http' ? 403 : 200
    res.end('not JSON')
  })
  upstream.listen(0, '127.0.0.1')
  await once(upstream, 'listening')
  t.after(() => { upstream.closeAllConnections(); upstream.close() })
  const address = upstream.address() as { port: number }
  const base = `http://127.0.0.1:${address.port}`
  const handler = handlerFor(async ({ value }) => {
    if (value === 'unexpected') throw new Error('unexpected')
    return requestJson(`${base}/${value}`, {
      timeout: value.startsWith('timeout') ? 100 : 1000,
      headers: { authorization: 'Bearer regression-test-secret' }
    })
  })
  for (const [path, code, status] of [
    ['http', 502, '403'], ['timeout', 504, 'timeout'], ['timeout-body', 504, 'timeout'],
    ['json', 500, '500'], ['unexpected', 500, '500']
  ] as const) {
    const res = response()
    await handler(request(`/test/${path}`, { cache: '86400' }), res)
    assertError(res, code, status)
  }
  assert.equal(errorLog.mock.callCount(), 5)
  for (const call of errorLog.mock.calls) {
    for (const argument of call.arguments) {
      assert.equal(typeof argument, 'string')
      assert.ok(!argument.includes('regression-test-secret'))
    }
  }
})

test('string responses preserve handler statuses and headers, and memo-style cache remains authoritative', async () => {
  for (const code of [401, 405]) {
    const handler = handlerFor(async (_args, _req, res) => {
      res.status(code)
      res.setHeader('Allow', 'PUT')
      return 'Denied'
    })
    const res = response()
    await handler(request(), res)
    assert.equal(res.statusCode, code)
    assert.equal(res.body, 'Denied')
    assert.equal(res.getHeader('Allow'), 'PUT')
  }
  const handler = handlerFor(async (_args, _req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=60, stale-while-revalidate=42')
    return success
  })
  const res = response()
  await handler(request('/test/value', { cache: '7200' }), res)
  assert.equal(res.getHeader('Cache-Control'), 'public, max-age=86400, s-maxage=60, stale-while-revalidate=42')
})

test('HTTPS service keeps six-hour defaults, query clamping, numeric text and encoded paths', async t => {
  t.mock.method(httpsHandler.meta.handlers, '/https/:hostname/:pathname*', async ({ pathname }) => ({ subject: pathname, status: 123, color: 'blue' }))
  for (const [cache, seconds] of [[undefined, 21600], ['600', 600], ['1', 300]] as const) {
    const res = response()
    await httpsHandler(request('/https/example.com/hello%20world%2Fnext', { cache }), res)
    assert.equal(res.statusCode, 200)
    assert.equal(res.getHeader('Cache-Control'), `public, max-age=${seconds}, s-maxage=${seconds}, stale-while-revalidate=86400`)
    assert.ok(res.body.includes('hello world/next'))
    assert.ok(res.body.includes('123'))
  }
  const docs = response()
  await httpsHandler(request('/https'), docs)
  assert.equal(docs.statusCode, 200)
  assert.match(String(docs.getHeader('Content-Type')), /text\/html/)
  assert.match(docs.body, /With HTTPS Endpoint Badge/)
})

test('query, host and environment select flat style; classic remains the default', async () => {
  const handler = handlerFor(async () => success)
  const previous = process.env.BADGE_STYLE
  try {
    delete process.env.BADGE_STYLE
    for (const [query, host, flat] of [[{}, 'badgen.net', false], [{ style: 'flat' }, 'badgen.net', true], [{}, 'flat.badgen.net', true]] as const) {
      const res = response()
      await handler(request('/test/value', query, 'GET', host), res)
      assert.equal(res.body.includes('<linearGradient'), !flat)
    }
    process.env.BADGE_STYLE = 'flat'
    const res = response()
    await handler(request(), res)
    assert.doesNotMatch(res.body, /<linearGradient/)
  } finally {
    if (previous === undefined) delete process.env.BADGE_STYLE
    else process.env.BADGE_STYLE = previous
  }
})

test('invalid or missing hostname metadata cannot break success or error rendering', async t => {
  t.mock.method(console, 'error', () => {})
  const handler = handlerFor(async ({ value }) => {
    if (value === 'fail') throw new Error('unexpected')
    return success
  })
  const previous = process.env.BADGE_STYLE
  try {
    delete process.env.BADGE_STYLE
    for (const headers of [{ host: 'badgen.net', 'x-forwarded-host': '[' }, { host: 'badgen.net', 'x-forwarded-host': '%' }, {}]) {
      for (const [url, code, status] of [
        ['/test/value', 200, 'passing'], ['/test/%E0', 400, 'invalid URI'],
        ['/test/extra/path', 404, '404'], ['/test/fail', 500, '500']
      ] as const) {
        const req = request(url)
        req.headers = headers
        const res = response()
        await handler(req, res)
        if (code === 200) assert.equal(res.statusCode, 200)
        else assertError(res, code, status)
        assert.match(res.body, /<linearGradient/)
      }
      const req = request('/test/value', { style: 'flat' })
      req.headers = headers
      const queryStyle = response()
      await handler(req, queryStyle)
      assert.equal(queryStyle.statusCode, 200)
      assert.doesNotMatch(queryStyle.body, /<linearGradient/)
      process.env.BADGE_STYLE = 'flat'
      req.query = {}
      const environmentStyle = response()
      await handler(req, environmentStyle)
      assert.equal(environmentStyle.statusCode, 200)
      assert.doesNotMatch(environmentStyle.body, /<linearGradient/)
      delete process.env.BADGE_STYLE
    }
  } finally {
    if (previous === undefined) delete process.env.BADGE_STYLE
    else process.env.BADGE_STYLE = previous
  }
})

test('built-in icon width uses metadata, accepts overrides and leaves request query unchanged', async () => {
  const handler = handlerFor(async () => ({ ...success, subject: 'npm' }))
  for (const [icon, iconWidth, width] of [['npm', undefined, 20], ['npm', '17', 17], ['', undefined, 20]] as const) {
    const query = { icon, iconWidth }
    const req = request('/test/value', query)
    const res = response()
    await handler(req, res)
    assert.match(res.body, new RegExp(`<image[^>]*width="${width * 10}"`))
    assert.deepEqual(req.query, { icon, iconWidth })
  }
})

test('external icon starts alongside service work, preserves bytes and is optional on failure', async t => {
  const bytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0xff, 0x00, 0x80])
  let requested = false
  t.mock.method(globalThis, 'fetch', async () => {
    requested = true
    return new Response(bytes, { headers: { 'content-type': 'image/png' } })
  })
  const handler = handlerFor(async () => { assert.equal(requested, true); return success })
  const req = request('/test/value', { icon: 'https://example.invalid/icon.png' })
  const res = response()
  await handler(req, res)
  assert.ok(res.body.includes(`data:image/png;base64,${bytes.toString('base64')}`))
  assert.equal(req.query.icon, 'https://example.invalid/icon.png')
  t.mock.restoreAll()
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('optional icon failed') })
  const withoutIcon = response()
  await handler(req, withoutIcon)
  assert.equal(withoutIcon.statusCode, 200)
  assert.doesNotMatch(withoutIcon.body, /<image/)
})

test('icon fetch reads actual binary and SVG response bytes and ignores non-images and failures', async t => {
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0xff, 0x00, 0x80])
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><text>徽章</text></svg>')
  const upstream = createServer((req, res) => {
    if (req.url === '/png') res.setHeader('Content-Type', 'image/png')
    if (req.url === '/svg') res.setHeader('Content-Type', 'image/svg+xml')
    if (req.url === '/text') res.setHeader('Content-Type', 'text/html')
    if (req.url === '/error') res.statusCode = 503
    res.end(req.url === '/svg' ? svg : png)
  })
  upstream.listen(0, '127.0.0.1')
  await once(upstream, 'listening')
  t.after(() => { upstream.closeAllConnections(); upstream.close() })
  const address = upstream.address() as { port: number }
  const base = `http://127.0.0.1:${address.port}`
  assert.equal(await fetchIcon(`${base}/png`), `data:image/png;base64,${png.toString('base64')}`)
  assert.equal(await fetchIcon(`${base}/svg`), `data:image/svg+xml;base64,${svg.toString('base64')}`)
  for (const path of ['text', 'missing-type', 'error']) assert.equal(await fetchIcon(`${base}/${path}`), undefined)
})
