const serveBadge = require('./serve-badge.js')

module.exports = function serveListBadge (req, res, params) {
  const { subject, status, color } = params
  serveBadge(req, res, { subject, status, color, emoji: true })
}
