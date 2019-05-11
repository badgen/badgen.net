const url = require('url')
const qs = require('querystring')
const badgenServe = require('../libs/badgen-serve.js')

const help = ``
const examples = []

const schemes = [
  '/badge/:label/:status',
  '/badge/:label/:status/:color'
]

const handler = async (args) => {
  const { label, status, color } = args
  return {
    subject: label,
    status,
    color
  }
}

module.exports = badgenServe(schemes, handler, { help, examples })
