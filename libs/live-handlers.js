const axios = require('./axios.js')
const { get } = require('micro-fork')
const liveFns = require('./live-fns/_index.js')
const serveBadge = require('./serve-badge.js')
const liveFetcher = require('./live-fetcher.js')

const { API_HOST } = process.env
const apiFetcher = async url => {
  return axios.get(API_HOST + url).then(
    res => res.data,
    err => {
      console.error('API_ERR', url, err.message)
      return { ...err.response.data, httpCode: 200 }
    }
  )
}

module.exports = Object.entries(liveFns).map(([name, fn]) => {
  return get(`/${name}/*`, async (req, res) => {
    const {
      subject = name,
      status = 'unknown',
      color = 'grey',
      failed = false,
      httpCode = 200
    } = await (
      API_HOST
        ? apiFetcher(req.url)
        : liveFetcher(name, fn, req.params['*'])
    )

    const style = req.headers.host === 'flat.badgen.net' ? 'flat' : undefined
    req.params = { subject, status, color, style }
    serveBadge(req, res, {
      code: httpCode,
      maxAge: failed ? '0' : (Math.random() * 60 + 60).toFixed()
    })
  })
})
