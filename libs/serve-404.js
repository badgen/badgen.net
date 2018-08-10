const serveBadge = require('./serve-badge.js')

module.exports = (req, res) => {
  req.params = {
    subject: 'Badgen',
    status: '404',
    color: 'red'
  }
  serveBadge(req, res, { code: 404 })
}
