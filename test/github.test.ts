import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import test from 'node:test'

delete process.env.SENTRY_DSN
const require = createRequire(import.meta.url)
const github = require('../pages/api/github').default

test('GitHub open-issues uses the GraphQL IssueConnection contract', async t => {
  const envKeys = ['GITHUB_API_GRAPHQL', 'GITHUB_TOKENS', 'GH_TOKENS'] as const
  const previous = envKeys.map(key => process.env[key])
  t.after(() => {
    envKeys.forEach((key, index) => {
      if (previous[index] === undefined) delete process.env[key]
      else process.env[key] = previous[index]
    })
  })
  t.mock.method(console, 'error', () => {})

  // Response shapes follow GitHub's GraphQL IssueConnection and errors contract:
  // https://docs.github.com/en/graphql/reference/objects#issueconnection
  // https://docs.github.com/en/graphql/guides/forming-calls-with-graphql
  let responseStatus = 200
  let responseBody: unknown = { data: { repository: { issues: { totalCount: 4 } } } }
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
    res.statusCode = responseStatus
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(responseBody))
  })
  upstream.listen(0, '127.0.0.1')
  await once(upstream, 'listening')
  t.after(() => { upstream.closeAllConnections(); upstream.close() })

  const { port } = upstream.address() as { port: number }
  process.env.GITHUB_API_GRAPHQL = `http://127.0.0.1:${port}/graphql`
  process.env.GITHUB_TOKENS = 'test-token'

  const handler = github.meta.handlers['/github/:topic<issues|open-issues|closed-issues>/:owner/:repo']
  const badge = () => handler({ topic: 'open-issues', owner: 'badgen', repo: 'badgen.net' })

  await t.test('requests only open issues and renders the totalCount, not the REST combined count', async () => {
    responseBody = { data: { repository: { issues: { totalCount: 4 } } } }
    const result = await badge()
    assert.deepEqual(result, { subject: 'open issues', status: '4', color: 'blue' })
    assert.equal(requests.length, 1)
    assert.equal(requests[0].method, 'POST')
    assert.equal(requests[0].url, '/graphql')
    assert.equal(requests[0].authorization, 'token test-token')
    assert.match(requests[0].query, /repository\(owner:"badgen", name:"badgen.net"\)/)
    assert.match(requests[0].query, /issues\(first:\s*1,\s*states:\s*\[OPEN\]\)\s*\{\s*totalCount\s*\}/)
    assert.doesNotMatch(requests[0].query, /pullRequests/)
  })

  await t.test('accepts an empty issues connection', async () => {
    responseBody = { data: { repository: { issues: { totalCount: 0 } } } }
    const result = await badge()
    assert.deepEqual(result, { subject: 'open issues', status: '0', color: 'blue' })
  })

  await t.test('handles a missing repository', async () => {
    responseBody = { data: { repository: null } }
    const result = await badge()
    assert.equal(result.status, 'not found')
  })

  await t.test('propagates GraphQL errors returned with HTTP 200', async () => {
    responseBody = { errors: [{ type: 'FORBIDDEN', message: 'Resource not accessible by integration' }] }
    await assert.rejects(badge(), { name: 'BadgenError', status: 'FORBIDDEN' })
  })

  await t.test('propagates HTTP errors from the GraphQL endpoint', async () => {
    responseStatus = 403
    responseBody = { message: 'API rate limit exceeded' }
    await assert.rejects(badge(), { name: 'HTTPError', status: 403 })
    responseStatus = 200
  })

  await t.test('rejects a missing token before making a request', async () => {
    delete process.env.GITHUB_TOKENS
    delete process.env.GH_TOKENS
    const before = requests.length
    await assert.rejects(badge(), { name: 'BadgenError', status: 'token required' })
    assert.equal(requests.length, before)
  })
})
