import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import { listed, unlisted } from '../libs/service-registry.json'

const require = createRequire(import.meta.url)

test('every service has public badge and documentation routes, including unlisted services', async () => {
  const services = [...listed, ...unlisted]
  assert.equal(new Set(services).size, services.length, 'Services must be registered exactly once')
  const files = readdirSync(new URL('../pages/api/', import.meta.url)).map(file => file.replace(/\.ts$/, ''))
  assert.deepEqual([...services].sort(), files.sort(), 'New API handlers must be registered')
  const rewrites = await require('../next.config.js').rewrites()
  for (const service of [...services, 'badge']) {
    const destination = `/api/${service === 'badge' ? 'static' : service}`
    for (const source of [`/${service}`, `/${service}/:path*`]) {
      assert.deepEqual(rewrites.find(route => route.source === source), { source, destination })
    }
  }
})
