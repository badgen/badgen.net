import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import test from 'node:test'

delete process.env.SENTRY_DSN
const require = createRequire(import.meta.url)
const github = require('../pages/api/github').default

test('GitHub open-issues counts issues without pull requests via GraphQL', async t => {
  const previous = {
    GITHUB_API_GRAPHQL: process.env.GITHUB_API_GRAPHQL,
    GITHUB_TOKENS: process.env.GITHUB_TOKENS
  }
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  })

  const requests: { method?: string, url?: string, authorization?: string, query: string }[] = []
  const upstream = createServer(async (req, res) => {
    let body = ''
    for await (const chunk of req) body += chunk
    requests.push({
      method: req.method,
      url: req.url,
      authorization: req.headers.authorization,
      query: JSON.parse(body).query
    })
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ data: { repository: { issues: { totalCount: 4 } } } }))
  })
  upstream.listen(0, '127.0.0.1')
  await once(upstream, 'listening')
  t.after(() => { upstream.closeAllConnections(); upstream.close() })

  const { port } = upstream.address() as { port: number }
  process.env.GITHUB_API_GRAPHQL = `http://127.0.0.1:${port}/graphql`
  process.env.GITHUB_TOKENS = 'test-token'

  const handler = github.meta.handlers['/github/:topic<issues|open-issues|closed-issues>/:owner/:repo']
  const badge = await handler({ topic: 'open-issues', owner: 'badgen', repo: 'badgen.net' })

  assert.equal(badge.subject, 'open issues')
  assert.equal(badge.status, '4')
  assert.equal(badge.color, 'blue')
  assert.equal(requests.length, 1)
  assert.equal(requests[0].method, 'POST')
  assert.equal(requests[0].url, '/graphql')
  assert.equal(requests[0].authorization, 'token test-token')
  assert.match(requests[0].query, /issues\(first:\s*1,\s*states:\s*\[OPEN\]\)\s*\{\s*totalCount\s*\}/)
})
