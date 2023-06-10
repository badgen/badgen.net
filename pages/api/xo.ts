import got from '../../libs/got'
import { createBadgenHandler } from '../../libs/create-badgen-handler-next'

import type { PathArgs, BadgenResult } from '../../libs/create-badgen-handler-next'

export default createBadgenHandler({
  title: 'XO',
  examples: {
    '/xo/status/badgen': 'status',
    '/xo/status/chalk': 'status',
    '/xo/indent/@tusbar/cache-control': 'indent',
    '/xo/semi/got': 'semicolons',
  },
  handlers: {
    '/xo/:topic<status|indent|semi>/:name': handler,
    '/xo/:topic<status|indent|semi>/:scope<@.+>/:name': handler
  }
})

const getIndent = space => {
  if (space === false) return 'tab'
  if (space === true) return '2 spaces'
  if (space === 1) return '1 space'
  return `${space} spaces`
}

async function handler ({ topic, scope, name }: PathArgs): BadgenResult {
  const pkg = scope ? `${scope}/${name}` : name
  const endpoint = `https://cdn.jsdelivr.net/npm/${pkg}/package.json`
  const data = await got(endpoint).json<any>()

  if (!data.devDependencies || !('xo' in data.devDependencies)) {
    return {
      subject: 'xo',
      status: 'not enabled',
      color: 'grey'
    }
  }

  const {
    semicolon = true,
    space = false
  } = (data.xo || {})

  switch (topic) {
    case 'status':
      return {
        subject: 'code style',
        status: 'XO',
        color: '5ED9C7'
      }

    case 'indent':
      return {
        subject: 'indent',
        status: getIndent(space),
        color: '5ED9C7'
      }

    case 'semi':
      return {
        subject: 'semicolons',
        status: semicolon ? 'enabled' : 'disabled',
        color: '5ED9C7'
      }

    default:
      return {
        subject: 'XO',
        status: 'unknown topic',
        color: 'red'
      }
  }
}
