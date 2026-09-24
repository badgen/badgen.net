import test from 'node:test'
import assert from 'node:assert/strict'
import { badge } from '../http-helpers.mjs'

test('/vs-marketplace: stable and latest version badges', { timeout: 30000 }, async () => {
    const pkg = 'ms-python.vscode-pylance'
    const badges = await Promise.all([
        badge(`/vs-marketplace/v/${pkg}`),
        badge(`/vs-marketplace/v/${pkg}/latest`)
    ])
    for (const svg of badges) {
        assert.match(svg, /<title>VS Marketplace: v\d+\.\d+\.\d+<\/title>/)
    }
})

for (const [topic, label] of [
    ['stars', 'stars'],
    ['issues', 'open issues'],
    ['commits', 'commits'],
    ['prs', 'PRs'],
    ['release', 'release']
]) {
    test(`/codeberg/${topic}/forgejo/forgejo`, { timeout: 30000 }, async () => {
        const svg = await badge(`/codeberg/${topic}/forgejo/forgejo`)
        assert.ok(svg.includes(`<title>${label}: `), svg)
    })
}
