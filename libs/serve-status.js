const axios = require('axios')
const { send } = require('micro')

module.exports = async function (req, res) {
  const [
    githubRateLimit
  ] = await Promise.all([
    getGithubRateLimit()
  ])

  send(res, 200, { githubRateLimit })
}

function getGithubRateLimit () {
  const url = 'https://api.github.com/rate_limit'
  const token = process.env.GH_TOKEN
  const headers = token && { 'Authorization': `token ${token}` }
  return axios({ url, headers }).then(res => res.data.resources)
}
