import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const CTAN_API_URL = 'https://ctan.org/json/2.0/'

const client = got.extend({ prefixUrl: CTAN_API_URL, timeout: 3500 })

export default createBadgenHandler({
  title: 'CTAN',
  examples: {
    '/ctan/v/latexindent': 'version',
    '/ctan/license/latexdiff': 'license'
  },
  handlers: {
    '/ctan/:topic<v|license>/:pkg': handler,
  }
})

async function handler ({ topic, pkg }: PathArgs) {
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
