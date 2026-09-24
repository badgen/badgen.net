import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

delete process.env.SENTRY_DSN
const require = createRequire(import.meta.url)
const marketplace = require('../pages/api/vs-marketplace').default
const versionBadge = marketplace.meta.handlers['/vs-marketplace/:topic<v|i|d|rating>/:pkg/:tag?']

const preRelease = [{ key: 'Microsoft.VisualStudio.Code.PreRelease', value: 'true' }]
const fixtures = [
  {
    name: 'default skips a newer pre-release while latest includes it',
    versions: [
      { version: '2.0.0', properties: preRelease },
      { version: '1.2.3', properties: [{ key: 'Microsoft.VisualStudio.Code.PreRelease', value: 'false' }] }
    ],
    stable: 'v1.2.3', latest: 'v2.0.0'
  },
  {
    name: 'stable-only releases produce equal default and latest badges',
    versions: [{ version: '1.2.3', properties: [] }],
    stable: 'v1.2.3', latest: 'v1.2.3'
  },
  {
    name: 'a version without properties remains a stable release',
    versions: [
      { version: '2.0.0', properties: preRelease },
      { version: '1.2.3' }
    ],
    stable: 'v1.2.3', latest: 'v2.0.0'
  },
  {
    name: 'default falls back to the newest version when every release is pre-release',
    versions: [
      { version: '2.0.0', properties: preRelease },
      { version: '1.9.0', properties: preRelease }
    ],
    stable: 'v2.0.0', latest: 'v2.0.0'
  }
]

test('VS Marketplace selects versions independently of current upstream releases', async t => {
  for (const fixture of fixtures) {
    await t.test(fixture.name, async t => {
      const flags: number[] = []
      t.mock.method(globalThis, 'fetch', async (_url, options) => {
        assert.equal(options.method, 'POST')
        flags.push(JSON.parse(options.body).flags)
        return Response.json({ results: [{ extensions: [{ versions: fixture.versions }] }] })
      })

      for (const [tag, expected] of [[undefined, fixture.stable], ['latest', fixture.latest]]) {
        const badge = await versionBadge({ topic: 'v', pkg: 'publisher.extension', tag })
        assert.equal(badge.subject, 'VS Marketplace')
        assert.equal(badge.status, expected)
      }
      assert.deepEqual(flags, [467, 979])
    })
  }
})
