const axios = require('axios')
const { send } = require('micro')
const livePool = require('./live-pool.js')

module.exports = async (req, res) => {
  const [githubRateLimit] = await Promise.all([getGithubRateLimit()])
  const fetching = Object.values(livePool.list()).filter(Boolean).length

  send(res, 200, { githubRateLimit, fetching })
}

const getGithubRateLimit = () => {
  const url = 'https://api.github.com/rate_limit'
  const token = process.env.GH_TOKEN
  const headers = token && { Authorization: `token ${token}` }
  return axios({ url, headers }).then(res => res.data.resources)
}
