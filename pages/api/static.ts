import { createBadgenHandler } from '../../libs/create-badgen-handler-next'

import type { PathArgs } from '../../libs/create-badgen-handler-next'

export default createBadgenHandler({
  title: 'Static Badge',
  examples: {
  '/static/Swift/4.2/orange': 'swift version',
  '/static/license/MIT/blue': 'license MIT',
  '/static/chat/on%20gitter/cyan': 'chat on gitter',
  '/static/stars/★★★★☆': 'star rating',
  '/static/become/a%20patron/F96854': 'patron',
  '/static/code%20style/standard/f2a': 'code style: standard'
  },
  handlers: {
    '/static/:label/:status': handler,
    '/static/:label/:status/:color': handler,
    '/badge/:label/:status': handler,
    '/badge/:label/:status/:color': handler
  }
})

async function handler ({ label, status, color }: PathArgs) {
  return {
    subject: label,
    status,
    color
  }
}
