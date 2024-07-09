import got from '../libs/got'
import { isBadge } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Snyk',
  examples: {
    '/snyk/badgen/badgen.net': 'vulnerability scan',
    '/snyk/babel/babel/6.x': 'vulnerability scan (branch)',
    '/snyk/rollup/plugins/master/packages%2Falias%2Fpackage.json': 'vulnerability scan (custom path)'
  },
  handlers: {
    '/snyk/:owner/:repo/:branch?/:targetFile?': handler
  }
})

async function handler ({ owner, repo, branch, targetFile }: PathArgs) {
  const path = [owner, repo, branch].filter(Boolean).join('/')

  const badgeUrl = `https://snyk.io/test/github/${path}/badge.svg`

  const searchParams = new URLSearchParams()
  if (targetFile) searchParams.set('targetFile', targetFile)

  const resp = await got(badgeUrl, { searchParams })
  const params = isBadge(resp) && parseBadge(resp.body)

  return params || {
    subject: 'snyk',
    status: 'unknown',
    color: 'grey'
  }
}

function parseBadge(svg: string) {
  const [subject, status] = [...svg.matchAll(/fill-opacity=[^>]*?>([^<]+)<\//ig)]
    .map(match => match[1].trim())
  const color = svg.match(/<path[^>]*?fill="([^"]+)"[^>]*?d="M[^0]/i)?.[1]
    .trim().replace(/^#/, '')
  if (!status || !color) return
  return {
    subject: subject || 'vulnerabilities',
    status,
    color
  }
}
