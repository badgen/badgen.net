import got from '../libs/got'
import { version, versionColor } from '../libs/utils'
import { badgenServe } from '../libs/badgen-serve'

const examples = [
  '/homebrew/v/fish',
  '/homebrew/v/cake'
]

const handlers = {
  '/homebrew/v/:pkg': handler
}

async function handler (args) {
  const { pkg } = args

  const endpoint = `https://formulae.brew.sh/api/formula/${pkg}.json`
  const { versions } = await got(endpoint).then(res => res.body)

  return {
    subject: 'homebrew',
    status: version(versions.stable),
    color: versionColor(versions.stable)
  }
}

export default badgenServe(handlers, { examples })
