import test from 'node:test'
import assert from 'node:assert/strict'

import { execSync } from 'node:child_process'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'


test('/static: simple static badge', async (t) => {
    const badgeURL = `${BASE_URL}/static/v1.2.3/blue`
    const response = await fetch(badgeURL)

    assert.strictEqual(response.status, 200)
    assert.strictEqual(response.headers.get('content-type'), 'image/svg+xml;charset=utf-8')
})


test('/memo: update "depoyed" badge', { skip: !process.env.MEMO_BADGE_TOKEN }, async (t) => {
    const status = getGitLastCommitDate()
    const label = 'Deployed'
    const color = getGitCurrentBranch() === 'main' ? 'green' : 'cyan'

    const badgeURL = `${BASE_URL}/memo/deployed/${label}/${status}/${color}`
    const fetchOptions = {
        method: 'PUT',
        headers: {
            authorization: `Bearer ${process.env.MEMO_BADGE_TOKEN}`
        }
    }

    const response = await fetch(badgeURL, fetchOptions)
    assert.strictEqual(response.status, 200)

    const result = await response.json()
    assert.deepEqual(result, { status, label, color })
})

test('/vs-marketplace: stable and latest version badges', async (t) => {
    const pkg = 'ms-python.vscode-pylance'
    const defaultURL = `${BASE_URL}/vs-marketplace/v/${pkg}`
    const latestURL = `${BASE_URL}/vs-marketplace/v/${pkg}/latest`

    const [defaultRes, latestRes] = await Promise.all([
        fetch(defaultURL),
        fetch(latestURL)
    ])

    assert.strictEqual(defaultRes.status, 200)
    assert.strictEqual(latestRes.status, 200)
    assert.strictEqual(defaultRes.headers.get('content-type'), 'image/svg+xml;charset=utf-8')
    assert.strictEqual(latestRes.headers.get('content-type'), 'image/svg+xml;charset=utf-8')

    const defaultSvg = await defaultRes.text()
    const latestSvg = await latestRes.text()

    assert.ok(defaultSvg.includes('VS Marketplace'), 'Default SVG should contain "VS Marketplace"')
    assert.ok(latestSvg.includes('VS Marketplace'), 'Latest SVG should contain "VS Marketplace"')

    const defaultVer = defaultSvg.match(/v(\d+\.\d+\.\d+)/)?.[1]
    const latestVer = latestSvg.match(/v(\d+\.\d+\.\d+)/)?.[1]

    assert.ok(defaultVer, 'Should find a version in default badge')
    assert.ok(latestVer, 'Should find a version in latest badge')
})


test('/codeberg/stars/forgejo/forgejo', async (t) => {
    const badgeURL = `${BASE_URL}/codeberg/stars/forgejo/forgejo`
    const response = await fetch(badgeURL)

    assert.strictEqual(response.status, 200)
    assert.strictEqual(response.headers.get('content-type'), 'image/svg+xml;charset=utf-8')
})


test('/codeberg/issues/forgejo/forgejo', async (t) => {
    const badgeURL = `${BASE_URL}/codeberg/issues/forgejo/forgejo`
    const response = await fetch(badgeURL)

    assert.strictEqual(response.status, 200)
    assert.strictEqual(response.headers.get('content-type'), 'image/svg+xml;charset=utf-8')
})


test('/codeberg/commits/forgejo/forgejo', async (t) => {
    const badgeURL = `${BASE_URL}/codeberg/commits/forgejo/forgejo`
    const response = await fetch(badgeURL)

    assert.strictEqual(response.status, 200)
    assert.strictEqual(response.headers.get('content-type'), 'image/svg+xml;charset=utf-8')
})


test('/codeberg/prs/forgejo/forgejo', async (t) => {
    const badgeURL = `${BASE_URL}/codeberg/prs/forgejo/forgejo`
    const response = await fetch(badgeURL)

    assert.strictEqual(response.status, 200)
    assert.strictEqual(response.headers.get('content-type'), 'image/svg+xml;charset=utf-8')
})


test('/codeberg/release/forgejo/forgejo', async (t) => {
    const badgeURL = `${BASE_URL}/codeberg/release/forgejo/forgejo`
    const response = await fetch(badgeURL)

    assert.strictEqual(response.status, 200)
    assert.strictEqual(response.headers.get('content-type'), 'image/svg+xml;charset=utf-8')
})


function getGitLastCommitDate () {
    const lastCommitDateString = execSync('git log -1 --format=%cI').toString().trim()
    return extractBareDate(lastCommitDateString)
}

function extractBareDate(dateString) {
    return new Date(dateString).toISOString().substring(0, 10)
}

function getGitCurrentBranch () {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
}
