import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import test from 'node:test'
import type { NextApiRequest, NextApiResponse } from 'next'

delete process.env.SENTRY_DSN
const require = createRequire(import.meta.url)
const gitlab = require('../pages/api/gitlab').default

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

test('GitLab uses one response contract for REST bodies, counts and GraphQL', async t => {
  const envKeys = ['GITLAB_API', 'GITLAB_API_GRAPHQL', 'GITLAB_TOKENS'] as const
  const previous = envKeys.map(key => process.env[key])
  t.after(() => {
    envKeys.forEach((key, index) => {
      if (previous[index] === undefined) delete process.env[key]
      else process.env[key] = previous[index]
    })
  })
  t.mock.method(console, 'log', () => {})
  t.mock.method(console, 'error', () => {})
  let status = 200
  let body: unknown = []
  let total: string | undefined
  const requests: { method?: string, url: string, authorization?: string, body: string }[] = []
  const upstream = createServer(async (req, res) => {
    let payload = ''
    for await (const chunk of req) payload += chunk
    requests.push({ method: req.method, url: req.url!, authorization: req.headers.authorization, body: payload })
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    if (total !== undefined) res.setHeader('X-Total', total)
    res.end(JSON.stringify(body))
  })
  upstream.listen(0, '127.0.0.1')
  await once(upstream, 'listening')
  t.after(() => { upstream.closeAllConnections(); upstream.close() })
  const address = upstream.address() as { port: number }
  const base = `http://127.0.0.1:${address.port}`
  process.env.GITLAB_API = `${base}/self-hosted/api/v4`
  process.env.GITLAB_API_GRAPHQL = `${base}/self-hosted/api/graphql`
  delete process.env.GITLAB_TOKENS

  async function badge (topic: string, project = 'owner/repo', ref = '') {
    const res = response()
    const url = `/gitlab/${topic}/${project}${ref ? `/${ref}` : ''}`
    await gitlab({ url, query: {}, method: 'GET', headers: { host: 'badgen.net' } } as NextApiRequest, res)
    return res
  }

  function assertBadge (res: ReturnType<typeof response>, label: string) {
    assert.equal(res.statusCode, 200, res.body)
    assert.ok(res.body.includes(`aria-label="${label}"`), res.body)
  }

  await t.test('release, last commit and license read JSON without a count header', async () => {
    for (const release of [{ name: 'v1.2.3' }, { tag_name: 'v1.2.3' }]) {
      body = [release]
      assertBadge(await badge('release'), 'release: v1.2.3')
      assert.equal(requests.at(-1)?.url, '/self-hosted/api/v4/projects/owner%2Frepo/releases')
    }
    body = [{ committed_date: new Date().toISOString() }]
    assertBadge(await badge('last-commit'), 'last commit: less than a minute ago')
    body = { license: { name: 'MIT License' } }
    assertBadge(await badge('license'), 'license: MIT License')
    assert.equal(requests.at(-1)?.url, '/self-hosted/api/v4/projects/owner%2Frepo?license=true')
    assert.ok(requests.every(request => request.authorization === undefined))
  })

  await t.test('empty collections and missing license retain their badges', async () => {
    body = []
    assertBadge(await badge('release'), 'release: none')
    assertBadge(await badge('last-commit'), 'last commit: none')
    body = {}
    assertBadge(await badge('license'), 'license: no license')
  })

  await t.test('all count topics use X-Total, keeping state filters and labels', async () => {
    body = []
    total = '1234'
    for (const [topic, label, state] of [
      ['mrs', 'MRs'], ['open-mrs', 'open MRs', 'opened'], ['closed-mrs', 'closed MRs', 'closed'],
      ['merged-mrs', 'merged MRs', 'merged'], ['commits', 'commits'], ['branches', 'branches'],
      ['releases', 'releases'], ['tags', 'tags'], ['contributors', 'contributors']
    ]) {
      assertBadge(await badge(topic), `${label}: 1.2K`)
      if (state) assert.equal(new URL(requests.at(-1)!.url, base).searchParams.get('state'), state)
    }
    total = undefined
  })

  await t.test('custom API prefixes, nested projects and refs preserve URL encoding', async () => {
    body = []
    total = '0'
    process.env.GITLAB_API += '/'
    assertBadge(await badge('commits', 'space%2Fgroup/repo', 'feature%2Ffix%26more%2Bplus'), 'commits: 0')
    const url = new URL(requests.at(-1)!.url, base)
    assert.equal(url.pathname, '/self-hosted/api/v4/projects/space%2Fgroup%2Frepo/repository/commits')
    assert.equal(url.searchParams.get('ref_name'), 'feature/fix&more+plus')
    assert.deepEqual([...url.searchParams.keys()], ['ref_name'])
    total = undefined
  })

  await t.test('GraphQL posts JSON to the configured endpoint with optional tokens', async () => {
    body = { data: { project: { starCount: 42 } } }
    assertBadge(await badge('stars'), 'stars: 42')
    const request = requests.at(-1)!
    assert.equal(request.method, 'POST')
    assert.equal(request.url, '/self-hosted/api/graphql')
    assert.equal(request.authorization, undefined)
    assert.match(JSON.parse(request.body).query, /project\(fullPath:"owner\/repo"\)/)
    assert.match(JSON.parse(request.body).query, /starCount/)
    process.env.GITLAB_TOKENS = ' fixture-token '
    assertBadge(await badge('stars'), 'stars: 42')
    assert.equal(requests.at(-1)?.authorization, 'Bearer fixture-token')
    body = { license: null }
    assertBadge(await badge('license'), 'license: no license')
    assert.equal(requests.at(-1)?.authorization, 'Bearer fixture-token')
    body = { data: { project: null } }
    assertBadge(await badge('stars'), 'gitlab: not found')
  })

  await t.test('REST and GraphQL HTTP errors use the shared error boundary without retrying', async () => {
    for (const topic of ['release', 'stars']) {
      const count = requests.length
      status = 429
      body = { message: 'rate limited' }
      const res = await badge(topic)
      assert.equal(res.statusCode, 502)
      assert.ok(res.body.includes('429'))
      assert.equal(res.getHeader('Cache-Control'), 'public, max-age=5, s-maxage=5')
      assert.equal(requests.length, count + 1)
    }
  })
})
