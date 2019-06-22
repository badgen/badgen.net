import { badgenServe } from '../libs/badgen-serve'

export const examples = [
  {
    title: 'General',
    examples: {
    '/badge/Swift/4.2/orange': 'swift version',
    '/badge/license/MIT/blue': 'license MIT',
    '/badge/chat/on%20gitter/cyan': 'chat on gitter',
    '/badge/stars/★★★★☆': 'star rating',
    '/badge/become/a%20patron/F96854': 'patron',
    '/badge/code%20style/standard/f2a': 'code style: standard'
    }
  }, {
    title: 'Options',
    examples: {
      '/badge/icon/github?icon=github': 'use builtin icon',
      '/badge/github/github?icon': 'use builtin icon (by subject)',
      '/badge/jquery/powered?icon=https://simpleicons.now.sh/jquery/fff': 'use external icon',
      '/badge/icon/github?label=custom label': 'custom label',
      '/badge/icon/github?label': 'disable label',
      '/badge/github/github?icon&label': 'use icon, disable label',
      '/badge/platform/ios,macos,tvos?list=|': 'list (custom seprator)'
    }
  }
]

export const handlers = {
  '/badge/:label/:status': handler,
  '/badge/:label/:status/:color': handler
}

async function handler (args) {
  const { label, status, color } = args
  return {
    subject: label,
    status,
    color
  }
}

export default badgenServe(handlers)
