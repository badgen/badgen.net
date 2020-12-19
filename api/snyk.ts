import got from '../libs/got'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Snyk',
  examples: {
    '/snyk/badgen/badgen.net': 'vulnerability scan',
    '/snyk/babel/babel/6.x': 'vulnerability scan (branch)',
    '/snyk/rollup/plugins/master/packages%2Falias%2Fpackage.json': 'vulnerability scan (custom path)'
  },
  handlers: {
    '/snyk/:user/:repo/:branch?/:targetFile?': handler
  }
})

async function handler ({ user, repo, branch, targetFile }: PathArgs) {
  const path = [user, repo, branch].filter(Boolean).join('/')
  const badgeUrl = `https://snyk.io/test/github/${path}/badge.svg`
  const searchParams = new URLSearchParams()
  if (targetFile) searchParams.set('targetFile', targetFile)
  const svg = await got(badgeUrl, { searchParams, timeout: 3500 }).text()

  const subject = svg.match(/<text x="45"[^>]*?>([^<]+)<\//i)?.[1].trim()
  const status = svg.match(/<text x="100"[^>]*?>([^<]+)<\//i)?.[1].trim()
  const color = svg.match(/<path fill="([^"]+)" d="M90/i)?.[1].trim()

  if (!status || !color) {
    const context = [
      `${user}/${repo}/${branch}`,
      targetFile && `targetFile=${targetFile}`
    ].filter(Boolean).join(' ')
    throw new Error(`Unknown Synk status: ${context}`)
  }

  return {
    subject: subject || 'vulnerabilities',
    status,
    color: color.replace(/^#/, '')
  }
}
