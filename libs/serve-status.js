const axios = require('axios')
const { send } = require('micro')

module.exports = async function (req, res) {
  const [
    githubRateLimit
  ] = await Promise.all([
    axios('https://api.github.com/rate_limit').then(res => res.data.resources)
  ])

  send(res, 200, { githubRateLimit })
}
