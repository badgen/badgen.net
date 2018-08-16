const axios = require('axios')
const { send } = require('micro')
const livePool = require('./live-pool.js')

module.exports = async (req, res) => {
  const [githubRateLimit] = await Promise.all([getGithubRateLimit()])
  const fetching = Object.values(livePool.list()).filter(Boolean).length
  const cpuUsage = process.cpuUsage()
  const memUsage = process.memoryUsage()

  const stats = { githubRateLimit, fetching, cpuUsage, memUsage }

  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=1, s-maxage=1')
  send(res, 200, JSON.stringify(stats, null, 2))
}

const getGithubRateLimit = () => {
  const url = 'https://api.github.com/rate_limit'
  const token = process.env.GH_TOKEN
  const headers = token && { Authorization: `token ${token}` }
  return axios({ url, headers }).then(res => res.data.resources)
}
