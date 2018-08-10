const serveBadge = require('./serve-badge.js')

module.exports = (req, res) => {
  req.params = {
    subject: '',
    status: ''
  }
  serveBadge(req, res)
}
