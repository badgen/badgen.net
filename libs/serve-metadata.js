const { send } = require('micro')
const icons = require('badgen-icons')

module.exports = (req, res) => {
  const code = 200

  const info = {
    icons: Object.keys(icons)
  }

  res.setHeader('Content-Type', 'application/json')
  send(res, code, JSON.stringify(info))
}
