const got = require('got')

const { TRACKING_GA, NOW_URL } = process.env

// Send stats to google analytics
module.exports = (category, action, label, value) => {
  if (!TRACKING_GA) return

  got.get('https://www.google-analytics.com/collect', {
    query: {
      v: '1',
      tid: TRACKING_GA,
      cid: NOW_URL || '000',
      t: 'event',
      ec: category,
      ea: action,
      el: label,
      ev: value
    }
  })
}
