import cheerio from 'cheerio'
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

async function handler ({ user, repo, branch = 'master', targetFile }: PathArgs) {
  const badgeUrl = `https://snyk.io/test/github/${user}/${repo}/${branch}/badge.svg`
  const searchParams = new URLSearchParams()
  if (targetFile) searchParams.set('targetFile', targetFile)
  const svg = await got(badgeUrl, { searchParams }).text()
  const $ = cheerio.load(svg, { xmlMode: true })

  const $color = $('g[mask] path')
    .filter((_, el) => el.attribs.d?.startsWith('M90'))
    .first()

  const $subject = $('g text')
    .filter((_, el) => parseInt(el.attribs.x, 10) === 45)
    .first()

  const $status = $('g text')
    .filter((_, el) => parseInt(el.attribs.x, 10) === 100)
    .first()

  const subject = $subject.text().trim() || 'vulnerabilities'
  const status = $status.text().trim()
  const color = ($color.attr('fill')?.trim() || '').replace(/^#/, '')

  if (!status || !color) {
    const context = [
      `${user}/${repo}/${branch}`,
      targetFile && `targetFile=${targetFile}`
    ].filter(Boolean).join(' ')
    throw new Error(`Unknown Synk status: ${context}`)
  }

  return { subject, status, color }
}
