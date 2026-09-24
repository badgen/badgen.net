import assert from 'node:assert/strict'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

export async function request (path, options = {}) {
    const url = new URL(path, BASE_URL)
    const started = Date.now()
    let response
    let body
    try {
        response = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) })
        body = await response.text()
    } catch (cause) {
        throw new Error(`${options.method || 'GET'} ${url} failed after ${Date.now() - started}ms`, { cause })
    }
    const diagnostic = `${options.method || 'GET'} ${url}: HTTP ${response.status} after ${Date.now() - started}ms\n` +
        `Error-Message: ${response.headers.get('error-message') || '(none)'}\n${body.slice(0, 1000)}`
    assert.equal(response.status, 200, diagnostic)
    return { response, body, diagnostic }
}

export async function badge (path) {
    const { response, body, diagnostic } = await request(path)
    const mediaType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
    assert.equal(mediaType, 'image/svg+xml', diagnostic)
    assert.match(body, /<svg\b/, diagnostic)
    assert.match(body, /<\/svg>\s*$/, diagnostic)
    return body
}
