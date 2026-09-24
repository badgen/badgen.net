import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { request, badge } from './http-helpers.mjs'

test('/static: renders the requested label, status and color', { timeout: 30000 }, async () => {
    const svg = await badge('/static/version/1.2.3/123abc')
    assert.ok(svg.includes('<title>version: 1.2.3</title>'), svg)
    assert.match(svg, /fill="#123abc"/i)
})

test('/memo: persists a badge and renders it on first read', { timeout: 45000 }, async () => {
    const key = `e2e-${randomUUID()}`
    const token = randomUUID()
    const params = { label: 'e2e', status: randomUUID(), color: '123abc' }
    const path = `/memo/${key}`

    // Each run owns a fresh key; it expires under memo's normal 32-day policy.
    const { body } = await request(`${path}/${params.label}/${params.status}/${params.color}`, {
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` }
    })
    assert.deepEqual(JSON.parse(body), params)

    // Do not GET before the write: a missing-badge response could be cached.
    const svg = await badge(path)
    assert.ok(svg.includes(`<title>${params.label}: ${params.status}</title>`), svg)
    assert.match(svg, /fill="#123abc"/i)
})
