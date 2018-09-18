const { get } = require('micro-fork')
const liveFns = require('./live-fns/_index.js')
const serveBadge = require('./serve-badge.js')
const liveFetcher = require('./live-fetcher.js')

module.exports = Object.entries(liveFns).map(([name, fn]) => {
  return get(`/${name}/*`, async (req, res) => {
    const {
      subject = name,
      status = 'unknown',
      color = 'grey',
      failed = false
    } = await liveFetcher(name, fn, req.params['*'])

    const style = req.headers.host === 'flat.badgen.net' ? 'flat' : undefined
    req.params = { subject, status, color, style }
    serveBadge(req, res, {
      code: 200, // always 200 for badges
      sMaxAge: failed ? '0' : '360'
    })
  })
})
