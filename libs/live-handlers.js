const axios = require('./axios.js')
const { get } = require('micro-fork')
const liveFns = require('./live-fns/_index.js')
const serveBadge = require('./serve-badge.js')
const liveFetcher = require('./live-fetcher.js')

const { API_HOST } = process.env

module.exports = Object.entries(liveFns).map(([name, fn]) => {
  return get(`/${name}/*`, async (req, res) => {
    const {
      subject = name,
      status = 'unknown',
      color = 'grey',
      failed = false
    } = await (API_HOST
      ? axios(API_HOST + req.url).then(res => res.data)
      : liveFetcher(name, fn, req.params['*'])
    )

    const style = req.headers.host === 'flat.badgen.net' ? 'flat' : undefined
    req.params = { subject, status, color, style }
    serveBadge(req, res, {
      maxAge: failed ? '0' : (Math.random() * 60 + 60).toFixed()
    })
  })
})
