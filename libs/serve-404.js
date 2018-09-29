const serveBadge = require('./serve-badge.js')
const sendStats = require('./send-stats.js')

module.exports = (req, res) => {
  req.params = {
    subject: 'Badgen',
    status: '404',
    color: 'orange'
  }
  serveBadge(req, res, { code: 404 })
  sendStats('invalid', '404', req.url)
}
