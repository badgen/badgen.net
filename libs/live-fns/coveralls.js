const axios = require('../axios.js')
const covColor = require('../utils/cov-color.js')

module.exports = async function (topic, platform, user, repo, branch) {
  // only support topic="c" fow now

  const query = branch ? `?branch=${branch}` : ''
  const endpoint = `https://coveralls.io/${platform}/${user}/${repo}.json${query}`

  /* eslint-disable camelcase */
  const { covered_percent } = await axios.get(endpoint).then(res => res.data)

  return {
    subject: 'coverage',
    status: Number(covered_percent).toFixed(1) + '%',
    color: covColor(covered_percent)
  }
}
