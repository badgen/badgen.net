import test from 'node:test'
import assert from 'node:assert/strict'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test('/email: simple email badge', async (t) => {
    const badgeURL = `${BASE_URL}/email/com/consulting/tunnckocore`
    const response = await fetch(badgeURL)

    assert.strictEqual(response.status, 200)
    assert.strictEqual(response.headers.get('content-type'), 'image/svg+xml;charset=utf-8')
    const body = await response.text()
    assert.ok(body.includes('consulting@tunnckocore.com'))
})

test('/email: email badge with TLD and domain', async (t) => {
    const badgeURL = `${BASE_URL}/email/co.uk/foobar/mydomain`
    const response = await fetch(badgeURL)

    assert.strictEqual(response.status, 200)
    assert.strictEqual(response.headers.get('content-type'), 'image/svg+xml;charset=utf-8')
    const body = await response.text()
    assert.ok(body.includes('foobar@mydomain.co.uk'))
})
