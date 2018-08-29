const { send } = require('micro')
const { builtin } = require('./icons.js')

module.exports = (req, res) => {
  const code = 200

  const info = {
    icons: Object.keys(builtin)
  }

  res.setHeader('Content-Type', 'application/json')
  send(res, code, JSON.stringify(info))
}
