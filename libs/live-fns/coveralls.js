const axios = require('../axios.js')
const covColor = require('../utils/cov-color.js')
const round = require('../utils/round.js')

module.exports = async function (topic, platform, user, repo, branch) {
  // only support topic="c" fow now

  const query = branch ? `?branch=${branch}` : ''
  const endpoint = `https://coveralls.io/${platform}/${user}/${repo}.json${query}`

  /* eslint-disable camelcase */
  const { covered_percent } = await axios.get(endpoint).then(res => res.data)

  return {
    subject: 'coverage',
    status: round(covered_percent, 1) + '%',
    color: covColor(covered_percent)
  }
}
