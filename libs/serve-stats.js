const got = require('got')
const { send } = require('micro')
const pool = require('./live-pool.js')

module.exports = async (req, res) => {
  const [githubRateLimit] = await Promise.all([getGithubRateLimit()])
  const memUsage = process.memoryUsage()
  const cpuUsage = process.cpuUsage()
  const fetching = pool.size

  const stats = { githubRateLimit, memUsage, cpuUsage, fetching }

  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=1, s-maxage=1')
  send(res, 200, JSON.stringify(stats, null, 2))
}

const getGithubRateLimit = () => {
  const url = 'https://api.github.com/rate_limit'
  const token = process.env.GH_TOKEN
  const headers = token && { Authorization: `token ${token}` }
  return got(url, { json: true, headers }).then(res => res.body.resources)
}
