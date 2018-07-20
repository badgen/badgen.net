const serveBadge = require('./serve-badge.js')

module.exports = function serveListBadge (req, res, params) {
  serveBadge(req, res, {
    subject: params.subject,
    status: params.status.replace(/,/g, ' | '),
    color: params.color
  })
}
