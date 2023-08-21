import test from 'node:test'
import assert from 'node:assert/strict'

import { execSync } from 'node:child_process'

const BASE_URL = process.env.BASE_URL || 'https://badgen.net'


test('/static: simple static badge', async (t) => {
    const badgeURL = `${BASE_URL}/static/v1.2.3/blue`
    const response = await fetch(badgeURL)

    assert.strictEqual(response.status, 200)
    assert.strictEqual(response.headers.get('content-type'), 'image/svg+xml;charset=utf-8')
});


test('/memo: update "depoyed" badge', async (t) => {
    if (!process.env.MEMO_BADGE_TOKEN) {
        throw new Error('MEMO_BADGE_TOKEN is required to run this test')
    }
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
