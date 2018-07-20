const serveBadge = require('./serve-badge.js')

module.exports = (req, res) => {
  serveBadge(req, res, {
    subject: '',
    status: ''
  })
}
