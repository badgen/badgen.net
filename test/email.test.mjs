import test from 'node:test'
import assert from 'node:assert/strict'
import { badge } from './http-helpers.mjs'

test('/email: simple email badge', { timeout: 30000 }, async () => {
    const svg = await badge('/email/consulting/tunnckocore.com')
    assert.ok(svg.includes('consulting@tunnckocore.com'), svg)
})

test('/email: email badge with TLD in domain', { timeout: 30000 }, async () => {
    const svg = await badge('/email/foobar/mydomain.co.uk')
    assert.ok(svg.includes('foobar@mydomain.co.uk'), svg)
})
