const badgenServe = require('../libs/badgen-serve.js')

const examples = [
  '/badge/Swift/4.2/orange',
  '/badge/license/MIT/blue',
  '/badge/chat/on%20gitter/cyan',
  '/badge/stars/★★★★☆',
  '/badge/become/a%20patron/F96854',
  '/badge/code%20style/standard/f2a',
  '/badge/platform/ios,macos,tvos?list=1'
]

const handler = async (args) => {
  const { label, status, color } = args
  return {
    subject: label,
    status,
    color
  }
}

const handlers = {
  '/badge/:label/:status': handler,
  '/badge/:label/:status/:color': handler
}

module.exports = badgenServe(handlers, { examples })
