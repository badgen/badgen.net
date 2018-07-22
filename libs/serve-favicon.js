const serveBadge = require('./serve-badge.js')

module.exports = function serve404 (req, res) {
  req.params = {
    subject: '',
    status: ''
  }
  serveBadge(req, res)
}
