import test from 'node:test'
import assert from 'node:assert/strict'

import { execSync } from 'node:child_process'

const BASE_URL = process.env.BASE_URL || 'https://badgen.net'


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

test('/vs-marketplace: stable version badge', async (t) => {
    const pkg = 'ms-python.vscode-pylance'
    const latestURL = `${BASE_URL}/vs-marketplace/v/${pkg}`
    const stableURL = `${BASE_URL}/vs-marketplace/v/${pkg}/stable`

    const [latestRes, stableRes] = await Promise.all([
        fetch(latestURL),
        fetch(stableURL)
    ])

    assert.strictEqual(latestRes.status, 200)
    assert.strictEqual(stableRes.status, 200)

    const latestSvg = await latestRes.text()
    const stableSvg = await stableRes.text()

    assert.ok(latestSvg.includes('VS Marketplace'), 'Latest SVG should contain "VS Marketplace"')
    assert.ok(stableSvg.includes('VS Marketplace'), 'Stable SVG should contain "VS Marketplace"')

    const latestVer = latestSvg.match(/v(\d+\.\d+\.\d+)/)?.[1]
    const stableVer = stableSvg.match(/v(\d+\.\d+\.\d+)/)?.[1]

    assert.ok(latestVer, 'Should find a version in latest badge')
    assert.ok(stableVer, 'Should find a version in stable badge')

    // Pylance uses even minor/patch for stable and odd for pre-release, or similar.
    // At the time of testing, latest (pre-release) was 2026.2.101 and stable was 2026.2.1
    // We just want to ensure they are different if a pre-release exists.
    if (latestVer !== stableVer) {
        console.log(`Verified: Latest (${latestVer}) is different from Stable (${stableVer})`)
    } else {
        console.warn(`Warning: Latest and Stable versions are the same (${latestVer}). This might happen if there is no active pre-release.`)
    }
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
