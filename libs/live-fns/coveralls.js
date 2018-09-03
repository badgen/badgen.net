const axios = require('../axios.js')
const covColor = require('../utils/cov-color.js')
const covFormat = require('../utils/cov-format.js')

module.exports = async (topic, platform, user, repo, branch) => {
  switch (topic) {
    case 'c':
      return coverage(platform, user, repo, branch)
    default:
      return {
        status: 'unknown topic'
      }
  }
}

// Detect coveralls.io's badge redirection instead of using it's api
// See https://github.com/amio/badgen-service/issues/96
const coverage = async (platform, user, repo, branch) => {
  const query = branch ? `?branch=${branch}` : ''
  const badgeURL = await axios({
    url: `https://coveralls.io/repos/${platform}/${user}/${repo}/badge.svg${query}`,
    method: 'head',
    maxRedirects: 0,
    // Expecting 302 redirection to "coveralls_xxx.svg"
    validateStatus: status => status >= 200 && status < 400
  }).then(res => res.headers.location)

  try {
    const percentage = badgeURL.match(/_(\d+)\.svg/)[1]
    return {
      subject: 'coverage',
      status: covFormat(percentage),
      color: covColor(Number(percentage))
    }
  } catch (e) {
    return {
      subject: 'coverage',
      status: 'invalid'
    }
  }
}
