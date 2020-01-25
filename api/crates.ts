import got from '../libs/got'
import { millify, version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Rust Crates',
  examples: {
    '/crates/v/regex': 'version',
    '/crates/d/regex': 'downloads',
    '/crates/dl/regex': 'downloads (latest version)',
  },
  handlers: {
    '/crates/:topic<v|d|dl>/:pkg': handler
  }
})

async function handler ({topic, pkg}: PathArgs) {
  const endpoint = `https://crates.io/api/v1/crates/${pkg}`
  const { crate } = await got(endpoint).json<any>()

  switch (topic) {
    case 'v':
      return {
        subject: 'crates.io',
        status: version(crate.max_version),
        color: versionColor(crate.max_version)
      }
    case 'd':
      return {
        subject: 'downloads',
        status: millify(crate.downloads),
        color: 'green'
      }
    case 'dl':
      return {
        subject: 'downloads',
        status: millify(crate.recent_downloads) + ' latest version',
        color: 'green'
      }
  }
}
