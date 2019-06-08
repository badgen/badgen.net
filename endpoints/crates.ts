import got from '../libs/got'
import { millify, version, versionColor } from '../libs/utils'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Rust Crates',
  examples: {
    '/crates/v/regex': 'version',
    '/crates/d/regex': 'downloads',
    '/crates/dl/regex': 'downloads (latest version)',
  }
}

export const handlers: Handlers = {
  '/crates/:topic<v|d|dl>/:pkg': handler
}

export default badgenServe(handlers)

async function handler ({topic, pkg}: Args) {
  const endpoint = `https://crates.io/api/v1/crates/${pkg}`
  const { crate } = await got(endpoint).then(res => res.body)

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
