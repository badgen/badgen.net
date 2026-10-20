import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

delete process.env.SENTRY_DSN
const require = createRequire(import.meta.url)
const github = require('../pages/api/github').default

test('GitHub open-issues counts issues, not pull requests', async t => {
  const previousToken = process.env.GITHUB_TOKENS
  process.env.GITHUB_TOKENS = 'test-token'
  t.after(() => {
    if (previousToken === undefined) delete process.env.GITHUB_TOKENS
    else process.env.GITHUB_TOKENS = previousToken
  })

  let requests = 0
  t.mock.method(globalThis, 'fetch', async (url: URL, options: RequestInit) => {
    requests++
    // The REST repository counter includes PRs; this badge must use GraphQL.
    assert.equal(url.pathname, '/graphql')
    const { query } = JSON.parse(String(options.body))
    assert.match(query, /issues\([^)]*states:\s*\[OPEN\][^)]*\)\s*\{\s*totalCount\s*\}/)
    return Response.json({ data: { repository: { issues: { totalCount: 4 } } } })
  })

  const handler = github.meta.handlers['/github/:topic<issues|open-issues|closed-issues>/:owner/:repo']
  const badge = await handler({ topic: 'open-issues', owner: 'badgen', repo: 'badgen.net' })

  assert.deepEqual(badge, { subject: 'open issues', status: '4', color: 'blue' })
  assert.equal(requests, 1)
})
