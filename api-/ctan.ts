import got from '../libs/got'
import { stars, version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const CTAN_API_URL = 'https://ctan.org/json/2.0/'

const client = got.extend({ prefixUrl: CTAN_API_URL, timeout: { request: 3500 } })

export default createBadgenHandler({
  title: 'CTAN',
  examples: {
    '/ctan/v/latexindent': 'version',
    '/ctan/license/latexdiff': 'license',
    '/ctan/rating/pgf-pie': 'rating',
    '/ctan/stars/pgf-pie': 'stars'
  },
  handlers: {
    '/ctan/:topic<v|license>/:pkg': apiHandler,
    '/ctan/:topic<rating|stars>/:pkg': webHandler
  }
})

async function apiHandler ({ topic, pkg }: PathArgs) {
  const {
    license,
    version: versionInfo,
  } = await client.get(`pkg/${pkg}`).json<any>()
  const { number: ver } = versionInfo

  switch (topic) {
    case 'v':
      return {
        subject: 'ctan',
        status: version(ver),
        color: versionColor(ver)
      }
    case 'license':
      return {
        subject: 'license',
        status: license || 'unknown',
        color: 'green'
      }
  }
}

async function webHandler ({ topic, pkg }: PathArgs) {
  const url = 'https://ctan.org/vote/ajaxSummary'
  const searchParams = { pkg }
  const html = await got.get(url, { searchParams }).text()
  const rating = Number(html.match(/<span>[^<]*?([\d.]+)\s/i)?.[1])

  switch (topic) {
    case 'rating':
      return {
        subject: 'rating',
        status: `${rating.toFixed(2)}/5`,
        color: 'green'
      }
    case 'stars':
      return {
        subject: 'stars',
        status: stars(rating),
        color: 'green'
      }
  }
}
