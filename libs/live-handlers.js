const { get } = require('micro-fork')
const got = require('./got.js')
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
    } = await fetchGateway(req, name, fn)

    const style = req.headers.host === 'flat.badgen.net' ? 'flat' : undefined
    req.params = { subject, status, color, style }
    serveBadge(req, res, {
      code: failed ? 500 : 200,
      sMaxAge: failed ? '0' : '360'
    })
  })
})

const { API_HOST = 'https://api.badgen.net' } = process.env
const fetchGateway = (req, name, fn) => {
  const host = req.headers.host
  if (host === 'badgen.net' || host === 'flat.badgen.net' || process.env.API_HOST) {
    return got(API_HOST + req.url).then(
      res => res.body,
      err => ({ failed: true, ...(err.response && err.response.body) })
    )
  } else {
    return liveFetcher(name, fn, req.params['*'])
  }
}
